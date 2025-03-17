import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import upload from 'express-fileupload';
import { userRoute } from './routers/user_route.js';
import { adminRoute } from './routers/admin_route.js';
import { config } from './config/config.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(upload());
app.use(express.static("public"));

//Configure CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/', userRoute);
app.use('/admin', adminRoute);

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});








