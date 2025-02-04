<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Load PHPMailer

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']); // Sender's email
    $subject = htmlspecialchars($_POST['subject']);
    $message = htmlspecialchars($_POST['message']);

    $recipient_email = 'gowthamthangaraj18@gmail.com'; // Your email (where you receive messages)
    $recipient_name = 'Gowtham T';

    $mail = new PHPMailer(true);

    try {
        // SMTP Configuration
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'gowthamthangaraj18@gmail.com'; // Your Gmail
        $mail->Password   = 'hnwu hxbd lgid ijwh'; // App Password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;
        $mail->SMTPKeepAlive = true; // Keep the SMTP connection alive

        // First Email: To You (Recipient)
        $mail->setFrom($email, $name);
        $mail->addAddress($recipient_email, $recipient_name);
        $mail->Subject = "New Contact Form Message: " . $subject;
        $mail->Body    = "You received a message from: \n\nName: $name\nEmail: $email\n\nMessage:\n$message";

        $mail->send(); // Send first email

        // Reset recipients to send another email
        $mail->clearAddresses();
        $mail->clearAttachments();

        // Second Email: Auto-reply to Sender
        $mail->setFrom($recipient_email, $recipient_name);
        $mail->addAddress($email, $name);
        $mail->Subject = "We've Received Your Message!";
        $mail->Body    = "Hello $name,\n\nThank you for reaching out! We have received your message:\n\n\"$message\"\n\nWe will get back to you as soon as possible.\n\nBest regards,\nBalaji Ragul P";

        $mail->send(); // Send auto-reply

        echo "Message sent successfully! You will receive a confirmation email shortly.";
    } catch (Exception $e) {
        echo "Message could not be sent. Error: {$mail->ErrorInfo}";
    }
} else {
    echo "Invalid request!";
}
?>
