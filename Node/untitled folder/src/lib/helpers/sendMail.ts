import nodemailer from 'nodemailer';

export async function sendEmail(email = '2016cs507@student.uet.edu.pk', otp) {
    try {
      // Create a Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'usamaitians.gcuf@gmail.com', // Replace with your Gmail email address
          pass: 'yifzznlhlkpwuaal',
        },
      });
  
      // Setup email data with unicode symbols
      const mailOptions = {
        from: 'usamaitians.gcuf@gmail.com', // Sender email address
        to: email, // Recipient email address
        subject: 'OTP Verification', // Subject line
        text: `Your OTP is: ${otp}`, // Plain text body
      };
  
      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send OTP email');
    }
  }