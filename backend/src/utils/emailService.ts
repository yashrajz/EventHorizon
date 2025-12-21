import * as nodemailer from 'nodemailer';

// Email service for sending verification emails
class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    console.log('📧 Raw environment variables:');
    console.log('  - SMTP_USER raw value:', JSON.stringify(process.env.SMTP_USER));
    console.log('  - SMTP_PASS raw value:', JSON.stringify(process.env.SMTP_PASS));
    console.log('  - SMTP_HOST raw value:', JSON.stringify(process.env.SMTP_HOST));
    
    // Check if SMTP credentials are configured
    const isSmtpConfigured = process.env.SMTP_USER && 
                             process.env.SMTP_PASS && 
                             process.env.SMTP_USER !== 'your_email@gmail.com' &&
                             process.env.SMTP_PASS !== 'your_app_password';

    console.log('📧 SMTP Configuration Check:');
    console.log('  - SMTP_USER:', process.env.SMTP_USER ? '✅ Set' : '❌ Missing');
    console.log('  - SMTP_PASS:', process.env.SMTP_PASS ? '✅ Set' : '❌ Missing');
    console.log('  - Is Configured:', isSmtpConfigured ? '✅ Yes' : '❌ No');

    if (isSmtpConfigured) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail', // Use Gmail service for better compatibility
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false // Allow self-signed certificates
        }
      });
      console.log('📧 SMTP transporter configured for Gmail');
    } else {
      console.log('📧 SMTP not configured - using development mode');
      // Create a dummy transporter for development
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true
      });
    }
  }

  async sendVerificationEmail(email: string, name: string, token: string): Promise<boolean> {
    try {
      // Check if SMTP is properly configured
      const isSmtpConfigured = process.env.SMTP_USER && 
                               process.env.SMTP_PASS && 
                               process.env.SMTP_USER !== 'your_email@gmail.com' &&
                               process.env.SMTP_PASS !== 'your_app_password';

      // Skip email sending in development if SMTP is not configured
      if (!isSmtpConfigured) {
        console.log('📧 Email sending skipped (SMTP not configured)');
        console.log(`📧 Verification token for ${email}: ${token}`);
        console.log(`📧 Verification URL: ${process.env.FRONTEND_URL}/verify-email/${token}`);
        return true; // Return true to avoid blocking signup in development
      }

      // Test SMTP connection first
      try {
        await this.transporter.verify();
        console.log('📧 SMTP connection verified successfully');
      } catch (verifyError) {
        console.error('📧 SMTP verification failed:', verifyError);
        // Fallback to development mode
        console.log(`📧 Falling back to development mode`);
        console.log(`📧 Verification token for ${email}: ${token}`);
        console.log(`📧 Verification URL: ${process.env.FRONTEND_URL}/verify-email/${token}`);
        return true;
      }

      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

      const mailOptions = {
        from: `"EventHorizon" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Verify Your Email - EventHorizon',
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0;">EventHorizon</h1>
              <p style="color: #6b7280; margin: 5px 0;">Your Gateway to Amazing Events</p>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 10px; text-align: center;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome ${name}!</h2>
              <p style="color: #4b5563; margin-bottom: 30px; line-height: 1.6;">
                Thank you for joining EventHorizon. To complete your registration and start discovering amazing events, 
                please verify your email address by clicking the button below.
              </p>
              
              <a href="${verificationUrl}" 
                 style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; 
                        border-radius: 5px; display: inline-block; font-weight: bold;">
                Verify My Email
              </a>
              
              <p style="color: #6b7280; margin-top: 30px; font-size: 14px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">
                  ${verificationUrl}
                </a>
              </p>
              
              <p style="color: #9ca3af; margin-top: 20px; font-size: 12px;">
                This link will expire in 24 hours. If you didn't create an account with EventHorizon, 
                you can safely ignore this email.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © 2025 EventHorizon. All rights reserved.
              </p>
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`📧 Verification email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('📧 Email sending failed:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, name: string, token: string): Promise<boolean> {
    try {
      // Skip email sending in development if SMTP is not configured
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS || 
          process.env.SMTP_USER === 'your_email@gmail.com') {
        console.log('📧 Password reset email sending skipped (SMTP not configured)');
        console.log(`📧 Reset token for ${email}: ${token}`);
        console.log(`📧 Reset URL: ${process.env.FRONTEND_URL}/reset-password/${token}`);
        return true;
      }

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

      const mailOptions = {
        from: `"EventHorizon" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Password Reset Request - EventHorizon',
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0;">EventHorizon</h1>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 10px; text-align: center;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Password Reset Request</h2>
              <p style="color: #4b5563; margin-bottom: 30px; line-height: 1.6;">
                Hi ${name}, we received a request to reset your password. Click the button below to create a new password.
              </p>
              
              <a href="${resetUrl}" 
                 style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; 
                        border-radius: 5px; display: inline-block; font-weight: bold;">
                Reset My Password
              </a>
              
              <p style="color: #6b7280; margin-top: 30px; font-size: 14px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #dc2626; word-break: break-all;">
                  ${resetUrl}
                </a>
              </p>
              
              <p style="color: #9ca3af; margin-top: 20px; font-size: 12px;">
                This link will expire in 1 hour. If you didn't request a password reset, 
                you can safely ignore this email.
              </p>
            </div>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`📧 Password reset email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('📧 Password reset email sending failed:', error);
      return false;
    }
  }
}

export default new EmailService();