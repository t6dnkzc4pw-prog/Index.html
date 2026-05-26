import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

export const runtime = "nodejs";

const InquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(4000)
});

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;
const rate = new Map<string, number[]>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const arr = (rate.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  arr.push(now);
  rate.set(ip, arr);
  return arr.length <= RATE_LIMIT_MAX;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function emailTemplate(data: z.infer<typeof InquirySchema>): string {
  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const message = escapeHtml(data.message).replace(/\n/g, "<br/>");
  return `<!doctype html>
<html><body style="font-family:Georgia,serif;background:#000;color:#f5f1e8;padding:48px;">
  <div style="max-width:560px;margin:0 auto;">
    <p style="letter-spacing:.3em;font-size:11px;color:#c89968;text-transform:uppercase;">Private Inquiry</p>
    <h1 style="font-weight:300;font-size:28px;margin:24px 0 32px;">${name}</h1>
    <p style="color:#a8a094;font-size:14px;margin:0 0 8px;">${email}</p>
    <hr style="border:none;border-top:1px solid #8a705033;margin:24px 0;"/>
    <p style="font-size:15px;line-height:1.7;color:#f5f1e8;">${message}</p>
  </div>
</body></html>`;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = InquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO ?? "madiabox@gmail.com";
  const from = process.env.INQUIRY_FROM ?? "MADIA <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("[inquiry] RESEND_API_KEY not set — payload received but no email sent.");
    return NextResponse.json({ ok: true, dev: true });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: parsed.data.email,
    subject: `Private Inquiry — ${parsed.data.name}`,
    html: emailTemplate(parsed.data)
  });

  if (error) {
    console.error("[inquiry] resend error", error);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
