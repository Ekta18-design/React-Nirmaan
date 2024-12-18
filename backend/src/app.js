// src/app.js
import express from 'express';
//import path from 'path';
//import { fileURLToPath } from 'url';
//import { dirname } from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import userMasterRoutes from './routes/usermaster.js';
import builderMasterRoutes from './routes/buildermaster.js';
import projectMasterRoute from './routes/projectmaster.js';
import unitcategoryMasterRoute from './routes/unitcategorymaster.js';
import clientMasterRoute from './routes/clientmaster.js';
import buildingMasterRoute from './routes/buildingmaster.js';
import buildingUnitMasterRoute from './routes/buildingunitmaster.js';
import uploadMasterRoute from './routes/uploadmaster.js';
import registrationRoute from './routes/registration.js';
//import protectedRoutes from './routes/protectedRoutes.js'; 
import dotenv from 'dotenv';
import loginRoute from './routes/login.js';
import userRouter from './routes/user.js';
import emailRoute from './routes/email.js';

const app = express();
dotenv.config(); // Load environment variables from .env file
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // Serve static files from the "uploads" directory
app.use('/fileupload', express.static('fileupload'));
//app.use('/fileupload', express.static(path.join(__dirname, '../../fileupload')));

app.use('/usermaster', userMasterRoutes);
app.use('/buildermaster', builderMasterRoutes);
app.use('/projectmaster',projectMasterRoute);
app.use('/unitcategorymaster',unitcategoryMasterRoute);
app.use('/clientmaster',clientMasterRoute);
app.use('/buildingmaster',buildingMasterRoute);
app.use('/buildingunitmaster',buildingUnitMasterRoute);
app.use('/uploadmaster',uploadMasterRoute);
app.use('/registration',registrationRoute);
//app.use('/api', protectedRoutes); // Use protected routes
app.use('/login', loginRoute);
app.use('/user', userRouter);
app.use('/email', emailRoute);

export default app;
