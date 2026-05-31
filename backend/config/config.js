// import dotenv from 'dotenv';
// dotenv.config({ path: './config/config.env' });

// export const config = {
//     userJwtSecret: process.env.USER_JWT_SECRET,
//     userJwtExpire: process.env.USER_JWT_EXPIRE,
//     adminJwtSecret: process.env.ADMIN_JWT_SECRET,
//     adminJwtExpire: process.env.ADMIN_JWT_EXPIRE,
//     razorpayKeyId: process.env.RAZORPAY_KEY_ID,
//     razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,

//     EMAIL_HOST: process.env.EMAIL_HOST,
//     EMAIL_PORT: process.env.EMAIL_PORT,
//     EMAIL_USER: process.env.EMAIL_USER,
//     EMAIL_PASS: process.env.EMAIL_PASS,
    
//     db: {
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_NAME
//     }
// };







import dotenv from 'dotenv';

dotenv.config({ path: './config/config.env' });

export const config = {
    server: {
        port: process.env.DB_PORT || 4000
    },

    userJwtSecret: process.env.USER_JWT_SECRET,
    userJwtExpire: process.env.USER_JWT_EXPIRE,

    adminJwtSecret: process.env.ADMIN_JWT_SECRET,
    adminJwtExpire: process.env.ADMIN_JWT_EXPIRE,

    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,

    email: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    }
};