<?php
/**
 * Email Configuration for RGR Logistics Contact Form
 * 
 * IMPORTANT: Update these settings before using the contact form
 * 
 * For Gmail SMTP:
 * 1. Enable 2-Factor Authentication on your Gmail account
 * 2. Generate an App Password: https://support.google.com/accounts/answer/185833
 * 3. Use the App Password (not your regular password) in smtp_password
 * 
 * For other email providers, update the SMTP settings accordingly
 */

return [
    // SMTP Server Settings
    'smtp_host' => 'smtp.gmail.com',  // Gmail SMTP server
    'smtp_port' => 587,               // Port for STARTTLS
    'smtp_username' => 'your-email@gmail.com',     // Your Gmail address
    'smtp_password' => 'your-app-password',        // Your Gmail App Password (NOT regular password)
    'smtp_secure' => 'tls',           // 'tls' or 'ssl'
    
    // Email Addresses
    'from_email' => 'info@logistics-rgr.com',      // From address (can be different from SMTP username)
    'from_name' => 'RGR Logistics Contact Form',   // From name
    'to_email' => 'info@logistics-rgr.com',        // Where to send contact form emails
    'to_name' => 'RGR Logistics Team',             // Recipient name
    
    // Security Settings
    'enable_debug' => false,          // Set to true for debugging (NEVER in production)
    'rate_limit' => true,             // Enable rate limiting
    'max_submissions_per_hour' => 5,  // Maximum submissions per IP per hour
    
    // Email Template Settings
    'company_name' => 'RGR Logistics Ltd',
    'website_url' => 'https://www.logistics-rgr.com',
    'response_time' => '24 hours',    // Expected response time
    
    // Alternative SMTP Providers (uncomment and modify as needed)
    
    // For Outlook/Hotmail:
    /*
    'smtp_host' => 'smtp-mail.outlook.com',
    'smtp_port' => 587,
    'smtp_username' => 'your-email@outlook.com',
    'smtp_password' => 'your-password',
    */
    
    // For Yahoo Mail:
    /*
    'smtp_host' => 'smtp.mail.yahoo.com',
    'smtp_port' => 587,
    'smtp_username' => 'your-email@yahoo.com',
    'smtp_password' => 'your-app-password',
    */
    
    // For custom domain (cPanel/WHM hosting):
    /*
    'smtp_host' => 'mail.yourdomain.com',
    'smtp_port' => 587,
    'smtp_username' => 'info@yourdomain.com',
    'smtp_password' => 'your-email-password',
    */
];

/**
 * SETUP INSTRUCTIONS:
 * 
 * 1. Update the email settings above with your actual SMTP credentials
 * 2. Test the configuration by submitting the contact form
 * 3. Check your email for the test message
 * 4. Set enable_debug to false for production use
 * 
 * SECURITY NOTES:
 * - Never commit this file with real credentials to version control
 * - Use environment variables for sensitive data in production
 * - Ensure your web server has proper file permissions
 * - Consider using a dedicated email service like SendGrid or Mailgun for high volume
 */
?>
