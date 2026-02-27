import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");
const FROM = "Build Barguna <noreply@digitalcare.site>";
const BASE_URL = process.env.NEXTAUTH_URL || "https://buildbarguna.com";

// ─── Shared HTML helpers ───────────────────────────────────────────────────

function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:#16a34a;padding:28px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Build Barguna</h1>
            <p style="margin:4px 0 0;color:#bbf7d0;font-size:13px;">Together Capital, Together Development</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">
              © 2026 Build Barguna. All rights reserved.<br>
              Questions? <a href="mailto:contact@digitalcare.site" style="color:#16a34a;text-decoration:none;">contact@digitalcare.site</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function ctaButton(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:600;font-size:15px;margin-top:24px;">${label}</a>`;
}

function orderDetailsBox(fields: Array<{ label: string; value: string }>): string {
  const rows = fields
    .map(
      ({ label, value }) => `
      <tr>
        <td style="padding:10px 16px;font-size:14px;color:#64748b;font-weight:600;white-space:nowrap;border-bottom:1px solid #f1f5f9;">${label}</td>
        <td style="padding:10px 16px;font-size:14px;color:#1e293b;border-bottom:1px solid #f1f5f9;">${value}</td>
      </tr>`
    )
    .join("");
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin:20px 0;overflow:hidden;">
    ${rows}
  </table>`;
}

// ─── Dividend Credited Email ───────────────────────────────────────────────

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface DividendEmailParams {
  recipientEmail: string;
  recipientName: string | null;
  projectTitle: string;
  month: number;
  year: number;
  shares: number;
  dividendAmount: number;
  newBalance: number;
}

export async function sendDividendCreditedEmail(params: DividendEmailParams): Promise<void> {
  const { recipientEmail, recipientName, projectTitle, month, year, shares, dividendAmount, newBalance } = params;
  const name = recipientName || "Member";
  const monthName = MONTHS[month - 1];

  const detailFields: Array<{ label: string; value: string }> = [
    { label: "Project", value: projectTitle },
    { label: "Period", value: `${monthName} ${year}` },
    { label: "Shares Held", value: `${shares} share${shares !== 1 ? "s" : ""}` },
    { label: "Dividend Credited", value: `৳${dividendAmount.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    ...(newBalance > 0
      ? [{ label: "New Wallet Balance", value: `৳${newBalance.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` }]
      : []),
  ];

  const body = emailWrapper(`
    <h2 style="margin:0 0 8px;font-size:22px;color:#1e293b;">Your Monthly Dividend Has Been Credited 💰</h2>
    <p style="margin:0 0 20px;font-size:15px;color:#475569;">Dear <strong>${name}</strong>,</p>
    <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
      Great news! Your dividend for <strong>${monthName} ${year}</strong> from
      <strong>${projectTitle}</strong> has been <strong style="color:#16a34a;">credited to your wallet</strong>.
    </p>

    ${orderDetailsBox(detailFields)}

    <p style="margin:16px 0 0;font-size:14px;color:#64748b;line-height:1.6;">
      Your earnings are now available in your wallet. Visit your wallet page to view your
      transaction history or withdraw your funds.
    </p>

    ${ctaButton(`${BASE_URL}/en/wallet`, "View My Wallet")}
  `);

  try {
    await resend.emails.send({
      from: FROM,
      to: [recipientEmail],
      subject: "Your Monthly Dividend Has Been Credited 💰",
      html: body,
    });
  } catch (error) {
    console.error("[Email] Failed to send dividend credited email:", error);
  }
}

// ─── Share Order Approved Email ────────────────────────────────────────────

interface ShareOrderEmailParams {
  recipientEmail: string;
  recipientName: string | null;
  projectTitle: string;
  quantity: number;
  totalAmount: number;
  adminNote?: string | null;
}

export async function sendShareOrderApprovedEmail(params: ShareOrderEmailParams): Promise<void> {
  const { recipientEmail, recipientName, projectTitle, quantity, totalAmount, adminNote } = params;
  const name = recipientName || "Member";

  const body = emailWrapper(`
    <h2 style="margin:0 0 8px;font-size:22px;color:#1e293b;">Your Share Order is Approved ✅</h2>
    <p style="margin:0 0 20px;font-size:15px;color:#475569;">Dear <strong>${name}</strong>,</p>
    <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
      Great news! Your share purchase request has been <strong style="color:#16a34a;">approved</strong>. 
      Your shares are now recorded in your portfolio.
    </p>

    ${orderDetailsBox([
      { label: "Project", value: projectTitle },
      { label: "Shares Purchased", value: `${quantity} share${quantity > 1 ? "s" : ""}` },
      { label: "Total Amount", value: `৳${totalAmount.toLocaleString()}` },
      { label: "Status", value: "✅ Approved" },
      ...(adminNote ? [{ label: "Admin Note", value: adminNote }] : []),
    ])}

    <p style="margin:16px 0 0;font-size:14px;color:#64748b;line-height:1.6;">
      You will receive your proportional dividend every month based on the number of shares you hold.
      Visit your dashboard to view your full portfolio.
    </p>

    ${ctaButton(`${BASE_URL}/en/dashboard`, "View My Dashboard")}
  `);

  try {
    await resend.emails.send({
      from: FROM,
      to: [recipientEmail],
      subject: "Your Share Order Has Been Approved ✅",
      html: body,
    });
  } catch (error) {
    console.error("[Email] Failed to send share order approved email:", error);
  }
}

// ─── Share Order Rejected Email ────────────────────────────────────────────

export async function sendShareOrderRejectedEmail(params: ShareOrderEmailParams): Promise<void> {
  const { recipientEmail, recipientName, projectTitle, quantity, totalAmount, adminNote } = params;
  const name = recipientName || "Member";

  const body = emailWrapper(`
    <h2 style="margin:0 0 8px;font-size:22px;color:#1e293b;">Update on Your Share Order</h2>
    <p style="margin:0 0 20px;font-size:15px;color:#475569;">Dear <strong>${name}</strong>,</p>
    <p style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.6;">
      We regret to inform you that your share purchase request could <strong style="color:#dc2626;">not be processed</strong> 
      at this time.
    </p>

    ${orderDetailsBox([
      { label: "Project", value: projectTitle },
      { label: "Shares Requested", value: `${quantity} share${quantity > 1 ? "s" : ""}` },
      { label: "Total Amount", value: `৳${totalAmount.toLocaleString()}` },
      { label: "Status", value: "❌ Rejected" },
      ...(adminNote ? [{ label: "Reason", value: adminNote }] : []),
    ])}

    <p style="margin:16px 0 0;font-size:14px;color:#64748b;line-height:1.6;">
      If you have already made a payment, please contact us immediately with your transaction reference number 
      and we will arrange a refund. We apologize for any inconvenience.
    </p>
    <p style="margin:12px 0 0;font-size:14px;color:#64748b;">
      📧 Contact: <a href="mailto:contact@digitalcare.site" style="color:#16a34a;">contact@digitalcare.site</a>
    </p>

    ${ctaButton(`${BASE_URL}/en/projects`, "Browse Other Projects")}
  `);

  try {
    await resend.emails.send({
      from: FROM,
      to: [recipientEmail],
      subject: "Update on Your Share Order — Build Barguna",
      html: body,
    });
  } catch (error) {
    console.error("[Email] Failed to send share order rejected email:", error);
  }
}
