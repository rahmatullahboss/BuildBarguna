// src/components/forms/ProposeVentureForm.tsx
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { proposeVentureSchema } from "@/lib/schemas";
import { proposeVentureAction } from "@/lib/actions/venture.actions";
import { FormState } from "@/lib/actions/member.actions";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const initialState: FormState = {
  success: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Submitting Proposal..." : "Submit Proposal"}
    </Button>
  );
}

export function ProposeVentureForm() {
  const [state, formAction] = useFormState(proposeVentureAction, initialState);

  const form = useForm<z.infer<typeof proposeVentureSchema>>({
    resolver: zodResolver(proposeVentureSchema),
    defaultValues: {
      titleEn: "",
      titleBn: "",
      descriptionEn: "",
      descriptionBn: "",
      budget: 0,
      leanCanvas: undefined,
    },
  });

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-6">
        <FormField
          control={form.control}
          name="titleEn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venture Title (English)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Community Fish Drying Yard" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="titleBn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venture Title (Bengali)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., কমিউনিটি মাছ শুকানোর চত্বর" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descriptionEn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (English)</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your venture..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descriptionBn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Bengali)</FormLabel>
              <FormControl>
                <Textarea placeholder="আপনার উদ্যোগের বর্ণনা দিন..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proposed Budget (BDT)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="e.g., 500000" 
                  value={field.value || ''}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="leanCanvas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lean Canvas Document</FormLabel>
              <FormControl>
                <Input type="file" onChange={(e) => field.onChange(e.target.files?.[0])} />
              </FormControl>
              <FormDescription>
                Upload a PDF, JPG, or PNG file (max 5MB).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton />

        {state.message && (
          <p className={`mt-4 text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}
      </form>
    </Form>
  );
}
