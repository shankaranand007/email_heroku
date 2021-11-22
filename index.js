require("dotenv/config");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var cors = require("cors");
var { SEND_MESSAGE } = require("./contact");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Backend is Running");
});
app.post("/", SEND_MESSAGE);
app.get("/test", (req,res)=>{
  res.send("test")
});

const port = process.env.PORT || 3050;
app.listen(port, () => {
  console.log("Connected to express server @" + port);
});
