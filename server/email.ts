import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {
    apiKey: connectionSettings.settings.api_key, 
    fromEmail: connectionSettings.settings.from_email
  };
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
export async function getUncachableResendClient() {
  const { apiKey } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail: connectionSettings.settings.from_email
  };
}

// Send password reset email
export async function sendPasswordResetEmail(
  toEmail: string,
  resetToken: string,
  userName?: string
) {
  const { client, fromEmail } = await getUncachableResendClient();
  
  const resetUrl = `${process.env.REPLIT_DEV_DOMAIN ? 'https://' + process.env.REPLIT_DEV_DOMAIN : 'http://localhost:5000'}/reset-password?token=${resetToken}`;
  
  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">What Is This?</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Password Reset Request</p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px 40px 20px 40px;">
              <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Reset Your Password</h2>
              <p style="color: #666666; margin: 0 0 20px 0; font-size: 18px; line-height: 1.6;">
                ${userName ? `Hi ${userName},` : 'Hello,'}
              </p>
              <p style="color: #666666; margin: 0 0 20px 0; font-size: 18px; line-height: 1.6;">
                We received a request to reset your password for your What Is This? account. Click the button below to create a new password:
              </p>
              
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 18px; font-weight: bold;">Reset Password</a>
                  </td>
                </tr>
              </table>
              
              <p style="color: #666666; margin: 20px 0; font-size: 16px; line-height: 1.6;">
                Or copy and paste this link into your browser:
              </p>
              <p style="color: #667eea; margin: 0 0 20px 0; font-size: 14px; word-break: break-all;">
                ${resetUrl}
              </p>
              
              <p style="color: #666666; margin: 20px 0; font-size: 16px; line-height: 1.6;">
                This link will expire in <strong>1 hour</strong> for security reasons.
              </p>
              
              <p style="color: #666666; margin: 20px 0; font-size: 16px; line-height: 1.6;">
                If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px 40px; border-top: 1px solid #e9ecef;">
              <p style="color: #999999; margin: 0; font-size: 14px; text-align: center;">
                This email was sent by What Is This? - Your AI-powered image analysis assistant
              </p>
              <p style="color: #999999; margin: 10px 0 0 0; font-size: 14px; text-align: center;">
                Need help? Contact our support team
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const emailText = `
Reset Your Password

${userName ? `Hi ${userName},` : 'Hello,'}

We received a request to reset your password for your What Is This? account.

To reset your password, click this link or copy it into your browser:
${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.

---
What Is This? - Your AI-powered image analysis assistant
  `;

  const response = await client.emails.send({
    from: fromEmail,
    to: toEmail,
    subject: 'Reset Your Password - What Is This?',
    html: emailHtml,
    text: emailText,
  });

  return response;
}
