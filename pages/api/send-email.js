import nodemailer from "nodemailer";
import Cors from "cors";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "POST", "HEAD"],
});

// Creating the transporter object
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "your-gmail-account@gmail.com",
//     pass: "your-gmail-password",
//   },
// });
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

// Get the recipient email address from an environment variable
const toEmail = process.env.EMAIL_ADDRESS;

const handler = (req, res) => {
  // Run the cors middleware
    cors(req, res, async () => {
        try {
            const { name, email, subject, message } = req.body;

            const mailOptions = {
            from: email,
            to: toEmail,
            subject: `NEW Contact Form Submission from ${name} (${email})`,
            html: `
                <h3>New Contact Form Submission</h3>
                <ul>
                <li>Name: ${name}</li>
                <li>Email: ${email}</li>
                <li>Subject: ${subject}</li>
                <li>Message: ${message}</li>
                </ul>
            `,
            };

            await transporter.sendMail(mailOptions);

            res.status(200).json({ message: "Email sent successfully!" });
        } catch (error) {
            console.error(error);
            
            res.status(500).json({ message: "Error sending email." });
        }
    });
};

export default handler;