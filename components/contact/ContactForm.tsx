"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-sm border border-border bg-muted/50 p-6 text-sm text-foreground">
        Thank you for reaching out! Our team will get back to you shortly. For an immediate response,
        please message us on WhatsApp.
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-foreground">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="min-h-11 w-full rounded-sm border border-border bg-card px-3 text-sm"
        />
      </div>
      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium text-foreground">
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          className="min-h-11 w-full rounded-sm border border-border bg-card px-3 text-sm"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="w-full rounded-sm border border-border bg-card px-3 py-2 text-sm"
        />
      </div>
      <Button type="submit" size="lg" className="w-full">
        Send Message
      </Button>
    </form>
  );
}
