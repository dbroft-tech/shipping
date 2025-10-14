<?php
/**
 * RGR Logistics Ltd - Contact Form Handler
 * Handles contact form submissions using SMTP
 * 
 * @author RGR Logistics Ltd
 * @version 1.0
 */

// Prevent direct access
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.1 405 Method Not Allowed');
    exit('Method Not Allowed');
}

// Enable error reporting for development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// SMTP Configuration - Update these with your actual SMTP settings
$smtp_config = [
    'host' => 'smtp.gmail.com', // Change to your SMTP server
    'port' => 587,
    'username' => 'your-email@gmail.com', // Your email address
    'password' => 'your-app-password', // Your email password or app password
    'encryption' => 'tls', // or 'ssl'
    'from_email' => 'noreply@rgrlogistics.com',
    'from_name' => 'RGR Logistics Ltd',
    'to_email' => 'info@rgrlogistics.com', // Where to send the emails
    'to_name' => 'RGR Logistics Team'
];

// Security functions
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validate_phone($phone) {
    // Remove all non-digit characters
    $phone = preg_replace('/[^0-9+]/', '', $phone);
    // Check if it's a valid phone number (basic validation)
    return preg_match('/^[\+]?[0-9]{10,15}$/', $phone);
}

// Rate limiting (simple implementation)
session_start();
$current_time = time();
$rate_limit_window = 300; // 5 minutes
$max_submissions = 3;

if (!isset($_SESSION['form_submissions'])) {
    $_SESSION['form_submissions'] = [];
}

// Clean old submissions
$_SESSION['form_submissions'] = array_filter(
    $_SESSION['form_submissions'],
    function($timestamp) use ($current_time, $rate_limit_window) {
        return ($current_time - $timestamp) < $rate_limit_window;
    }
);

// Check rate limit
if (count($_SESSION['form_submissions']) >= $max_submissions) {
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'message' => 'Too many submissions. Please wait 5 minutes before trying again.'
    ]);
    exit;
}

// Process form data
$name = sanitize_input($_POST['name'] ?? '');
$email = sanitize_input($_POST['email'] ?? '');
$phone = sanitize_input($_POST['phone'] ?? '');
$company = sanitize_input($_POST['company'] ?? '');
$service = sanitize_input($_POST['service'] ?? '');
$message = sanitize_input($_POST['message'] ?? '');

// Validation
$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Name must be at least 2 characters long.';
}

if (empty($email) || !validate_email($email)) {
    $errors[] = 'Please provide a valid email address.';
}

if (!empty($phone) && !validate_phone($phone)) {
    $errors[] = 'Please provide a valid phone number.';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Message must be at least 10 characters long.';
}

// Check for spam patterns
$spam_patterns = [
    '/\b(viagra|cialis|casino|lottery|winner|congratulations)\b/i',
    '/\b(click here|visit now|act now|limited time)\b/i',
    '/(http:\/\/|https:\/\/|www\.)/i' // Basic URL detection
];

foreach ($spam_patterns as $pattern) {
    if (preg_match($pattern, $message) || preg_match($pattern, $name)) {
        $errors[] = 'Your message appears to be spam.';
        break;
    }
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Validation errors: ' . implode(' ', $errors)
    ]);
    exit;
}

