import nodemailer from 'nodemailer';
import { NEWS_SUMMARY_EMAIL_TEMPLATE } from './template';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendNewsSummaryEmail = async ({email , date, newsContent}: {email: string, date: string, newsContent: string}): Promise<void> => {
    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
    .replace("{{date}}", date)
    .replace("{{newsContent}}", newsContent);

    const mailOptions = {
        from: `"Signalist News" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `📈 Market News Summary for ${date}`,
        text: `Market news summary for ${date}`,
        html: htmlTemplate,
    };
    await transporter.sendMail(mailOptions);
};
