// src/components/forms/JoinMemberForm.tsx
"use client";

import { useFormStatus } from "react-dom";
import { useActionState, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { joinMemberSchema } from "@/lib/schemas";
import { joinMemberAction, FormState } from "@/lib/actions/member.actions";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
      {pending ? "Submitting..." : "Submit Application"}
    </Button>
  );
}

export function JoinMemberForm() {
  const [state, formAction] = useActionState(joinMemberAction, initialState);

  const form = useForm<z.infer<typeof joinMemberSchema>>({
    resolver: zodResolver(joinMemberSchema),
    defaultValues: {
      name: "",
      nationalId: "",
      phone: "",
      email: "",
      address: "",
      nomineeName: "",
      nomineePhone: "",
      nomineeNationalId: "",
      nomineeRelation: "",
      policyConsent: false,
    },
  });

  const handleSubmit = (data: z.infer<typeof joinMemberSchema>) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("nationalId", data.nationalId);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("address", data.address);
    formData.append("nomineeName", data.nomineeName || "");
    formData.append("nomineePhone", data.nomineePhone || "");
    formData.append("nomineeNationalId", data.nomineeNationalId || "");
    formData.append("nomineeRelation", data.nomineeRelation || "");
    formData.append("policyConsent", data.policyConsent.toString());
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Honeypot field for basic spam protection */}
        <input type="hidden" name="honeypot" value="" />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nationalId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>National ID / Passport</FormLabel>
              <FormControl>
                <Input placeholder="Your NID or Passport number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="01xxxxxxxxx" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Address</FormLabel>
              <FormControl>
                <Input placeholder="Your full address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nominee Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nomineeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nominee Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Full name of your nominee" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nomineePhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nominee Phone Number (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="01xxxxxxxxx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nomineeNationalId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nominee National ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Nominee's NID or Passport number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nomineeRelation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relation with Nominee (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Spouse, Father, Mother, Brother" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="policyConsent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I agree to the terms and conditions
                </FormLabel>
                <FormDescription>
                  You agree to abide by the co-operative&apos;s constitution/policies.
                </FormDescription>
              </div>
              {form.formState.errors.policyConsent && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.policyConsent.message}
                </p>
              )}
            </FormItem>
          )}
        />

        <SubmitButton />

        {state.message && (
          <div className={`mt-4 p-4 rounded-md ${state.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <p className="text-sm font-medium">{state.message}</p>
            {state.errors && (
              <div className="mt-2">
                <p className="text-xs font-medium">Please fix the following errors:</p>
                <ul className="text-xs mt-1 list-disc list-inside">
                  {Object.entries(state.errors).map(([field, errors]) => (
                    <li key={field}>
                      <strong>{field}:</strong> {errors.join(", ")}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </form>
    </Form>
  );
}
