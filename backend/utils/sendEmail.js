import { Resend } from 'resend';
import { config } from '../config/config.js';

const resend = new Resend(config.resend.apiKey);

export const sendEmail = async (
    to,
    subject,
    html
) => {

    return await resend.emails.send({
        from: 'Furniture Store <onboarding@resend.dev>',
        to,
        subject,
        html
    });
};