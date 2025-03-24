<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configuration
$recipient_email = "basantgour23@gmail.com"; // Change this to your email address
$email_subject = "New Contact Form Submission from PixMiracle Website";
$success_redirect = "contact.html?status=success";
$error_redirect = "contact.html?status=error";

// For debugging - log the form submission
$debug_log_file = "contact_form_log.txt";
$debug_data = date("Y-m-d H:i:s") . " - Form submission received\n";
$debug_data .= "POST data: " . print_r($_POST, true) . "\n";
$debug_data .= "Server info: " . print_r($_SERVER, true) . "\n";
file_put_contents($debug_log_file, $debug_data, FILE_APPEND);

// Function to sanitize form data
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Get form data and sanitize it
    $firstName = isset($_POST['firstName']) ? sanitize_input($_POST['firstName']) : '';
    $lastName = isset($_POST['lastName']) ? sanitize_input($_POST['lastName']) : '';
    $email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? sanitize_input($_POST['phone']) : '';
    $company = isset($_POST['company']) ? sanitize_input($_POST['company']) : '';
    $service = isset($_POST['service']) ? sanitize_input($_POST['service']) : '';
    $message = isset($_POST['message']) ? sanitize_input($_POST['message']) : '';
    $newsletter = isset($_POST['newsletter']) ? 'Yes' : 'No';
    
    // Log the processed data
    $processed_data = "Processed data:\n";
    $processed_data .= "First Name: $firstName\n";
    $processed_data .= "Last Name: $lastName\n";
    $processed_data .= "Email: $email\n";
    $processed_data .= "Phone: $phone\n";
    $processed_data .= "Company: $company\n";
    $processed_data .= "Service: $service\n";
    $processed_data .= "Message: $message\n";
    $processed_data .= "Newsletter: $newsletter\n";
    file_put_contents($debug_log_file, $processed_data, FILE_APPEND);
    
    // Validate required fields
    if (empty($firstName) || empty($lastName) || empty($email) || empty($service) || empty($message)) {
        // Log validation error
        $error_msg = "Validation error: Missing required fields\n";
        file_put_contents($debug_log_file, $error_msg, FILE_APPEND);
        
        // Redirect back with error
        header("Location: $error_redirect");
        exit();
    }
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Log validation error
        $error_msg = "Validation error: Invalid email format\n";
        file_put_contents($debug_log_file, $error_msg, FILE_APPEND);
        
        // Redirect back with error
        header("Location: $error_redirect");
        exit();
    }
    
    // Prepare plain text email content (as fallback)
    $plain_content = "You have received a new contact form submission from your website.\n\n";
    $plain_content .= "Name: $firstName $lastName\n";
    $plain_content .= "Email: $email\n";
    $plain_content .= "Phone: " . ($phone ? $phone : "Not provided") . "\n";
    $plain_content .= "Company/Organization: " . ($company ? $company : "Not provided") . "\n";
    $plain_content .= "Service Interested In: $service\n";
    $plain_content .= "Subscribe to Newsletter: $newsletter\n\n";
    $plain_content .= "Message:\n$message\n";
    $plain_content .= "\n---\n";
    $plain_content .= "This message was sent from the contact form on the PixMiracle website.\n";
    $plain_content .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
    $plain_content .= "Date: " . date("Y-m-d H:i:s") . "\n";
    
    // Prepare HTML email content
    $html_content = '
    <html>
    <head>
        <title>New Contact Form Submission</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 5px;
            }
            .header {
                background-color: #0d6efd;
                color: white;
                padding: 15px;
                text-align: center;
                border-radius: 5px 5px 0 0;
            }
            .content {
                padding: 20px;
            }
            .field {
                margin-bottom: 10px;
            }
            .label {
                font-weight: bold;
                color: #0d6efd;
            }
            .message-box {
                background-color: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                margin-top: 20px;
            }
            .footer {
                font-size: 12px;
                color: #666;
                border-top: 1px solid #ddd;
                margin-top: 20px;
                padding-top: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>New Contact Form Submission</h2>
            </div>
            <div class="content">
                <p>You have received a new contact form submission from your website.</p>
                
                <div class="field">
                    <span class="label">Name:</span> ' . $firstName . ' ' . $lastName . '
                </div>
                <div class="field">
                    <span class="label">Email:</span> ' . $email . '
                </div>
                <div class="field">
                    <span class="label">Phone:</span> ' . ($phone ? $phone : "Not provided") . '
                </div>
                <div class="field">
                    <span class="label">Company/Organization:</span> ' . ($company ? $company : "Not provided") . '
                </div>
                <div class="field">
                    <span class="label">Service Interested In:</span> ' . $service . '
                </div>
                <div class="field">
                    <span class="label">Subscribe to Newsletter:</span> ' . $newsletter . '
                </div>
                
                <div class="message-box">
                    <span class="label">Message:</span>
                    <p>' . nl2br($message) . '</p>
                </div>
                
                <div class="footer">
                    <p>This message was sent from the contact form on the PixMiracle website.<br>
                    IP: ' . $_SERVER['REMOTE_ADDR'] . '<br>
                    Date: ' . date("Y-m-d H:i:s") . '</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    ';
    
    // Try a simpler approach first - sometimes the complex MIME message can cause issues
    // Email headers
    $headers = "From: PixMiracle Contact Form <$email>\r\n";
    $headers .= "Reply-To: $firstName $lastName <$email>\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Log mail attempt
    $mail_log = "Attempting to send email to: $recipient_email\n";
    $mail_log .= "Subject: $email_subject\n";
    $mail_log .= "Headers: $headers\n";
    file_put_contents($debug_log_file, $mail_log, FILE_APPEND);
    
    // Send the email
    $mail_result = mail($recipient_email, $email_subject, $html_content, $headers);
    
    // Log the mail result
    $result_log = "Mail result: " . ($mail_result ? "Success" : "Failed") . "\n";
    $result_log .= "PHP mail settings: \n";
    $result_log .= "sendmail_path: " . ini_get('sendmail_path') . "\n";
    $result_log .= "SMTP: " . ini_get('SMTP') . "\n";
    $result_log .= "smtp_port: " . ini_get('smtp_port') . "\n\n";
    file_put_contents($debug_log_file, $result_log, FILE_APPEND);
    
    if ($mail_result) {
        // Success! Redirect to thank you page
        file_put_contents($debug_log_file, "Redirecting to success page\n\n", FILE_APPEND);
        header("Location: $success_redirect");
        exit();
    } else {
        // Failed to send email. Redirect back with error
        file_put_contents($debug_log_file, "Redirecting to error page\n\n", FILE_APPEND);
        header("Location: $error_redirect");
        exit();
    }
} else {
    // If the form wasn't submitted properly, redirect to the form page
    file_put_contents($debug_log_file, "Form not submitted properly\n\n", FILE_APPEND);
    header("Location: contact.html");
    exit();
}
?> 