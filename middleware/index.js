const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();


//login token authrization
exports.login_required = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1]
    const user = jwt.verify(token, process.env.Secret);
    req.user = user;
    // console.log(user)
  } else {
    res.status(403).send("authrization requied")
  }
  next();
}


//login token authrization
exports.isAdmin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1]
    const user = jwt.verify(token, process.env.SECRET);
    console.log("user...", user.userInfo)
    if (user.userInfo.role != "admin") {
      return res.status(403).send({ message: "Not Permission this role.." })
    }
    req.user = user;
  } else {
    res.status(403).send({ message: "authrization requied" })
  }
  next();
}


//email send service
module.exports.mailsend = async (body, mail_data) => {
  console.log("body", mail_data)

  let transporter = await nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER, // Admin Gmail ID
      pass: process.env.EMAIL_PASS, // Admin Gmail Password
    },
    logger: true,
    debug: process.env.SMTP_DEBUG, // include SMTP traffic in the logs
    tls: {
      rejectUnauthorized: false,
    },
  });
  
  const mailInfo = await transporter.sendMail(body);
  console.log("mailInfo", mailInfo)
  if (!mailInfo) {
    console.log("Error occurred");
    console.log(error);
    return false;
  } else {
    console.log("Message sent successfully!");
    return mailInfo;
  }
};
