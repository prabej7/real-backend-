import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

const sendMail = async (email: string, otp: number) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Test",
            html: `<b>Your OTP is ${otp}</b>`,
        });
    } catch (e) {
        throw new Error('Error occurred during email sending.')
    }
};

export default sendMail