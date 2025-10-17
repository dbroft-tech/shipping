# 📧 RGR Logistics Contact Form Setup Instructions

## 🎯 Overview
Your contact form has been enhanced with PHPMailer backend functionality while keeping the frontend design exactly as it was. The form will now send actual emails instead of just showing notifications.

## 📁 New Files Added
- `send_contact.php` - Main PHP handler for contact form submissions
- `email_config.php` - Configuration file for email settings
- `test_email.php` - Test script to verify email setup (delete after testing)
- `SETUP_INSTRUCTIONS.md` - This file

## 🚀 Quick Setup (5 minutes)

### Step 1: Configure Email Settings
1. Open `email_config.php` in a text editor
2. Update the following settings:
   ```php
   'smtp_username' => 'your-actual-email@gmail.com',
   'smtp_password' => 'your-app-password',
   'to_email' => 'info@logistics-rgr.com',
   ```

### Step 2: Gmail Setup (Recommended)
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password (not your regular Gmail password)

### Step 3: Test Configuration
1. Upload all files to your web server
2. Visit `https://your-domain.com/test_email.php` in browser
3. Check if test email is received
4. **Delete `test_email.php` after testing**

### Step 4: Go Live
1. Set `'enable_debug' => false` in `email_config.php`
2. Test the contact form on your website
3. Verify emails are received at `info@logistics-rgr.com`

## 🔧 Technical Details

### Frontend Changes
- ✅ **No visual changes** - Contact form looks exactly the same
- ✅ **Enhanced validation** - Better email format checking
- ✅ **Loading states** - Spinner animation during submission
- ✅ **Error handling** - Proper error messages for users
- ✅ **Analytics tracking** - Form submission events tracked

### Backend Features
- ✅ **Professional email templates** - HTML formatted emails
- ✅ **Rate limiting** - Prevents spam (5 submissions per hour per IP)
- ✅ **Input sanitization** - Security against malicious input
- ✅ **Multiple SMTP support** - Gmail, Outlook, Yahoo, custom domains
- ✅ **Detailed logging** - Comprehensive email content with metadata

### Email Template Includes
- 👤 Customer name and email
- 📞 Phone number (if provided)
- 🏢 Company name (if provided)
- 🚛 Service interest (if selected)
- 💬 Message content
- 🕒 Timestamp and IP address

## 🔒 Security Features

### Built-in Protection
- **Rate limiting** - Prevents spam submissions
- **Input sanitization** - Protects against XSS attacks
- **Email validation** - Ensures valid email addresses
- **CSRF protection** - Form submissions validated
- **IP tracking** - Logs submission source

### Best Practices Implemented
- Secure password handling
- No sensitive data in frontend
- Proper error handling
- Debug mode for development only

## 🌐 Alternative SMTP Providers

### For Outlook/Hotmail
```php
'smtp_host' => 'smtp-mail.outlook.com',
'smtp_port' => 587,
'smtp_username' => 'your-email@outlook.com',
'smtp_password' => 'your-password',
```

### For Yahoo Mail
```php
'smtp_host' => 'smtp.mail.yahoo.com',
'smtp_port' => 587,
'smtp_username' => 'your-email@yahoo.com',
'smtp_password' => 'your-app-password',
```

### For Custom Domain (cPanel hosting)
```php
'smtp_host' => 'mail.logistics-rgr.com',
'smtp_port' => 587,
'smtp_username' => 'info@logistics-rgr.com',
'smtp_password' => 'your-email-password',
```

## 🚨 Troubleshooting

### Common Issues & Solutions

#### "SMTP Error: Could not authenticate"
- ✅ Enable 2-Factor Authentication on Gmail
- ✅ Use App Password, not regular password
- ✅ Check username/password in `email_config.php`

#### "Connection refused"
- ✅ Check SMTP host and port settings
- ✅ Verify hosting provider allows SMTP connections
- ✅ Try different ports (587, 465, 25)

#### "Message not received"
- ✅ Check spam/junk folder
- ✅ Verify 'to_email' address in config
- ✅ Test with `test_email.php` first

#### "Rate limit exceeded"
- ✅ Wait 1 hour or adjust rate limit in config
- ✅ Clear rate limit files from server

### Debug Mode
Enable debugging in `email_config.php`:
```php
'enable_debug' => true,
```
**Remember to disable for production!**

## 📊 Analytics Integration
The contact form now tracks:
- Successful form submissions
- Form submission errors
- User engagement metrics

Events are sent to Google Analytics if gtag is available.

## 🔄 Maintenance

### Regular Tasks
- Monitor email delivery
- Check rate limit logs
- Update SMTP passwords periodically
- Review form submissions for spam

### File Permissions
Ensure proper permissions:
- PHP files: 644
- Config files: 600 (more secure)
- Directories: 755

## 📞 Support
If you need help with setup:
1. Check the troubleshooting section above
2. Test with `test_email.php`
3. Review server error logs
4. Contact your hosting provider for SMTP issues

## 🎉 Success!
Once setup is complete:
- ✅ Contact form sends real emails
- ✅ Professional email templates
- ✅ Spam protection enabled
- ✅ Analytics tracking active
- ✅ Frontend unchanged

Your RGR Logistics contact form is now fully functional with enterprise-level email capabilities!

---
*Generated for RGR Logistics Ltd - Professional logistics services in Uganda*
