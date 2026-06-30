import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");


import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import {serve} from "inngest/express";
import { inngest, functions} from "./inngest/index.js"
import showRouter from './routes/showRoutes.js';

const app =express();
const port = 3000;

await connectDB()

//Middleware
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())


app.get('/',(req,res)=> res.send('Server is Live!'))
app.use('/api/inngest',serve({client:inngest, functions}))
app.use('/api/show',showRouter)

import movieRouter from './routes/movieRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import favoriteRouter from './routes/favoriteRoutes.js';

app.use('/api/movie', movieRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/favorite', favoriteRouter);

app.listen(port,()=> console.log(`Server listening at http://localhost:${port}`));