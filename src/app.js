import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app=express();

//CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://fireauth-frontend.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.urlencoded({limit:'16kb'}))
app.use(express.json({limit:'16kb'}))
app.use(express.static('public'))
app.use(cookieParser())

//routes
import userRouter from './routes/user.route.js'
app.use('/api/v1/users',userRouter);

export {app}