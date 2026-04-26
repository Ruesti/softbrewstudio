import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM = "FocusPilot <noreply@softbrewstudio.com>";

export async function POST(req: Request) {
  try {
    const { email, project_type } = (await req.json()) as {
      email: string;
      project_type?: string;
    };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const sb = createClient(SB_URL, SB_SERVICE);
    const { error: dbError } = await sb.from("waitlist").insert({
      email: normalizedEmail,
      project_type: project_type?.trim() || null,
    });

    if (dbError) {
      return NextResponse.json({ ok: false, error: dbError.message }, { status: 500 });
    }

    await resend.emails.send({
      from: FROM,
      to: normalizedEmail,
      subject: "You're on the FocusPilot waitlist",
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background:#111827;color:#ffffff;font-family:system-ui,-apple-system,sans-serif;margin:0;padding:40px 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;">
    <tr>
      <td style="padding-bottom:32px;">
        <span style="font-size:13px;color:#9CA3AF;letter-spacing:0.05em;text-transform:uppercase;">Softbrew Studio</span>
      </td>
    </tr>
    <tr>
      <td style="padding-bottom:20px;">
        <h1 style="margin:0;font-size:28px;font-weight:600;letter-spacing:-0.02em;line-height:1.2;">
          You&rsquo;re on the list.
        </h1>
      </td>
    </tr>
    <tr>
      <td style="padding-bottom:28px;color:#9CA3AF;font-size:15px;line-height:1.6;">
        <p style="margin:0 0 16px;">
          Thanks for signing up for FocusPilot early access. We&rsquo;re opening
          spots to a small group of builders in <strong style="color:#ffffff;">Summer 2026</strong>.
        </p>
        <p style="margin:0;">
          You&rsquo;ll hear from us exactly once — when your spot is ready.
          No newsletters, no spam.
        </p>
      </td>
    </tr>
    <tr>
      <td style="border-top:1px solid #1F2937;padding-top:24px;color:#6B7280;font-size:13px;line-height:1.6;">
        <p style="margin:0 0 4px;">
          &mdash; Uli, Softbrew Studio
        </p>
        <p style="margin:0;">
          <a href="https://softbrewstudio.com" style="color:#7C3AED;text-decoration:none;">softbrewstudio.com</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
