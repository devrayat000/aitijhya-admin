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
import { getBooksBySubject } from "./actions";

export type BookFilterProps = {
  books?: { value: string; count: number }[];
};

export default function BookFilter({ books }: BookFilterProps) {
  const form = useFormContext();
  const [initialBooks, getBooks, isLoading] = useFormState(
    getBooksBySubject,
    books ?? []
  );

  useEffect(() => {
    const { unsubscribe } = form.watch(({ subject }) => {
      if (subject) {
        getBooks({ subject });
      }
    });
    return unsubscribe;
  }, [form, getBooks]);

  return (
    <FormField
      control={form.control}
      name="book"
      disabled={
        form.formState.isSubmitting || !initialBooks?.length || isLoading
      }
      render={({ field }) => (
        <FormItem>
          <FormLabel>Book</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={field.disabled}
              name={field.name}
            >
              <SelectTrigger onBlur={field.onBlur}>
                <SelectValue placeholder="Select a book" />
              </SelectTrigger>
              <SelectContent className="max-h-96">
                {initialBooks?.map((book) => (
                  <SelectItem
                    key={book.value}
                    value={book.value}
                    className="block"
                  >
                    <div className="flex items-start gap-2">
                      <span className="flex-1">{book.value}</span>
                      <span className="text-muted-foreground text-xs py-px px-1 rounded-full border-border border">
                        {book.count}
                      </span>
                    </div>
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
