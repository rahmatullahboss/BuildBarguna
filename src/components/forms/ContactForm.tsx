"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm, type ContactFormState } from "@/lib/actions/contact.actions";

const initialState: ContactFormState = {};

export function ContactForm() {
  const t = useTranslations("ContactPage");
  const [state, formAction] = useActionState(submitContactForm, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state.success === false && state.message && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{state.message}</p>
        </div>
      )}
      
      {state.success === true && state.message && (
        <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-200">{state.message}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("firstName")}
          </label>
          <Input 
            name="firstName"
            placeholder={t("firstNamePlaceholder")}
            className={state.errors?.firstName ? "border-red-500" : ""}
          />
          {state.errors?.firstName && (
            <p className="text-red-500 text-sm mt-1">{state.errors.firstName[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("lastName")}
          </label>
          <Input 
            name="lastName"
            placeholder={t("lastNamePlaceholder")}
            className={state.errors?.lastName ? "border-red-500" : ""}
          />
          {state.errors?.lastName && (
            <p className="text-red-500 text-sm mt-1">{state.errors.lastName[0]}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t("email")}
        </label>
        <Input 
          name="email"
          type="email"
          placeholder={t("emailPlaceholder")}
          className={state.errors?.email ? "border-red-500" : ""}
        />
        {state.errors?.email && (
          <p className="text-red-500 text-sm mt-1">{state.errors.email[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t("phone")}
        </label>
        <Input 
          name="phone"
          type="tel"
          placeholder={t("phonePlaceholder")}
          className={state.errors?.phone ? "border-red-500" : ""}
        />
        {state.errors?.phone && (
          <p className="text-red-500 text-sm mt-1">{state.errors.phone[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t("subject")}
        </label>
        <Input 
          name="subject"
          placeholder={t("subjectPlaceholder")}
          className={state.errors?.subject ? "border-red-500" : ""}
        />
        {state.errors?.subject && (
          <p className="text-red-500 text-sm mt-1">{state.errors.subject[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t("message")}
        </label>
        <Textarea 
          name="message"
          rows={5}
          placeholder={t("messagePlaceholder")}
          className={state.errors?.message ? "border-red-500" : ""}
        />
        {state.errors?.message && (
          <p className="text-red-500 text-sm mt-1">{state.errors.message[0]}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {t("sendButton")}
      </Button>
    </form>
  );
}