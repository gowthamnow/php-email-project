<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Load PHPMailer

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

$mail = new PHPMailer(true);

try {
    // Enable SMTP Debugging (Set to 0 for production)
     // Change to 3 for more details (or 0 to disable)

    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';  // Gmail SMTP server
    $mail->SMTPAuth   = true;
    $mail->Username   = 'gowthamthangaraj18@gmail.com';  // Your Gmail address
    $mail->Password   = 'hnwu hxbd lgid ijwh';  // Your Google App Password (not your Gmail password)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // Sender & Recipient
    $mail->setFrom('gowthamthangaraj18@gmail.com', 'Your Name');  // Your email & name
    $mail->addAddress('gowthamthangaraj18@gmail.com', 'Recipient Name');  // Recipient email & name

    // Email Subject & Body
    $mail->Subject = 'Test Email from PHPMailer';
    $mail->Body    = 'Hello, this is a test email sent using PHPMailer with Gmail SMTP.';

    // Send Email
    if ($mail->send()) {
        echo 'Message sent successfully!';
    } else {
        echo 'Failed to send message.';
    }
} catch (Exception $e) {
    echo "Message could not be sent. Error: {$mail->ErrorInfo}";
}
?>
