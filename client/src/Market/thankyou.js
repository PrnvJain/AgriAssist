import React, { useEffect } from 'react';
import './ThankYou.css';
import emailjs from 'emailjs-com';

const ThankYou = () => {
  useEffect(() => {
    const sendConfirmationEmail = () => {
      const userEmail = localStorage.getItem('email'); // Get user email from localStorage
      const userName = 'User'; // Replace with actual user name if available
      const senderName = 'AgriAssist'; // The sender's name
      const messageContent = 'Thank you for your purchase! Your order has been successfully processed.'; // Message content

      if (userEmail) {
        // Prepare email parameters
        const emailParams = {
          to_name: userName,
          from_name: senderName,
          to_email: userEmail,
          message: messageContent,
        };

        // Send email using EmailJS
        emailjs
          .send(
            'service_cm97fus', // Replace with your EmailJS Service ID
            'template_4ue5gey', // Replace with your EmailJS Template ID
            emailParams,
            'IcNzc3k8uo1mVxpSW' // Replace with your EmailJS Public Key
          )
          .then(
            (response) => {
              console.log('Email sent successfully:', response);
              console.log(emailParams.to_email);
            },
            (error) => {
              console.error('Error sending email:', error);
            }
          );
      } else {
        console.error('No email found in localStorage');
      }
    };

    // Call the email function when the component mounts
    sendConfirmationEmail();
  }, []);

  return (
    <div className="thankyou-container">
      <h2>Thank you for your purchase!</h2>
      <p>Your order has been successfully processed.</p>
      <p>We will send you a confirmation email shortly.</p>
    </div>
  );
};

export default ThankYou;
