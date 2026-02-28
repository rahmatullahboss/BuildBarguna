// src/components/forms/JoinMemberForm.tsx
"use client";

import { useFormStatus } from "react-dom";
import { useActionState, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { joinMemberSchema } from "@/lib/schemas";
import { joinMemberAction, FormState } from "@/lib/actions/member.actions";
import { z } from "zod";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const t = useTranslations("JoinMemberForm");
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? t("submitting") : t("submitButton")}
    </Button>
  );
}

export function JoinMemberForm() {
  const t = useTranslations("JoinMemberForm");
  const [state, formAction] = useActionState(joinMemberAction, initialState);

  const form = useForm<z.infer<typeof joinMemberSchema>>({
    resolver: zodResolver(joinMemberSchema),
    defaultValues: {
      name: "",
      phone: "",
      referralCode: "",
      policyConsent: false,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof joinMemberSchema>) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("referralCode", data.referralCode || "");
    formData.append("policyConsent", data.policyConsent.toString());
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>{t("subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t("personalInfo")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("nameLabel")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("namePlaceholder")} {...field} />
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
                        <FormLabel>{t("phoneLabel")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("phonePlaceholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Referral Code */}
              <FormField
                control={form.control}
                name="referralCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("referralCodeLabel")} <span className="text-muted-foreground font-normal text-xs">(Optional)</span></FormLabel>
                    <FormControl>
                      <Input placeholder={t("referralCodePlaceholder")} {...field} />
                    </FormControl>
                    <FormDescription>{t("referralCodeDescription")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Security Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t("securityInfo")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("passwordLabel")}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder={t("passwordPlaceholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("confirmPasswordLabel")}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder={t("confirmPasswordPlaceholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                        {t("policyConsent")}
                      </FormLabel>
                      <FormDescription>
                        {t("policyDescription")}
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
                      <p className="text-xs font-medium">{t("errorFix")}</p>
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
        </CardContent>
      </Card>
    </div>
  );
}
