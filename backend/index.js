import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import upload from 'express-fileupload';

import { config } from './config/config.js';
import { exe } from './connection.js';
import { adminRoute } from './routers/admin_route.js';
import { userRoute } from './routers/user_route.js';
import { transporter } from './utils/sendEmail.js';

dotenv.config({ path: './config/config.env' });

const app = express();

// Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload());
app.use(express.static("public"));

// CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Test API
app.get("/", (req, res) => {
    res.send("Backend Running Successfully 🚀");
});

// DB TEST (using exe - your old system)
app.get("/db-test", async (req, res) => {
    try {
        const result = await exe("SELECT 1 as test");
        res.json({
            success: true,
            message: "DB Connected Successfully",
            result
        });
    } catch (err) {
        console.log("DB Error:", err);
        res.status(500).json({
            success: false,
            message: "DB Connection Failed",
            error: err
        });
    }
});

// Routes
app.use('/', userRoute);
app.use('/admin', adminRoute);

transporter.verify(function (error, success) {

    if (error) {
        console.log("SMTP ERROR:", error);
    } else {
        console.log("SMTP READY");
    }

});

// Server
const PORT = config.server.port;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});