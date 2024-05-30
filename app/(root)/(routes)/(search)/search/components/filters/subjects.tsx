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
import { SearchSchema } from "../searchSchema";

export type SubjectFilterProps = {
  subjects?: { value: string }[];
};

export default function SubjectFilter({ subjects }: SubjectFilterProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="subject"
      disabled={form.formState.isSubmitting || !subjects}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Subject</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={field.disabled}
              name={field.name}
              required
            >
              <SelectTrigger onBlur={field.onBlur}>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent className="max-h-96">
                {subjects?.map((subject) => (
                  <SelectItem key={subject.value} value={subject.value}>
                    {subject.value}
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
