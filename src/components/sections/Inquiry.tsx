"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { EyebrowLabel } from "@/components/ui/EyebrowLabel";
import { FadeIn } from "@/components/ui/FadeIn";

type Status = "idle" | "loading" | "success" | "error";

export function Inquiry() {
  const t = useTranslations("inquiry");
  const [status, setStatus] = useState<Status>("idle");
  const [dots, setDots] = useState(0);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim()
    };

    setStatus("loading");
    const dotsInterval = window.setInterval(() => {
      setDots((d) => (d + 1) % 4);
    }, 400);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    } finally {
      window.clearInterval(dotsInterval);
      setDots(0);
    }
  }

  return (
    <section className="relative w-full bg-bg-black px-6 py-32 md:py-48 lg:py-64">
      <div className="mx-auto flex max-w-xl flex-col items-center">
        <FadeIn className="w-full text-center">
          <EyebrowLabel>{t("eyebrow")}</EyebrowLabel>
        </FadeIn>

        <FadeIn delay={0.15} className="w-full text-center">
          <h2 className="mt-10 font-serif text-4xl md:text-5xl font-light leading-tight text-text-primary">
            {t("title")}
          </h2>
        </FadeIn>

        <FadeIn delay={0.3} className="w-full text-center">
          <p className="mt-6 font-sans text-sm md:text-base font-light text-text-secondary">
            {t("subtitle")}
          </p>
        </FadeIn>

        <FadeIn delay={0.45} className="mt-20 w-full">
          {status === "success" ? (
            <p className="text-center font-serif italic text-2xl md:text-3xl font-light text-text-primary">
              {t("success")}
            </p>
          ) : (
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-12">
              <Field
                name="name"
                type="text"
                label={t("name")}
                autoComplete="name"
                required
              />
              <Field
                name="email"
                type="email"
                label={t("email")}
                autoComplete="email"
                required
              />
              <FieldTextarea name="message" label={t("message")} required />

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-4 self-center border-b border-accent-amber pb-2 font-sans text-xs tracking-[0.3em] uppercase text-text-secondary transition-colors duration-500 ease-quiet hover:text-text-primary disabled:opacity-60 focus-visible:outline-none focus-visible:text-text-primary"
              >
                {status === "loading"
                  ? `${t("sending")}${".".repeat(dots)}`
                  : t("submit")}
              </button>

              {status === "error" && (
                <p className="text-center font-sans text-sm text-accent-amber">
                  {t("error")}
                </p>
              )}
            </form>
          )}
        </FadeIn>

        <FadeIn delay={0.7} className="mt-40">
          <a
            href={`mailto:${t("contact")}`}
            className="font-sans text-xs tracking-[0.3em] text-text-secondary hover:text-text-primary transition-colors"
          >
            {t("contact")}
          </a>
        </FadeIn>
      </div>
    </section>
  );
}

interface FieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}

function Field({ name, label, type = "text", required, autoComplete }: FieldProps) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        aria-label={label}
        placeholder={label}
        className="w-full border-b border-text-secondary/30 bg-transparent py-3 font-sans text-base font-light tracking-wide text-text-primary placeholder:text-text-secondary/40 transition-colors duration-300 ease-quiet focus:border-accent-amber focus:outline-none"
      />
    </label>
  );
}

function FieldTextarea({ name, label, required }: Omit<FieldProps, "type">) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <textarea
        name={name}
        required={required}
        aria-label={label}
        placeholder={label}
        rows={4}
        className="w-full resize-none border-b border-text-secondary/30 bg-transparent py-3 font-sans text-base font-light tracking-wide text-text-primary placeholder:text-text-secondary/40 transition-colors duration-300 ease-quiet focus:border-accent-amber focus:outline-none"
      />
    </label>
  );
}
