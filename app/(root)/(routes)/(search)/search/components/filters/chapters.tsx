"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { getChaptersByBook } from "./actions";

export type ChapterFilterProps = {
  chapters?: { value: string }[];
};

export default function ChapterFilter({ chapters }: ChapterFilterProps) {
  const form = useFormContext();
  const [initialChapters, getChapters, isLoading] = useFormState(
    getChaptersByBook,
    chapters ?? []
  );

  useEffect(() => {
    const { unsubscribe } = form.watch(({ book }) => {
      if (book) {
        getChapters(book);
      }
    });
    return unsubscribe;
  }, [form, getChapters]);

  return (
    <FormField
      control={form.control}
      name="chapter"
      disabled={
        form.formState.isSubmitting || !initialChapters?.length || isLoading
      }
      render={({ field }) => (
        <FormItem>
          <FormLabel>Chapter</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={field.disabled}
              name={field.name}
              required
            >
              <SelectTrigger onBlur={field.onBlur}>
                <SelectValue placeholder="Select a chapter" />
              </SelectTrigger>
              <SelectContent className="max-h-96">
                {initialChapters?.map((chapter) => (
                  <SelectItem key={chapter.value} value={chapter.value}>
                    {chapter.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
