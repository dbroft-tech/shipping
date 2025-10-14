# RGR Logistics Contact Form Setup Guide

This guide will help you set up the contact form with SMTP email functionality for your RGR Logistics website.

## 📁 Files Created

1. **`contact-handler.php`** - Basic PHP mail handler
2. **`contact-handler-advanced.php`** - Advanced handler with better features
3. **`smtp-config.php`** - Configuration file for SMTP settings
4. **`contact-form.js`** - Frontend JavaScript for form handling
5. **`CONTACT-FORM-SETUP.md`** - This setup guide

## 🚀 Quick Setup

### Step 1: Configure SMTP Settings

Edit `smtp-config.php` and update the following:

```php
'smtp' => [
    'host' => 'your-smtp-server.com',     // Your SMTP server
    'port' => 587,                        // SMTP port (587 for TLS, 465 for SSL)
    'encryption' => 'tls',                // 'tls' or 'ssl'
    'username' => 'your-email@domain.com', // Your email
    'password' => 'your-password',         // Your email password
],

'email' => [
    'from_email' => 'noreply@rgrlogistics.com',
    'to_email' => 'info@rgrlogistics.com',  // Where to receive emails
],
```

### Step 2: Update Your Contact Form HTML

Make sure your contact form has the correct structure:

```html
<form id="contact-form" method="POST" action="contact-handler-advanced.php">
    <div class="form-field">
        <label for="name">Full Name <span class="required">*</span></label>
        <input type="text" id="name" name="name" required>
    </div>
    
    <div class="form-field">
        <label for="email">Email Address <span class="required">*</span></label>
        <input type="email" id="email" name="email" required>
    </div>
    
    <div class="form-field">
        <label for="phone">Phone Number</label>
        <input type="tel" id="phone" name="phone">
    </div>
    
    <div class="form-field">
        <label for="company">Company</label>
        <input type="text" id="company" name="company">
    </div>
    
    <div class="form-field">
        <label for="service">Service Interest</label>
        <select id="service" name="service">
            <option value="">Select a service</option>
            <option value="bonded-warehouse">Bonded Warehouse</option>
            <option value="clearing-forwarding">Clearing & Forwarding</option>
            <option value="depot-services">Depot Services</option>
            <option value="transportation">Transportation</option>
            <option value="transportation-cargo">Transportation Cargo</option>
            <option value="sourcing">Sourcing</option>
            <option value="import-export">Import & Export</option>
        </select>
    </div>
    
    <div class="form-field">
        <label for="message">Message <span class="required">*</span></label>
        <textarea id="message" name="message" rows="5" required></textarea>
    </div>
    
    <button type="submit" class="submit-button">Send Message</button>
</form>
```

### Step 3: Include JavaScript

Add this to your HTML before the closing `</body>` tag:

```html
<script src="contact-form.js"></script>
```

## 📧 SMTP Provider Setup

### Gmail Setup
1. Enable 2-factor authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use these settings:
   ```php
   'host' => 'smtp.gmail.com',
   'port' => 587,
   'encryption' => 'tls',
   'username' => 'your-email@gmail.com',
   'password' => 'your-16-digit-app-password',
   ```

### Outlook/Hotmail Setup
```php
'host' => 'smtp-mail.outlook.com',
'port' => 587,
'encryption' => 'tls',
'username' => 'your-email@outlook.com',
'password' => 'your-password',
```

### Other Providers
- **Yahoo**: `smtp.mail.yahoo.com`, port 587
- **Zoho**: `smtp.zoho.com`, port 587
- **Custom**: Check your hosting provider's documentation

## 🔧 Advanced Features

### PHPMailer Integration (Recommended)

For better reliability, install PHPMailer:

```bash
composer require phpmailer/phpmailer
```

Then uncomment the PHPMailer sections in `contact-handler-advanced.php`.

### Security Features

✅ **Rate Limiting** - Prevents spam (3 submissions per 5 minutes)
✅ **Input Validation** - Sanitizes and validates all inputs
✅ **Spam Protection** - Blocks common spam patterns
✅ **CSRF Protection** - Session-based protection
✅ **Logging** - Logs all submissions for monitoring

### Customization Options

Edit `smtp-config.php` to customize:
- Rate limiting settings
- Validation rules
- Spam protection patterns
- Auto-reply settings
- Required/optional fields

## 🎨 Styling

The JavaScript automatically adds CSS for form styling. You can customize the appearance by modifying the styles in `contact-form.js` or adding your own CSS.

## 📊 Testing

1. **Test locally**: Use a tool like XAMPP or WAMP
2. **Check SMTP**: Verify your SMTP credentials work
3. **Test validation**: Try submitting invalid data
4. **Check emails**: Ensure emails are received and formatted correctly
5. **Test auto-reply**: Verify users receive confirmation emails

## 🚨 Troubleshooting

### Common Issues

**"SMTP connection failed"**
- Check your SMTP credentials
- Verify your email provider allows SMTP
- Check firewall/hosting restrictions

**"Mail not sending"**
- Enable error reporting in PHP
- Check server logs
- Verify PHP mail() function is enabled

**"Form not submitting"**
- Check JavaScript console for errors
- Verify form action points to correct PHP file
- Ensure all required fields are present

### Debug Mode

Enable debug mode by adding this to the top of your PHP file:
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

## 📁 File Permissions

Ensure these permissions on your server:
- PHP files: 644
- Log files: 666 (if logging is enabled)
- Directory: 755

## 🔒 Security Checklist

- [ ] Update SMTP credentials in config file
- [ ] Remove debug/error reporting in production
- [ ] Set proper file permissions
- [ ] Enable HTTPS for your website
- [ ] Regularly update PHP and dependencies
- [ ] Monitor contact form logs for suspicious activity

## 📞 Support

If you need help setting up the contact form:

1. Check this documentation first
2. Review server error logs
3. Test SMTP settings separately
4. Contact your hosting provider for server-specific issues

---

**RGR Logistics Ltd**  
Professional Bonded Warehouse & Logistics Solutions  
Kevina, Kampala, Uganda  
+256 705 312 409 | +256 780 861 741
