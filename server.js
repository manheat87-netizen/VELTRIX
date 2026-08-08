const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve your VELTRIX website files
app.use(express.static(__dirname));

// Email configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Contact form
app.post("/contact", async (req, res) => {

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "Please complete all fields."
        });
    }

    try {

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_TO,
            replyTo: email,
            subject: `VELTRIX Contact — ${name}`,
            text:
`New VELTRIX contact message

Name: ${name}
Email: ${email}

Message:
${message}`
        });

        res.json({
            success: true,
            message: "Your message has been sent successfully."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to send the message right now."
        });
    }
});

app.listen(PORT, () => {
    console.log(`VELTRIX server running at http://localhost:${PORT}`);
});