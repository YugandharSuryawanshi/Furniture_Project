import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000
});

export const sendEmail = async (to, subject, html) => {
    try {

        const info = await transporter.sendMail({
            from: `"Furniture Store" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });

        console.log("Email Sent:", info.messageId);

        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error("Email Send Error:", error);
        return { success: false, error: error.message };
    }
};