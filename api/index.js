import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';


dotenv.config();

mongoose.connect(process.env.MONGO).then(()=> {
    console.log('Successfully Connected to MongoDB!');
}).catch((error) => {
    console.log(error);
})

const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
    console.log('Server listening on port 3000!!!');
})

// api route
// app.get('/test', (req, res) => {
//     // res.send('Hello World!');
//     res.json({
//         message: 'hello world'
//     })
// })
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)


//error middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        statusCode,
        message,
        success: false
    });
});

