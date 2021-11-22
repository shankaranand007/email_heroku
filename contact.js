var RateLimiter = require("limiter").RateLimiter;
var limiter = new RateLimiter(5, "hour");
const nodemailer = require("nodemailer");
// let transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });


let transporter = nodemailer.createTransport({
  service: 'Zoho',
  host: 'mail.zoho.com',
  port: 587,//587
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'shankar@sigmared.ai',
    pass: 'Temp124@'
  }
});
module.exports.SEND_MESSAGE = async (req, res) => {
  try {
    var { name, email, message } = req.body;
    if (name && email && message) {

      var token = limiter.getTokensRemaining();
  console.log("message trtjn",name,email,message,token)

      if (token < 1) {
        res.status(200).json({
          message: "Max. Limit Exceeds Please try again after 24 hours",
          status: 0,
        });
      } else {
        console.log("elseblock")
        const ip = req.connection.remoteAddress;
        var response=await transporter.sendMail({
          from: `"Website Query " ${process.env.SMTP_USER}`, // sender address
          to: process.env.ADMIN_EMAIL,
          subject: `New Message From ${name} Via Website`,
          html: `From: <b>${name}</b><br>Email: <b>${email}</b><br>IP: <b>${ip}</b><br>Mobile: <b>${"phone"}</b><br><br>Message:<br><b>${message}</b>`,
        });
        if (response) {
          res.status(200).json({
            message: "Message sent",
            status: 1,
          });
          limiter.tryRemoveTokens(1); //throttler
        } else {
          res.status(200).json({
            message:
              "Something went wrong from our side please try after some time",
            status: 0,
          });
        }
      }
    } else {
      res.status(200).json({ message: "Missing Required Field", status: 0 });
    }
  } catch (err) {
    console.log("error",err)

    res.status(500).json({
      path: "Internal Server Error",
      message: err.message,
      status: 0,
    });
  }
};
