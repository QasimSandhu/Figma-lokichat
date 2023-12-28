import nodemailer from 'nodemailer';

export async function sendEmailToInviteSuperUser(email,name, invitationCode,link) {
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
        subject: 'Invitation', // Subject line
        text: `Your invitation Code is: ${invitationCode} , and email is :${email} . Here is the link for login ${link}/sign-in?type="referral"` , // Plain text body
      };
  
      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send OTP email');
    }
  }