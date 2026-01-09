import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getSiteSettings } from "@/lib/settings";

export async function POST(req: Request) {
  try {
    const settings = await getSiteSettings(); // get logo, colors, etc.
    const { name, email, subject, message } = await req.json();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

    const logoUrl = settings.logo_url ? `${baseUrl}${settings.logo_url}` : "";

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 1️⃣ Send message to your inbox
    await transporter.sendMail({
      from: `"The Ittern Contact Form" <${process.env.SMTP_FROM}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL,
      replyTo: email,
      subject: subject || "New Contact Form Message",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f8fafc; padding: 20px; margin: 0;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); padding: 30px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">New Contact Message</h1>
            </div>

            <!-- Content -->
            <div style="padding: 30px 20px;">
              <div style="margin-bottom: 25px;">
                <p style="margin: 0 0 15px 0; color: #64748b; font-size: 14px;"><strong>From:</strong> ${name}</p>
                <p style="margin: 0 0 15px 0; color: #64748b; font-size: 14px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #1e40af; text-decoration: none;">${email}</a></p>
                ${subject ? `<p style="margin: 0; color: #64748b; font-size: 14px;"><strong>Subject:</strong> ${subject}</p>` : ''}
              </div>

              <!-- Message -->
              <div style="background: #f1f5f9; border-left: 4px solid #1e40af; padding: 15px; border-radius: 4px; margin: 20px 0;">
                <p style="margin: 0; color: #334155; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word;">${message.replace(/\n/g, "<br/>")}</p>
              </div>

              <p style="margin-top: 25px; padding-top: 25px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px;">
                Reply directly to this email or use the contact form on your website.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // 2️⃣ Branded auto-reply to the visitor
    await transporter.sendMail({
      from: `"The Ittern Team" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: "We Received Your Message!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f8fafc; padding: 20px; margin: 0;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            
            <!-- Logo Header -->
            <div style="background: #f8fafc; padding: 40px 20px; text-align: center; border-bottom: 1px solid #e2e8f0;">
              ${settings.logo_url ? `<img src="cid:logo" alt="The Ittern" style="height: 50px; max-width: 200px;" />` : `<h2 style="color: #1e3a8a; margin: 0;">The Ittern</h2>`}
            </div>

            <!-- Content -->
            <div style="padding: 40px 20px;">
              <h2 style="margin: 0 0 20px 0; color: #272727; font-size: 24px;">Hi ${name},</h2>
              
              <p style="margin: 0 0 20px 0; color: #334155; line-height: 1.6; font-size: 15px;">
                Thank you for reaching out to us! We have received your message and appreciate you taking the time to contact us.
              </p>

              <p style="margin: 0 0 20px 0; color: #334155; line-height: 1.6; font-size: 15px;">
                Our team will review your message and get back to you as soon as possible. We typically respond within 24-48 hours.
              </p>

              <!-- Message Echo -->
              <div style="background: #f1f5f9; border-left: 4px solid #272727; padding: 20px; border-radius: 4px; margin: 30px 0;">
                <p style="margin: 0 0 12px 0; color: #64748b; font-weight: 600; font-size: 14px;">Your Message:</p>
                <p style="margin: 0; color: #334155; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word; font-size: 14px;">${message.replace(/\n/g, "<br/>")}</p>
              </div>

              <!-- Footer -->
              <div style="margin-top: 30px; padding-top: 30px; border-top: 2px solid #e2e8f0;">
                <p style="margin: 0 0 15px 0; color: #334155; font-size: 15px;">
                  Best regards,<br/>
                  <strong style="color: #272727;">TheiTern Team</strong>
                </p>
              </div>
            </div>

            <!-- Disclaimer -->
            <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #64748b; font-size: 12px; line-height: 1.5;">
                If you did not send this message, please disregard this email.<br/>
                <a href="${baseUrl}" style="color: #1e40af; text-decoration: none;">Visit our website</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments: settings.logo_url ? [
        {
          filename: "logo.png",
          path: `./public${settings.logo_url}`,
          cid: "logo",
        },
      ] : [],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}