// Prepare email content
$email_subject = "New Contact Form Submission - RGR Logistics";
$email_body = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>New Contact Form Submission</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #1e3c72; }
        .value { margin-top: 5px; padding: 10px; background: white; border-left: 4px solid #FFD700; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>RGR Logistics Ltd</h1>
            <p>New Contact Form Submission</p>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Name:</div>
                <div class='value'>" . htmlspecialchars($name) . "</div>
            </div>
            <div class='field'>
                <div class='label'>Email:</div>
                <div class='value'>" . htmlspecialchars($email) . "</div>
            </div>";

if (!empty($phone)) {
    $email_body .= "
            <div class='field'>
                <div class='label'>Phone:</div>
                <div class='value'>" . htmlspecialchars($phone) . "</div>
            </div>";
}

if (!empty($company)) {
    $email_body .= "
            <div class='field'>
                <div class='label'>Company:</div>
                <div class='value'>" . htmlspecialchars($company) . "</div>
            </div>";
}

if (!empty($service)) {
    $email_body .= "
            <div class='field'>
                <div class='label'>Service Interest:</div>
                <div class='value'>" . htmlspecialchars($service) . "</div>
            </div>";
}

$email_body .= "
            <div class='field'>
                <div class='label'>Message:</div>
                <div class='value'>" . nl2br(htmlspecialchars($message)) . "</div>
            </div>
            <div class='field'>
                <div class='label'>Submitted:</div>
                <div class='value'>" . date('Y-m-d H:i:s') . " (UTC)</div>
            </div>
            <div class='field'>
                <div class='label'>IP Address:</div>
                <div class='value'>" . $_SERVER['REMOTE_ADDR'] . "</div>
            </div>
        </div>
        <div class='footer'>
            <p>This email was sent from the RGR Logistics contact form.</p>
            <p>Kevina, Kampala, Uganda | +256 705 312 409 | +256 780 861 741</p>
        </div>
    </div>
</body>
</html>";

// Send email using PHP's mail function with SMTP headers
$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: ' . $smtp_config['from_name'] . ' <' . $smtp_config['from_email'] . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion(),
    'X-Priority: 3',
    'Return-Path: ' . $smtp_config['from_email']
];

$headers_string = implode("\r\n", $headers);

// Attempt to send email
$mail_sent = mail($smtp_config['to_email'], $email_subject, $email_body, $headers_string);

if ($mail_sent) {
    // Log successful submission
    $_SESSION['form_submissions'][] = $current_time;
    
    // Log to file (optional)
    $log_entry = date('Y-m-d H:i:s') . " - Contact form submission from: $name ($email)\n";
    file_put_contents('contact_log.txt', $log_entry, FILE_APPEND | LOCK_EX);
    
    // Send auto-reply to user
    $auto_reply_subject = "Thank you for contacting RGR Logistics Ltd";
    $auto_reply_body = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <title>Thank you for your inquiry</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
            .highlight { color: #FFD700; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>RGR Logistics Ltd</h1>
                <p>Thank you for your inquiry!</p>
            </div>
            <div class='content'>
                <p>Dear " . htmlspecialchars($name) . ",</p>
                
                <p>Thank you for contacting <span class='highlight'>RGR Logistics Ltd</span>. We have received your message and will respond within 24 hours during business days.</p>
                
                <p><strong>Your message:</strong><br>
                " . nl2br(htmlspecialchars($message)) . "</p>
                
                <p>In the meantime, feel free to:</p>
                <ul>
                    <li>Call us at <strong>+256 705 312 409</strong> or <strong>+256 780 861 741</strong></li>
                    <li>Visit our office at Kevina, Kampala, Uganda</li>
                    <li>Learn more about our services on our website</li>
                </ul>
                
                <p>We look forward to serving your logistics needs!</p>
                
                <p>Best regards,<br>
                <strong>RGR Logistics Team</strong></p>
            </div>
            <div class='footer'>
                <p>RGR Logistics Ltd - Professional Bonded Warehouse & Logistics Solutions</p>
                <p>URA Recognized | Kevina, Kampala, Uganda</p>
            </div>
        </div>
    </body>
    </html>";
    
    $auto_reply_headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: ' . $smtp_config['from_name'] . ' <' . $smtp_config['from_email'] . '>',
        'X-Mailer: PHP/' . phpversion()
    ];
    
    mail($email, $auto_reply_subject, $auto_reply_body, implode("\r\n", $auto_reply_headers));
    
    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your message! We will get back to you within 24 hours.'
    ]);
} else {
    // Error response
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Sorry, there was an error sending your message. Please try again or contact us directly.'
    ]);
}
?>
