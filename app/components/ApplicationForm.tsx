"use client";

import { useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ApplicationForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/leads/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as {
        message?: string;
        errors?: Record<string, string>;
      };

      if (!response.ok) {
        const firstError = result.errors
          ? Object.values(result.errors)[0]
          : result.message;
        throw new Error(firstError ?? "Could not submit application.");
      }

      form.reset();
      setSubmitState("success");
      setMessage(result.message ?? "Application received.");
    } catch (error) {
      setSubmitState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not submit application. Please try again.",
      );
    }
  }

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <input type="hidden" name="program" value="founders" />
      <input type="hidden" name="source_domain" value="aiforfounders.org" />
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
      <label>
        Name
        <input name="name" type="text" autoComplete="name" required />
      </label>
      <label>
        Phone / WhatsApp
        <input name="phone" type="tel" autoComplete="tel" required />
      </label>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Business name
        <input name="business" type="text" required />
      </label>
      <label>
        Your role
        <input
          name="role"
          type="text"
          placeholder="Founder, co-founder, owner, CEO..."
          required
        />
      </label>
      <label>
        Current business stage
        <select name="business_stage" required defaultValue="">
          <option value="" disabled>
            Select one
          </option>
          <option value="pre-revenue">Pre-revenue / idea stage</option>
          <option value="0-1cr">Under Rs 1Cr revenue</option>
          <option value="1-5cr">Rs 1Cr - 5Cr revenue</option>
          <option value="5-25cr">Rs 5Cr - 25Cr revenue</option>
          <option value="25cr-plus">Rs 25Cr+ revenue</option>
        </select>
      </label>
      <label>
        Biggest founder bottleneck AI should help with
        <textarea name="problem_statement" rows={4} required />
      </label>
      <button
        className="button primary"
        type="submit"
        disabled={submitState === "submitting"}
      >
        {submitState === "submitting"
          ? "Sending..."
          : "Send Founder Application"}
      </button>
      <p
        className={`form-note ${
          submitState === "success" ? "is-success" : ""
        } ${submitState === "error" ? "is-error" : ""}`}
        role={submitState === "idle" ? undefined : "status"}
      >
        {message ||
          "Application call required. We will review fit before the next step."}
      </p>
    </form>
  );
}
