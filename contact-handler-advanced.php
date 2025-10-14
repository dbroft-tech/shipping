<?php
/**
 * RGR Logistics Ltd - Advanced Contact Form Handler with PHPMailer
 * 
 * This version uses PHPMailer for better SMTP support and reliability
 * Install PHPMailer: composer require phpmailer/phpmailer
 */

// Uncomment these lines if using PHPMailer
// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\SMTP;
// use PHPMailer\PHPMailer\Exception;
// require 'vendor/autoload.php';

// Prevent direct access
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.1 405 Method Not Allowed');
    exit('Method Not Allowed');
}

// Load configuration
$config = require_once 'smtp-config.php';

// Set content type for JSON responses
header('Content-Type: application/json');

// Security and validation functions
class ContactFormHandler {
    private $config;
    private $errors = [];
    
    public function __construct($config) {
        $this->config = $config;
        session_start();
    }
    
    public function sanitize($data) {
        return htmlspecialchars(trim(stripslashes($data)), ENT_QUOTES, 'UTF-8');
    }
    
    public function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }
    
    public function validatePhone($phone) {
        $phone = preg_replace('/[^0-9+\-\s\(\)]/', '', $phone);
        return preg_match('/^[\+]?[\d\s\-\(\)]{10,20}$/', $phone);
    }
    
    public function checkRateLimit() {
        $current_time = time();
        $window = $this->config['security']['rate_limit_window'];
        $max_submissions = $this->config['security']['max_submissions'];
        
        if (!isset($_SESSION['form_submissions'])) {
            $_SESSION['form_submissions'] = [];
        }
        
        // Clean old submissions
        $_SESSION['form_submissions'] = array_filter(
            $_SESSION['form_submissions'],
            function($timestamp) use ($current_time, $window) {
                return ($current_time - $timestamp) < $window;
            }
        );
        
        return count($_SESSION['form_submissions']) < $max_submissions;
    }
    
    public function checkSpam($text) {
        $blocked_words = $this->config['spam_protection']['blocked_words'];
        $max_urls = $this->config['spam_protection']['max_urls'];
        
        // Check for blocked words
        foreach ($blocked_words as $word) {
            if (stripos($text, $word) !== false) {
                return true;
            }
        }
        
        // Check for excessive URLs
        $url_count = preg_match_all('/(http:\/\/|https:\/\/|www\.)/i', $text);
        if ($url_count > $max_urls) {
            return true;
        }
        
        return false;
    }
    
    public function validateInput($data) {
        $validation = $this->config['validation'];
        
        // Check required fields
        foreach ($validation['required_fields'] as $field) {
            if (empty($data[$field])) {
                $this->errors[] = ucfirst($field) . ' is required.';
            }
        }
        
        // Validate name
        if (!empty($data['name']) && strlen($data['name']) < $validation['min_name_length']) {
            $this->errors[] = 'Name must be at least ' . $validation['min_name_length'] . ' characters.';
        }
        
        // Validate email
        if (!empty($data['email']) && !$this->validateEmail($data['email'])) {
            $this->errors[] = 'Please provide a valid email address.';
        }
        
        // Validate phone (if provided)
        if (!empty($data['phone']) && !$this->validatePhone($data['phone'])) {
            $this->errors[] = 'Please provide a valid phone number.';
        }
        
        // Validate message length
        if (!empty($data['message'])) {
            $msg_len = strlen($data['message']);
            if ($msg_len < $validation['min_message_length']) {
                $this->errors[] = 'Message must be at least ' . $validation['min_message_length'] . ' characters.';
            }
            if ($msg_len > $validation['max_message_length']) {
                $this->errors[] = 'Message must not exceed ' . $validation['max_message_length'] . ' characters.';
            }
        }
        
        // Check for spam
        if ($this->checkSpam($data['name'] . ' ' . $data['message'])) {
            $this->errors[] = 'Your message appears to contain spam content.';
        }
        
        return empty($this->errors);
    }
    
    public function getErrors() {
        return $this->errors;
    }
    
    public function logSubmission($data) {
        if (!$this->config['security']['enable_logging']) {
            return;
        }
        
        $log_entry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'ip' => $_SERVER['REMOTE_ADDR'],
            'name' => $data['name'],
            'email' => $data['email'],
            'company' => $data['company'] ?? '',
            'service' => $data['service'] ?? ''
        ];
        
        $log_line = json_encode($log_entry) . "\n";
        file_put_contents('contact_submissions.log', $log_line, FILE_APPEND | LOCK_EX);
    }
    
    public function sendEmail($data) {
        // For basic PHP mail() function
        return $this->sendWithPHPMail($data);
        
        // Uncomment below and comment above to use PHPMailer
        // return $this->sendWithPHPMailer($data);
    }
    
    private function sendWithPHPMail($data) {
        $smtp = $this->config['smtp'];
        $email_config = $this->config['email'];
        
        $subject = "New Contact Form Submission - RGR Logistics";
        $body = $this->generateEmailBody($data);
        
        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            'From: ' . $email_config['from_name'] . ' <' . $email_config['from_email'] . '>',
            'Reply-To: ' . $data['name'] . ' <' . $data['email'] . '>',
            'X-Mailer: PHP/' . phpversion()
        ];
        
        $success = mail($email_config['to_email'], $subject, $body, implode("\r\n", $headers));
        
        if ($success && $this->config['security']['enable_auto_reply']) {
            $this->sendAutoReply($data);
        }
        
        return $success;
    }
    
    private function sendWithPHPMailer($data) {
        /*
        $mail = new PHPMailer(true);
        
        try {
            $smtp = $this->config['smtp'];
            $email_config = $this->config['email'];
            
            // Server settings
            $mail->isSMTP();
            $mail->Host = $smtp['host'];
            $mail->SMTPAuth = true;
            $mail->Username = $smtp['username'];
            $mail->Password = $smtp['password'];
            $mail->SMTPSecure = $smtp['encryption'];
            $mail->Port = $smtp['port'];
            
            // Recipients
            $mail->setFrom($email_config['from_email'], $email_config['from_name']);
            $mail->addAddress($email_config['to_email'], $email_config['to_name']);
            $mail->addReplyTo($data['email'], $data['name']);
            
            // Content
            $mail->isHTML(true);
            $mail->Subject = 'New Contact Form Submission - RGR Logistics';
            $mail->Body = $this->generateEmailBody($data);
            
            $success = $mail->send();
            
            if ($success && $this->config['security']['enable_auto_reply']) {
                $this->sendAutoReplyPHPMailer($data);
            }
            
            return $success;
        } catch (Exception $e) {
            error_log("PHPMailer Error: {$mail->ErrorInfo}");
            return false;
        }
        */
        return false; // Remove this when implementing PHPMailer
    }
    
    private function generateEmailBody($data) {
        $body = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; }
                .header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 30px 20px; text-align: center; }
                .content { background: #f9f9f9; padding: 30px 20px; }
                .field { margin-bottom: 20px; }
                .label { font-weight: bold; color: #1e3c72; font-size: 14px; text-transform: uppercase; }
                .value { margin-top: 8px; padding: 15px; background: white; border-left: 4px solid #FFD700; border-radius: 4px; }
                .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
                .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <div class='logo'>RGR LOGISTICS LTD</div>
                    <p>New Contact Form Submission</p>
                </div>
                <div class='content'>
                    <div class='field'>
                        <div class='label'>Full Name</div>
                        <div class='value'>" . htmlspecialchars($data['name']) . "</div>
                    </div>
                    <div class='field'>
                        <div class='label'>Email Address</div>
                        <div class='value'>" . htmlspecialchars($data['email']) . "</div>
                    </div>";
        
        if (!empty($data['phone'])) {
            $body .= "
                    <div class='field'>
                        <div class='label'>Phone Number</div>
                        <div class='value'>" . htmlspecialchars($data['phone']) . "</div>
                    </div>";
        }
        
        if (!empty($data['company'])) {
            $body .= "
                    <div class='field'>
                        <div class='label'>Company</div>
                        <div class='value'>" . htmlspecialchars($data['company']) . "</div>
                    </div>";
        }
        
        if (!empty($data['service'])) {
            $body .= "
                    <div class='field'>
                        <div class='label'>Service Interest</div>
                        <div class='value'>" . htmlspecialchars($data['service']) . "</div>
                    </div>";
        }
        
        $body .= "
                    <div class='field'>
                        <div class='label'>Message</div>
                        <div class='value'>" . nl2br(htmlspecialchars($data['message'])) . "</div>
                    </div>
                    <div class='field'>
                        <div class='label'>Submission Details</div>
                        <div class='value'>
                            <strong>Date:</strong> " . date('Y-m-d H:i:s T') . "<br>
                            <strong>IP Address:</strong> " . $_SERVER['REMOTE_ADDR'] . "<br>
                            <strong>User Agent:</strong> " . htmlspecialchars($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown') . "
                        </div>
                    </div>
                </div>
                <div class='footer'>
                    <p><strong>RGR Logistics Ltd</strong> - Professional Bonded Warehouse & Logistics Solutions</p>
                    <p>URA Recognized | Kevina, Kampala, Uganda</p>
                    <p>+256 705 312 409 | +256 780 861 741</p>
                </div>
            </div>
        </body>
        </html>";
        
        return $body;
    }
    
    private function sendAutoReply($data) {
        $email_config = $this->config['email'];
        
        $subject = "Thank you for contacting RGR Logistics Ltd";
        $body = $this->generateAutoReplyBody($data);
        
        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            'From: ' . $email_config['from_name'] . ' <' . $email_config['from_email'] . '>',
            'X-Mailer: PHP/' . phpversion()
        ];
        
        mail($data['email'], $subject, $body, implode("\r\n", $headers));
    }
    
    private function generateAutoReplyBody($data) {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; }
                .header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 30px 20px; text-align: center; }
                .content { background: #f9f9f9; padding: 30px 20px; }
                .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
                .highlight { color: #FFD700; font-weight: bold; }
                .contact-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>RGR LOGISTICS LTD</h1>
                    <p>Thank you for your inquiry!</p>
                </div>
                <div class='content'>
                    <p>Dear " . htmlspecialchars($data['name']) . ",</p>
                    
                    <p>Thank you for contacting <span class='highlight'>RGR Logistics Ltd</span>. We have received your message and our team will respond within <strong>24 hours</strong> during business days.</p>
                    
                    <div class='contact-info'>
                        <h3>Need immediate assistance?</h3>
                        <p><strong>📞 Call us:</strong><br>
                        +256 705 312 409<br>
                        +256 780 861 741</p>
                        
                        <p><strong>📍 Visit us:</strong><br>
                        Kevina, Kampala<br>
                        Makindye Division West, Uganda</p>
                        
                        <p><strong>🕒 Business Hours:</strong><br>
                        Monday - Friday: 8:00 AM - 6:00 PM<br>
                        Saturday: 9:00 AM - 2:00 PM</p>
                    </div>
                    
                    <p><strong>Your message:</strong><br>
                    <em>" . nl2br(htmlspecialchars($data['message'])) . "</em></p>
                    
                    <p>We look forward to serving your logistics needs!</p>
                    
                    <p>Best regards,<br>
                    <strong>The RGR Logistics Team</strong></p>
                </div>
                <div class='footer'>
                    <p><strong>RGR Logistics Ltd</strong> - Professional Bonded Warehouse & Logistics Solutions</p>
                    <p>URA Recognized | Kevina, Kampala, Uganda</p>
                </div>
            </div>
        </body>
        </html>";
    }
}

// Main execution
try {
    $handler = new ContactFormHandler($config);
    
    // Check rate limiting
    if (!$handler->checkRateLimit()) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'message' => 'Too many submissions. Please wait a few minutes before trying again.'
        ]);
        exit;
    }
    
    // Collect and sanitize form data
    $form_data = [];
    $allowed_fields = array_merge(
        $config['validation']['required_fields'],
        $config['validation']['optional_fields']
    );
    
    foreach ($allowed_fields as $field) {
        $form_data[$field] = $handler->sanitize($_POST[$field] ?? '');
    }
    
    // Validate input
    if (!$handler->validateInput($form_data)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Validation errors: ' . implode(' ', $handler->getErrors())
        ]);
        exit;
    }
    
    // Send email
    if ($handler->sendEmail($form_data)) {
        // Log successful submission
        $_SESSION['form_submissions'][] = time();
        $handler->logSubmission($form_data);
        
        echo json_encode([
            'success' => true,
            'message' => 'Thank you for your message! We will get back to you within 24 hours.'
        ]);
    } else {
        throw new Exception('Failed to send email');
    }
    
} catch (Exception $e) {
    error_log('Contact form error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Sorry, there was an error processing your request. Please try again or contact us directly.'
    ]);
}
?>
