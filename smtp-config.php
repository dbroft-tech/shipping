<?php
/**
 * SMTP Configuration for RGR Logistics Ltd
 * 
 * IMPORTANT: Update these settings with your actual SMTP credentials
 * For security, consider using environment variables in production
 */

return [
    // SMTP Server Settings
    'smtp' => [
        'host' => 'smtp.gmail.com', // Your SMTP server (Gmail, Outlook, etc.)
        'port' => 587, // 587 for TLS, 465 for SSL
        'encryption' => 'tls', // 'tls' or 'ssl'
        'username' => 'your-email@gmail.com', // Your email username
        'password' => 'your-app-password', // Your email password or app password
    ],
    
    // Email Settings
    'email' => [
        'from_email' => 'noreply@rgrlogistics.com', // Sender email
        'from_name' => 'RGR Logistics Ltd', // Sender name
        'to_email' => 'info@rgrlogistics.com', // Where to receive contact forms
        'to_name' => 'RGR Logistics Team', // Recipient name
        'reply_to' => 'info@rgrlogistics.com', // Reply-to address
    ],
    
    // Security Settings
    'security' => [
        'rate_limit_window' => 300, // 5 minutes in seconds
        'max_submissions' => 3, // Max submissions per window
        'enable_logging' => true, // Log submissions to file
        'enable_auto_reply' => true, // Send auto-reply to users
    ],
    
    // Validation Settings
    'validation' => [
        'min_name_length' => 2,
        'min_message_length' => 10,
        'max_message_length' => 5000,
        'required_fields' => ['name', 'email', 'message'],
        'optional_fields' => ['phone', 'company', 'service'],
    ],
    
    // Spam Protection
    'spam_protection' => [
        'enable_honeypot' => true, // Hidden field to catch bots
        'enable_captcha' => false, // Set to true if you want to add CAPTCHA
        'blocked_words' => [
            'viagra', 'cialis', 'casino', 'lottery', 'winner',
            'congratulations', 'click here', 'visit now', 'act now'
        ],
        'max_urls' => 2, // Maximum URLs allowed in message
    ]
];

/**
 * SETUP INSTRUCTIONS:
 * 
 * 1. Gmail Setup:
 *    - Enable 2-factor authentication
 *    - Generate an App Password: https://myaccount.google.com/apppasswords
 *    - Use the App Password in the 'password' field above
 * 
 * 2. Outlook/Hotmail Setup:
 *    - Host: smtp-mail.outlook.com
 *    - Port: 587
 *    - Encryption: tls
 * 
 * 3. Other SMTP Providers:
 *    - Update host, port, and encryption settings accordingly
 *    - Check your email provider's SMTP documentation
 * 
 * 4. Security:
 *    - Never commit real credentials to version control
 *    - Use environment variables in production
 *    - Consider using a dedicated email service like SendGrid or Mailgun
 */
?>
