import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

// route imports
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import contactRoute from "./routes/contactRoute.js";


// middleware functions
import errorHandler from "./middlewares/error.js";

dotenv.config();

const __dirname = path.resolve();
const originURLs = process.env.URLS.split(",");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// setting cors and fixing the Access-Control-Allow-Origin error
app.use(
  cors({
    origin:originURLs,
    credentials:true,
  })
);
// app.use(function (req, res, next){

//   const allowedOrigins = process.env.URLS.split(',');
  
//   const origin = req.headers.origin;
//   console.log(origin);
//   if (allowedOrigins.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
//   res.header("Access-Control-Allow-Headers", "Content-Type");
//   res.header("Access-Control-Allow-Credentials", true);
//   next();
// });

// serve the static files
app.use("/uploads",express.static(path.join(__dirname,"uploads")));

//port
const PORT = process.env.PORT || 5000;

// mongoDB URL
const databaseURL = process.env.DATABASE_URL_DEV;


//adding routes
app.use("/api/users",userRoute);
app.use("/api/products",productRoute);
app.use("/api/contactus",contactRoute);

app.get("/",(req,res)=>res.send("Server working"));


app.use(errorHandler);


//connect to DB and start the server
mongoose.connect(databaseURL)
    .then(()=>{
        app.listen(PORT,()=>{
            console.log(`server is running on port: ${PORT}`);
        });
    })
    .catch(err=>{
        console.log(`Error connecting to Database: ${err.message}`);
    })
