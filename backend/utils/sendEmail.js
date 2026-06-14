import { Resend } from 'resend';
import { config } from '../config/config.js';

const resend = new Resend(config.resend.apiKey);

export const sendEmail = async (to, subject, html) => {
    try {
        const response = await resend.emails.send({
            from: 'Furniture Store <onboarding@resend.dev>',
            to,
            subject,
            html
        });

        console.log("Resend response:", response);

        return response;
    } catch (error) {
        console.error("Resend email error:", error);
        throw error;
    }
};