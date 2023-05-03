const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { readdir } = require("fs");
const morgan = require("morgan");
const cors = require("cors");
require("./models/User");
// connecting to database and all databse connection related code is here
const db = require("./db");
let PORT = process.env.PORT || 8000;

const app = express();
app.use(morgan("dev"));
// for recieving and sending json files
app.use(express.json());
// for cookie related usage
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const corsConfig = {
  origin: true,
  credentials: true,
};
// for allowing cross origin requests
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

// app.use(login);
app.use(function (req, res, next) {
  const corsWhitelist = [
    "https://y4sh-patel.github.io/tnp",
    "https://tnp-svnit.herokuapp.com/#/",
    "http://localhost:3000",
  ];
  if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, HEAD, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", true);
  }
  //   res.header("Access-Control-Allow-Origin", "https://y4sh-patel.github.io/tnp");
  //   // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  //   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  //   res.header("Access-Control-Allow-Headers", "Content-Type");
  //   res.header("Access-Control-Allow-Credentials", true);
  // }
  next();
});

app.get("/", async (req, res) => {
  res.json("Reached to the root");
});

let pathname = __dirname + "/routes";
//uses routes filename as the route name and the file as the route handler
readdir(pathname, async (err, data) => {
  if (err) console.log(err.message);
  else
    data.map((r) => {
      return app.use(`/${r.split(".")[0]}`, require(`${pathname}/${r}`));
    });
});

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});