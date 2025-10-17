<?php
/**
 * PHPMailer Test Script for RGR Logistics
 * 
 * This script tests the email configuration and PHPMailer setup.
 * Run this script to verify your email settings are working correctly.
 * 
 * IMPORTANT: Delete this file after testing for security reasons!
 */

// Include PHPMailer
require_once 'PHPMailer/src/Exception.php';
require_once 'PHPMailer/src/PHPMailer.php';
require_once 'PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Load configuration
$config = require_once 'email_config.php';

echo "<h1>RGR Logistics - Email Configuration Test</h1>\n";
echo "<p>Testing PHPMailer setup...</p>\n";

try {
    // Create PHPMailer instance
    $mail = new PHPMailer(true);
    
    // Enable debug output
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;
    $mail->Debugoutput = 'html';
    
    // Server settings
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_username'];
    $mail->Password = $config['smtp_password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $config['smtp_port'];
    
    // Recipients
    $mail->setFrom($config['from_email'], $config['from_name']);
    $mail->addAddress($config['to_email'], $config['to_name']);
    
    // Content
    $mail->isHTML(true);
    $mail->Subject = 'PHPMailer Test - RGR Logistics Contact Form';
    $mail->Body = '
    <h2>🧪 PHPMailer Test Email</h2>
    <p>This is a test email to verify that your PHPMailer configuration is working correctly.</p>
    <p><strong>Test Details:</strong></p>
    <ul>
        <li>SMTP Host: ' . $config['smtp_host'] . '</li>
        <li>SMTP Port: ' . $config['smtp_port'] . '</li>
        <li>From Email: ' . $config['from_email'] . '</li>
        <li>To Email: ' . $config['to_email'] . '</li>
        <li>Test Time: ' . date('Y-m-d H:i:s T') . '</li>
    </ul>
    <p>If you received this email, your contact form is ready to use!</p>
    <p><em>Remember to delete the test_email.php file for security.</em></p>
    ';
    
    $mail->AltBody = 'PHPMailer Test - If you received this email, your contact form is ready to use!';
    
    // Send email
    $mail->send();
    echo "<div style='background: #d4edda; color: #155724; padding: 15px; margin: 20px 0; border: 1px solid #c3e6cb; border-radius: 5px;'>";
    echo "<h3>✅ SUCCESS!</h3>";
    echo "<p>Test email sent successfully! Check your inbox at <strong>" . $config['to_email'] . "</strong></p>";
    echo "<p>Your contact form is now ready to use.</p>";
    echo "<p><strong>Next Steps:</strong></p>";
    echo "<ol>";
    echo "<li>Check your email inbox for the test message</li>";
    echo "<li>Update email_config.php with your actual SMTP credentials</li>";
    echo "<li>Set 'enable_debug' to false in email_config.php</li>";
    echo "<li>Delete this test_email.php file for security</li>";
    echo "</ol>";
    echo "</div>";
    
} catch (Exception $e) {
    echo "<div style='background: #f8d7da; color: #721c24; padding: 15px; margin: 20px 0; border: 1px solid #f5c6cb; border-radius: 5px;'>";
    echo "<h3>❌ ERROR!</h3>";
    echo "<p>Message could not be sent. Mailer Error: " . $mail->ErrorInfo . "</p>";
    echo "<p><strong>Common Solutions:</strong></p>";
    echo "<ul>";
    echo "<li>Check your SMTP credentials in email_config.php</li>";
    echo "<li>Ensure 2-Factor Authentication is enabled and you're using an App Password (for Gmail)</li>";
    echo "<li>Verify your SMTP host and port settings</li>";
    echo "<li>Check if your hosting provider blocks outgoing SMTP connections</li>";
    echo "</ul>";
    echo "</div>";
}

echo "<hr>";
echo "<h3>Configuration Check:</h3>";
echo "<table border='1' cellpadding='5' style='border-collapse: collapse;'>";
echo "<tr><td><strong>SMTP Host</strong></td><td>" . $config['smtp_host'] . "</td></tr>";
echo "<tr><td><strong>SMTP Port</strong></td><td>" . $config['smtp_port'] . "</td></tr>";
echo "<tr><td><strong>Username</strong></td><td>" . $config['smtp_username'] . "</td></tr>";
echo "<tr><td><strong>From Email</strong></td><td>" . $config['from_email'] . "</td></tr>";
echo "<tr><td><strong>To Email</strong></td><td>" . $config['to_email'] . "</td></tr>";
echo "<tr><td><strong>Debug Mode</strong></td><td>" . ($config['enable_debug'] ? 'Enabled' : 'Disabled') . "</td></tr>";
echo "</table>";

echo "<hr>";
echo "<p><strong>⚠️ SECURITY WARNING:</strong> Delete this test file (test_email.php) after testing!</p>";
?>

<style>
body { font-family: Arial, sans-serif; margin: 20px; }
table { margin: 10px 0; }
</style>
