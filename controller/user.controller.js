const Bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User= require('../model/user_schema');
// const transport = require("../middleware/index");

//signup user
const signup= async (req,res)=>{
    try{
        const {
            first_name,
            last_name,
            email,
            mobile,
            password,
            role,
        }= req.body;
        if(!first_name ||!last_name || !email || !mobile || !password){
            return res.send({message: "please fill all fields"})
        }
        const userExits= await User.find({email: email}).exec()
        if(userExits.length>0){
            return res.send({message: "user already exit please go to login..."})
        }else{
            let otp= Math.floor(1000 + Math.random() * 90000);
            console.log("otp", otp)
            let user= new User({first_name,last_name, email, mobile, password, role, otp})
            await user.save();

            // let link= `http://localhost:5000/api/signin`
            // await transport.mailsend({
            //     from: "aijaj535@gmail.com",
            //     to: req.body.email,
            //     subject: "User - Password ",
            //     html: `<p><strong>Hi ${first_name}</strong> <br>Please find your link for User login <a href = ${link}>Click Here </a>
            //     Your <strong>OTP is ${otp}</strong> 
            //     Your <strong>Official Email Id is</strong> ${email}
            //     Your Password is: <strong> ${password} </strong>
            // </p>`,
            // });
              res.status(200).send({
                status: "success",
                message: "Registration successfully",
                statusCode: 200,
                data: user,
            });
        }
    }
    catch(err){
        console.log(err.message)
        res.status(200).send({message:"therei is someting error..", error: err.message});
    }
}


//signin user
const signin= async (req,res)=>{
    try{
        console.log(req.body)
        const {email, password, mobile}=req.body;
        if(!password || !email){
            res.status(400).send("please fill the data...");
        }
        let user_detail =await User.findOne({email: email, approved_status: true})
        let admin_detail =await User.findOne({ email: email, role: "admin"});

        let userInfo= user_detail? user_detail : admin_detail
        console.log("userInfo", userInfo)
        if(userInfo){
            const isMatch=await Bcrypt.compare(password, userInfo.password);
            if(!isMatch){
                return res.status(400).send({error: "Invalid Credentials", data: null})
            }
                 // console.log("encrypted password match success!")
                let token =await jwt.sign({ userInfo: userInfo }, process.env.SECRET || "aijajkhan", {expiresIn: 86400 }); // expires in 24 hours
                // let token= await userInfo.generateAuthToken();
                res.cookie("jwtToken", token, {
                    expires: new Date(Date.now()+ 300000000),
                    httpOnly: true
                });
                res.send({
                    token: token,
                    userInfo: userInfo,
                    message: "login Success"
                })
        }else{
            res.status(400).send({error: "email not verified please email verified...", code: 403})
        }     
    }
    catch(err){
        console.log(err.message)
        res.send("there is problem to login...", err.message)
    } 
}


//all users information
const allUsers= async (req,res)=>{
    try{
        const userdata= await User.find({})
        if(userdata.length>0){
            return res.send({message: "get all data sucessfully!", data: userdata})
        }else{
            return res.send({message: "data not found"})
        }
    }
    catch(err){
        console.log(err.message)
    }
}


//logout page
const logout= async(req,res)=>{
    console.log("logout")
    res.clearCookie("jwtToken", {path: '/'})
    res.status(200).send("user logout");
}


//update service information
const updateDetails= async(req,res)=>{
    try{
        const {first_name,description,email,mobile, last_name}=req.body
        console.log("req.body", req.body)
        const updateData= await User.updateOne({_id: req.params.id}, {
            $set:{
                first_name, last_name,email,description,mobile
            }
        })
        console.log("updateData", updateData)
        res.send({status: "update data successfully! ", "result": updateData})
    }
    catch(err){
        console.log(err.message)
    }
}


//verified User from Admin
const profileDetails= async (req,res)=>{
    try{
        let userId=req.params.id
        const userdata= await User.findOne({_id: userId})
        if(userdata){
            return res.send({
                message: "email verified sucessfully!", 
                code: 200,
                data: userdata
            })
        }else{
            return res.send({message: "please input correct otp...."})
        }
    }
    catch(err){
        console.log(err.message)
    }
}

module.exports={
    signup,
    signin,
    logout,
    allUsers,
    updateDetails,
    profileDetails
}