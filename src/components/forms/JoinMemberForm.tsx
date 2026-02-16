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

import Lottie from "lottie-react";
import infoAnimation from "../../lotties/info.json";
import phoneAnimation from "../../lotties/phone.json";

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
      nationalId: "",
      phone: "",
      email: "",
      address: "",
      nomineeName: "",
      nomineePhone: "",
      nomineeNationalId: "",
      nomineeRelation: "",
      bkashNumber: "",
      transactionId: "",
      policyConsent: false,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof joinMemberSchema>) => {
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
    formData.append("bkashNumber", data.bkashNumber);
    formData.append("transactionId", data.transactionId);
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
                    name="nationalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("nidLabel")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("nidPlaceholder")} {...field} />
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
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("emailLabel")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("emailPlaceholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("addressLabel")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("addressPlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Nominee Information */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6">
                    <Lottie animationData={infoAnimation} loop={true} />
                  </div>
                  <h3 className="text-lg font-semibold">{t("nomineeSectionTitle")}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nomineeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("nomineeNameLabel")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("nomineeNamePlaceholder")} {...field} value={field.value || ''} />
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
                        <FormLabel>{t("nomineePhoneLabel")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("nomineePhonePlaceholder")} {...field} value={field.value || ''} />
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
                        <FormLabel>{t("nomineeNidLabel")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("nomineeNidPlaceholder")} {...field} value={field.value || ''} />
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
                        <FormLabel>{t("nomineeRelationLabel")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("nomineeRelationPlaceholder")} {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Payment Information */}
              <Card className="border-pink-200 dark:border-pink-900 bg-pink-50/50 dark:bg-pink-950/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-pink-100 dark:bg-pink-900/50">
                      <div className="w-8 h-8">
                        <Lottie animationData={phoneAnimation} loop={true} />
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-xl text-pink-700 dark:text-pink-400">
                        {t("paymentTitle")}
                      </CardTitle>
                      <CardDescription className="text-pink-600/80 dark:text-pink-400/80">
                        {t("paymentDescription")}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="bg-white p-4 rounded-lg border border-pink-100 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="bg-pink-100 p-2 rounded-full mt-1">
                        <div className="w-4 h-4">
                          <Lottie animationData={infoAnimation} loop={true} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700 font-medium">{t("howToPay")}</p>
                        <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1 ml-1">
                          <li>{t("step1")}</li>
                          <li>{t("step2")}</li>
                          <li>{t("step3")} <span className="font-bold text-gray-900 select-all">{t("step3Value")}</span> {t("step3Type")}</li>
                          <li>{t("step4")} <span className="font-bold text-gray-900">{t("step4Value")}</span></li>
                          <li>{t("step5")} <span className="italic text-gray-500">{t("step5Value")}</span></li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="bkashNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("bkashNumberLabel")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("bkashNumberPlaceholder")}
                              {...field}
                              className="focus-visible:ring-pink-500"
                            />
                          </FormControl>
                          <FormDescription>
                            {t("bkashNumberDescription")}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="transactionId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("trxIdLabel")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("trxIdPlaceholder")}
                              {...field}
                              className="focus-visible:ring-pink-500 uppercase placeholder:normal-case"
                            />
                          </FormControl>
                          <FormDescription>
                            {t("trxIdDescription")}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

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
