<?php
// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set content type for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Include PHPMailer
require_once 'PHPMailer/src/Exception.php';
require_once 'PHPMailer/src/PHPMailer.php';
require_once 'PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Load configuration
$config = require_once 'email_config.php';

try {
    // Get and validate input data
    $input = json_decode(file_get_contents('php://input'), true);
    
    // If no JSON input, try form data
    if (!$input) {
        $input = $_POST;
    }
    
    // Validate required fields
    $required_fields = ['name', 'email', 'message'];
    foreach ($required_fields as $field) {
        if (empty($input[$field])) {
            throw new Exception("Required field '$field' is missing");
        }
    }
    
    // Sanitize input data
    $data = [
        'name' => filter_var(trim($input['name']), FILTER_SANITIZE_STRING),
        'email' => filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL),
        'phone' => isset($input['phone']) ? filter_var(trim($input['phone']), FILTER_SANITIZE_STRING) : '',
        'company' => isset($input['company']) ? filter_var(trim($input['company']), FILTER_SANITIZE_STRING) : '',
        'service' => isset($input['service']) ? filter_var(trim($input['service']), FILTER_SANITIZE_STRING) : '',
        'message' => filter_var(trim($input['message']), FILTER_SANITIZE_STRING)
    ];
    
    // Validate email format
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }
    
    // Rate limiting (basic implementation)
    if ($config['rate_limit']) {
        $ip = $_SERVER['REMOTE_ADDR'];
        $rate_limit_file = 'rate_limit_' . md5($ip) . '.txt';
        
        if (file_exists($rate_limit_file)) {
            $submissions = json_decode(file_get_contents($rate_limit_file), true);
            $current_hour = date('Y-m-d-H');
            
            if (isset($submissions[$current_hour]) && $submissions[$current_hour] >= $config['max_submissions_per_hour']) {
                throw new Exception('Rate limit exceeded. Please try again later.');
            }
        }
    }
    
    // Create PHPMailer instance
    $mail = new PHPMailer(true);
    
    // Server settings
    if ($config['enable_debug']) {
        $mail->SMTPDebug = SMTP::DEBUG_SERVER;
    }
    
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
    $mail->addReplyTo($data['email'], $data['name']);
    
    // Content
    $mail->isHTML(true);
    $mail->Subject = 'New Contact Form Submission - RGR Logistics';
    
    // Create HTML email body
    $html_body = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 20px; text-align: center; }
            .content { background: #f8f9fa; padding: 30px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #1e3c72; }
            .value { margin-top: 5px; padding: 10px; background: white; border-left: 4px solid #ffd700; }
            .footer { background: #343a40; color: white; padding: 15px; text-align: center; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>🚚 RGR Logistics Contact Form</h1>
                <p>New inquiry received from website</p>
            </div>
            <div class='content'>
                <div class='field'>
                    <div class='label'>👤 Full Name:</div>
                    <div class='value'>" . htmlspecialchars($data['name']) . "</div>
                </div>
                <div class='field'>
                    <div class='label'>📧 Email Address:</div>
                    <div class='value'>" . htmlspecialchars($data['email']) . "</div>
                </div>";
    
    if (!empty($data['phone'])) {
        $html_body .= "
                <div class='field'>
                    <div class='label'>📞 Phone Number:</div>
                    <div class='value'>" . htmlspecialchars($data['phone']) . "</div>
                </div>";
    }
    
    if (!empty($data['company'])) {
        $html_body .= "
                <div class='field'>
                    <div class='label'>🏢 Company Name:</div>
                    <div class='value'>" . htmlspecialchars($data['company']) . "</div>
                </div>";
    }
    
    if (!empty($data['service'])) {
        $service_names = [
            'clearing-forwarding' => 'Clearing & Forwarding',
            'import-export' => 'Import & Export',
            'transportation' => 'Transportation',
            'sourcing' => 'Sourcing',
            'multiple' => 'Multiple Services',
            'other' => 'Other'
        ];
        $service_display = isset($service_names[$data['service']]) ? $service_names[$data['service']] : $data['service'];
        
        $html_body .= "
                <div class='field'>
                    <div class='label'>🚛 Service Interest:</div>
                    <div class='value'>" . htmlspecialchars($service_display) . "</div>
                </div>";
    }
    
    $html_body .= "
                <div class='field'>
                    <div class='label'>💬 Message:</div>
                    <div class='value'>" . nl2br(htmlspecialchars($data['message'])) . "</div>
                </div>
                <div class='field'>
                    <div class='label'>🕒 Received:</div>
                    <div class='value'>" . date('Y-m-d H:i:s T') . "</div>
                </div>
                <div class='field'>
                    <div class='label'>🌐 IP Address:</div>
                    <div class='value'>" . $_SERVER['REMOTE_ADDR'] . "</div>
                </div>
            </div>
            <div class='footer'>
                <p>This email was sent from the RGR Logistics contact form on www.logistics-rgr.com</p>
                <p>Please respond to the customer within 24 hours for optimal service.</p>
            </div>
        </div>
    </body>
    </html>";
    
    $mail->Body = $html_body;
    
    // Plain text version
    $text_body = "New Contact Form Submission - RGR Logistics\n\n";
    $text_body .= "Name: " . $data['name'] . "\n";
    $text_body .= "Email: " . $data['email'] . "\n";
    if (!empty($data['phone'])) $text_body .= "Phone: " . $data['phone'] . "\n";
    if (!empty($data['company'])) $text_body .= "Company: " . $data['company'] . "\n";
    if (!empty($data['service'])) $text_body .= "Service Interest: " . $service_display . "\n";
    $text_body .= "Message: " . $data['message'] . "\n\n";
    $text_body .= "Received: " . date('Y-m-d H:i:s T') . "\n";
    $text_body .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";
    
    $mail->AltBody = $text_body;
    
    // Send email
    $mail->send();
    
    // Update rate limiting
    if ($config['rate_limit']) {
        $submissions = [];
        if (file_exists($rate_limit_file)) {
            $submissions = json_decode(file_get_contents($rate_limit_file), true);
        }
        
        $current_hour = date('Y-m-d-H');
        $submissions[$current_hour] = isset($submissions[$current_hour]) ? $submissions[$current_hour] + 1 : 1;
        
        // Clean old entries (keep only last 24 hours)
        $cutoff_time = strtotime('-24 hours');
        foreach ($submissions as $hour => $count) {
            if (strtotime($hour . ':00:00') < $cutoff_time) {
                unset($submissions[$hour]);
            }
        }
        
        file_put_contents($rate_limit_file, json_encode($submissions));
    }
    
    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Message sent successfully! We will get back to you within 24 hours.'
    ]);
    
} catch (Exception $e) {
    // Error response
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send message: ' . $e->getMessage()
    ]);
}
?>
