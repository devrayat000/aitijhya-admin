"use client";

import * as z from "zod";
import { Suspense, use, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { InferSelectModel } from "drizzle-orm";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import { bookAuthor, chapter, post, subject } from "@/db/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPost, deletePost, updatePost } from "@/actions/post";
import { getBooksBySubject } from "@/actions/book";
import { getChaptersByBooks } from "@/actions/chapter";
import { Textarea } from "@/components/ui/textarea";
import { upload } from "@vercel/blob/client";
import DropZoneInput from "@/components/drop-zone";
import { createFile } from "@/lib/utils";

const formSchema = z
  .object({
    text: z.string().min(1),
    page: z.preprocess((x) => Number(x), z.number().int().positive()),
    // image: z.instanceof(File),
    keywords: z
      .preprocess(
        (x) =>
          String(x)
            .split(",")
            .map((t) => t.trim()),
        z.string().array()
      )
      .optional(),
    subjectId: z.string().min(1),
    bookAuthorId: z.string().min(1),
    chapterId: z.string().min(1),
  })
  .passthrough();

type PostFormValues = z.infer<typeof formSchema> & {
  image: File | null;
};
type Chapter = InferSelectModel<typeof chapter>;
type Subject = InferSelectModel<typeof subject>;
type Post = InferSelectModel<typeof post> & {
  subject: {
    id: string;
    name: string;
  };
  book: {
    id: string;
    name: string;
  };
  chapter: {
    id: string;
    name: string;
  };
};
interface PostFormProps {
  initialData: {
    subjects: Subject[];
    books: InferSelectModel<typeof bookAuthor>[] | null;
    chapters: Chapter[] | null;
    post: Post | null;
  };
}

export const PostForm: React.FC<PostFormProps> = ({
  initialData: { post: initialData, subjects, books = null, chapters = null },
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const embedRef = useRef<HTMLInputElement>(null);

  const title = initialData ? "Edit post" : "Create post";
  const description = initialData ? "Edit a post." : "Add a new post";
  const toastMessage = initialData ? "Post updated." : "Post created.";
  const action = initialData ? "Save changes" : "Create";

  const defaultEmbed = initialData?.imageUrl
    ? use(createFile(initialData.imageUrl, "image/jpeg"))
    : null;

  const form = useForm<PostFormValues>({
    resolver: zodResolver(formSchema, { async: true }),
    defaultValues: {
      text: initialData?.text ?? "",
      page: initialData?.page ?? 0,
      subjectId: initialData?.subject.id ?? "",
      bookAuthorId: initialData?.book.id ?? "",
      chapterId: initialData?.chapter.id ?? "",
      image: defaultEmbed,
      keywords: initialData?.keywords ?? [],
    },
  });

  const onSubmit = async ({
    subjectId,
    bookAuthorId,
    ...data
  }: PostFormValues) => {
    try {
      setLoading(true);
      // console.log(data);

      if (
        !!data.image &&
        initialData?.imageUrl?.split("/")?.pop() !== data.image?.name
      ) {
        const newBlob = await upload(`images/${data.image.name}`, data.image, {
          access: "public",
          handleUploadUrl: "/api/image/upload",
          multipart: true,
        });
        data.image = null;
        // @ts-ignore
        data["imageUrl"] = newBlob.url;
      }

      if (initialData) {
        console.log("updating", data);

        await updatePost(initialData.id, data);
        // router.refresh();
      } else {
        await createPost({
          text: data.text,
          page: data.page,
          chapterId: data.chapterId,
          keywords: data.keywords,
          // @ts-ignore
          imageUrl: data["imageUrl"],
        });
        // router.push(`/admin/posts/${result.id}`);
      }
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      if (typeof params.postId === "string")
        await deletePost(params.postId as string);
      router.push(`/admin/posts`);
      toast.success("Post deleted.");
    } catch (error: any) {
      toast.error("Make sure you removed all products using this post first.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (embedRef.current && initialData?.imageUrl) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(defaultEmbed!);
      embedRef.current.files = dataTransfer.files;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.imageUrl]);

  const [booksBySubject, getBooksAction] = useFormState(
    getBooksBySubject,
    books
  );

  const [chaptersByBook, getChaptersAction] = useFormState(
    getChaptersByBooks,
    chapters
  );

  return (
    <>
      {initialData && (
        <AlertModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onConfirm={onDelete}
          loading={loading}
        />
      )}
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-8 max-w-lg mx-auto"
        >
          <div className="flex flex-col items-stretch gap-y-4">
            <FormField
              control={form.control}
              name="subjectId"
              disabled={loading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        getBooksAction(value);
                      }}
                      value={field.value}
                      disabled={field.disabled}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bookAuthorId"
              disabled={!booksBySubject || loading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book/Author</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        getChaptersAction(value);
                      }}
                      value={field.value}
                      disabled={field.disabled}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a book" />
                      </SelectTrigger>
                      <SelectContent>
                        {booksBySubject?.map((book) => (
                          <SelectItem key={book.id} value={book.id}>
                            {book.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="chapterId"
              disabled={!chaptersByBook || loading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chapter</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={field.disabled}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a chapter" />
                      </SelectTrigger>
                      <SelectContent>
                        {chaptersByBook?.map((chapter) => (
                          <SelectItem key={chapter.id} value={chapter.id}>
                            {chapter.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="text"
              disabled={loading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Question or Text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              disabled={loading}
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Suspense>
                      <DropZoneInput
                        {...field}
                        ref={embedRef}
                        onFileDrop={(file) => onChange(file)}
                        defaultFile={value || undefined}
                      />
                    </Suspense>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:grid md:grid-cols-2 gap-x-8 gap-y-4">
              <FormField
                control={form.control}
                name="page"
                disabled={loading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page No.</FormLabel>
                    <FormControl>
                      <Input
                        required
                        placeholder="e.g. 40"
                        type="tel"
                        {...field}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keywords"
                disabled={loading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. vector,curl,divergence"
                        {...field}
                        // value={field.value?.join(",")}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value.split(",").map((t) => t.trim())
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
