import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@starrymeet.com',
      to,
      subject,
      html
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export const sendWelcomeEmail = async (to: string, firstName: string) => {
  const subject = 'Welcome to StarryMeet! 🌟';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          padding: 30px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 8px 8px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
        }
        .content {
          background: #ffffff;
          padding: 30px;
          border: 1px solid #e1e8ed;
          border-top: none;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
          font-weight: 600;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #657786;
          font-size: 14px;
          background: #f5f8fa;
          border-radius: 0 0 8px 8px;
        }
        .features {
          margin: 20px 0;
          padding: 0;
          list-style: none;
        }
        .features li {
          padding: 10px 0;
          padding-left: 30px;
          position: relative;
        }
        .features li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #667eea;
          font-weight: bold;
          font-size: 18px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Welcome to StarryMeet! 🌟</h1>
      </div>

      <div class="content">
        <h2>Hi ${firstName}!</h2>

        <p>We're thrilled to have you join the StarryMeet community! You've just unlocked access to connect with thousands of celebrities, influencers, and industry professionals.</p>

        <h3>What's next?</h3>

        <ul class="features">
          <li>Browse through 21,000+ verified celebrities across multiple categories</li>
          <li>Book quick meets, standard sessions, or premium experiences</li>
          <li>Get personalized recommendations based on your interests</li>
          <li>Enjoy secure payments and verified bookings</li>
        </ul>

        <center>
          <a href="${process.env.FRONTEND_URL}" class="button">Start Exploring</a>
        </center>

        <p>If you have any questions or need assistance, our support team is here to help!</p>

        <p>Best regards,<br>
        <strong>The StarryMeet Team</strong></p>
      </div>

      <div class="footer">
        <p>This email was sent to ${to} because you created an account on StarryMeet.</p>
        <p>&copy; ${new Date().getFullYear()} StarryMeet. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
};
