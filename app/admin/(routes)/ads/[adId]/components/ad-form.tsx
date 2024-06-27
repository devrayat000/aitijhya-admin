"use client";

import * as z from "zod";
import {
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useFormStatus, useFormState } from "react-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
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
import { ad, subject } from "@/db/schema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAd, deleteAd, updateAd } from "@/server/ad/action/ad";
import { upload } from "@vercel/blob/client";
import { createFile } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import DropZoneInput from "@/components/drop-zone";

let formSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  link: z.string().min(1).url(),
  classes: z.array(z.string()).default([]),
});

if (typeof window !== "undefined") {
  formSchema = formSchema.extend({
    embed: z.instanceof(globalThis.File).nullable(),
  });
}

type AdFormValues = z.infer<typeof formSchema> & {
  embed: File | null;
};
type Subject = InferSelectModel<typeof subject>;
type Ad = InferSelectModel<typeof ad> & {
  subjects: {
    id: string;
    name: string;
  }[];
};
interface AdFormProps {
  initialData: {
    subjects: Subject[];
    ad: Ad | null;
  };
}

export const AdForm: React.FC<AdFormProps> = ({
  initialData: { ad: initialData, subjects },
}) => {
  const params = useParams();
  const router = useRouter();
  const embedRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit ad" : "Create ad";
  const description = initialData ? "Edit a ad." : "Add a new ad";
  const toastMessage = initialData ? "Ad updated." : "Ad created.";
  const action = initialData ? "Save changes" : "Create";

  const defaultEmbed = initialData?.imageUrl
    ? use(createFile(initialData.imageUrl, "image/jpeg"))
    : null;

  const form = useForm<AdFormValues>({
    resolver: zodResolver(formSchema, { async: true }),
    defaultValues: {
      title: initialData?.title ?? "",
      subjectId: initialData?.subject.id ?? "",
      edition: initialData?.edition ?? "",
      marked: initialData?.marked ?? false,
      embed: defaultEmbed,
    },
  });

  useEffect(() => {
    if (embedRef.current && initialData?.imageUrl) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(defaultEmbed!);
      embedRef.current.files = dataTransfer.files;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.imageUrl]);

  const onSubmit = async (data: AdFormValues) => {
    try {
      setLoading(true);

      if (
        !!data.embed &&
        initialData?.imageUrl?.split("/")?.pop() !== data.embed?.name
      ) {
        const newBlob = await upload(`ads/${data.embed.name}`, data.embed, {
          access: "public",
          handleUploadUrl: "/api/image/upload",
          multipart: true,
        });
        // @ts-ignore
        data["imageUrl"] = newBlob.url;
      }

      if (initialData) {
        await updateAd(initialData.id, data);
        router.refresh();
      } else {
        const { id } = await createAd({
          title: data.title,
          subjectId: data.subjectId,
          // @ts-ignore
          imageUrl: data["imageUrl"],
        });
        router.replace(`/admin/ads/${id}`);
      }
      toast({ description: toastMessage });
    } catch (error: any) {
      toast({ description: "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      if (typeof params?.adId === "string")
        await deleteAd(params.adId as string);
      router.replace(`/admin/ads`);
      toast({ description: "Chapter deleted." });
    } catch (error: any) {
      toast({
        description:
          "Make sure you removed all products using this chapter first.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

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
                      onValueChange={field.onChange}
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
              name="name"
              disabled={loading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ad name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="embed"
              disabled={loading}
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Ad Cover</FormLabel>
                  <FormControl>
                    <DropZoneInput
                      {...field}
                      ref={embedRef}
                      onFileDrop={(files) =>
                        onChange(files.length ? files[0] : undefined)
                      }
                      defaultFile={value || undefined}
                    />
                    {/* <Input
                      type="file"
                      accept="image/*"
                      placeholder="Upload a cover"
                      {...field}
                      onChange={(event) => {
                        onChange(event.target.files?.[0]);
                      }}
                      ref={embedRef}
                    /> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-x-5">
              <FormField
                control={form.control}
                name="edition"
                disabled={loading}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edition</FormLabel>
                    <FormControl>
                      <Input placeholder="Edition" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField<AdFormValues, "marked">
                control={form.control}
                name="marked"
                disabled={loading}
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Marked ad</FormLabel>
                    <FormControl>
                      <Switch
                        {...field}
                        checked={value}
                        onCheckedChange={onChange}
                        className="block"
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
