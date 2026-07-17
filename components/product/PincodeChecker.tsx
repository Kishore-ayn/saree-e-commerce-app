"use client";

import { useState } from "react";
import { MapPin, CheckCircle2 } from "lucide-react";

export function PincodeChecker() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<string | null>(null);

  function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setResult("Please enter a valid 6-digit pincode.");
      return;
    }
    const isVizag = pincode.startsWith("530");
    setResult(
      isVizag
        ? "Delivery available. Estimated 2-4 days across Visakhapatnam."
        : "We deliver pan-India in 5-7 days. Contact us on WhatsApp for exact timelines."
    );
  }

  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
        <MapPin className="h-4 w-4" /> Check delivery availability
      </p>
      <form onSubmit={handleCheck} className="flex gap-2">
        <label htmlFor="pincode" className="sr-only">
          Enter pincode
        </label>
        <input
          id="pincode"
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter pincode"
          className="min-h-11 w-40 rounded-sm border border-border bg-card px-3 text-sm"
        />
        <button
          type="submit"
          className="min-h-11 rounded-sm border border-primary px-4 text-sm font-medium text-primary cursor-pointer"
        >
          Check
        </button>
      </form>
      {result && (
        <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          {result}
        </p>
      )}
    </div>
  );
}
