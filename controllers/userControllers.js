const users = require("../models/userSchema");
const customers = require("../models/customerSchema");
const userotp = require("../models/userOtp");
const nodemailer = require("nodemailer");
var bcrypt = require("bcryptjs");

// email config
const tarnsporter = nodemailer.createTransport({
    // service: "gmail",
    // auth: {
    //     user: process.env.EMAIL,
    //     pass: process.env.PASSWORD
    // }
    host: 'smtppro.zoho.in',
    secure: true,
    port: 465,
    auth: {
         user: process.env.EMAIL,
        pass: process.env.PASSWORD
  },
})


exports.userregister = async (req, res) => {
    const { fname, email, password } = req.body;

    if (!fname || !email || !password) {
        res.status(400).json({ error: "Please Enter All Input Data" })
    }

    try {
        const presuer = await users.findOne({ email: email });

        if (presuer) {
            res.status(400).json({ error: "This User Allready exist in our db" })
        } else {
            const userregister = new users({
                fname, email, password
            });

            // here password hasing

            const storeData = await userregister.save();
            res.status(200).json(storeData);
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }

};



// user send otp
exports.userOtpSend = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ error: "Please Enter Your Email" })
    }


    try {
        const presuer = await customers.findOne({ email: email });

        if (presuer) {
            const OTP = Math.floor(100000 + Math.random() * 900000);

            const existEmail = await userotp.findOne({ email: email });
            


            if (existEmail) {
                const updateData = await userotp.findByIdAndUpdate({ _id: existEmail._id }, {
                    otp: OTP
                }, { new: true }
                );
                await updateData.save();
                // const salesEmail = await users.findOne({ email: email });
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Access Code - IT Now Technologies",
                    text: 
                    `Thank you for using us for your marketing requirements.\n \n Please find the access code: ${OTP} \n \n For any clarifications, please contact your sales person - ${presuer.salesemail}.`
                }


                tarnsporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("error", error);
                        res.status(400).json({ error: "email not send" })
                    } else {
                        console.log("Email sent", info.response);
                        res.status(200).json({ message: "Email sent Successfully" })
                    }
                })

            } else {

                const saveOtpData = new userotp({
                    email, otp: OTP
                });

                await saveOtpData.save();
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Access Code - IT Now Technologies",
                    text:`Thank you for using us for your marketing requirements.
                    
                    Please find the access code: ${OTP}
                    
                    For any clarifications, please contact your sales person (email address).`
                }

                tarnsporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("error", error);
                        res.status(400).json({ error: "email not send" })
                    } else {
                        console.log("Email sent", info.response);
                        res.status(200).json({ message: "Email sent Successfully" })
                    }
                })
            }
        } else {
            res.status(400).json({ error: "This User Not Exist In our Db" })
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }
};


exports.userLogin = async(req,res)=>{
    const {email,otp} = req.body;

    if(!otp || !email){
        res.status(400).json({ error: "Please Enter Your OTP and email" })
    }

    try {
        const otpverification = await userotp.findOne({email:email});

        if(otpverification.otp === otp){
            const preuser = await customers.findOne({email:email});

            // token generate
            const token = await preuser.generateAuthtoken();
           res.status(200).json({message:"User Login Succesfully Done",userToken:token});

        }else{
            res.status(400).json({error:"Invalid Otp"})
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }
}

exports.adminLogin = async(req,res)=>{
    console.log('admin login backend')
    const {email,password} = req.body;

    if (!email || !password) {
        res.status(422).json({ error: "fill all the details" })
    }

    try {
       const userValid = await users.findOne({email:email});
       console.log('userValid',userValid)

        if(userValid !== null){

            const isMatch = await bcrypt.compare(password,userValid.password);
            // const isMatch = await bcrypt.compare(plaintextPassword, hash);
            console.log('isMatch',isMatch)
            if(!isMatch){
                res.status(422).json({ error: "invalid details"})
            }else{
                // token generate
                const token = await userValid.generateAuthtoken();
                console.log('token',token)
                // cookiegenerate
                // res.cookie("usercookie",token,{
                //     expires:new Date(Date.now()+9000000),
                //     httpOnly:true
                // });

                const result = {
                    userValid,
                    token
                }
                res.status(201).json({status:201,result})
            }
        }

    } catch (error) {
        res.status(401).json(error);
        console.log("catch block");
    }
}

exports.adminLogout = async(req,res)=>{
    const {userName,token} = req.body;
    console.log('req',userName);
    // let token = localStorage.getItem("userdbtoken");
    console.log('req',token)
//     let token = window.localStorage.getItem("userdbtoken");


   
   let userId = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())._id;
   console.log('ggg',userId) ;
   try {
    const userDetails = await users.findOneAndUpdate({_id:userId}, {
       tokens:[]
    });
    console.log('userValid',userDetails)
    res.status(201).json({status:201})
    // Favorite.updateOne({ cn: req.params.name }, {
    //     $pullAll: {
    //         favorites: req.params.deleteUid,
    //     },
    // });

    //  if(userDetails !== null){

    //      const isMatch = await bcrypt.compare(password,userValid.password);
    //      // const isMatch = await bcrypt.compare(plaintextPassword, hash);
    //      console.log('isMatch',isMatch)
    //      if(!isMatch){
    //          res.status(422).json({ error: "invalid details"})
    //      }else{
    //          // token generate
    //          const token = await userValid.generateAuthtoken();
    //          console.log('token',token)
    //          // cookiegenerate
    //          // res.cookie("usercookie",token,{
    //          //     expires:new Date(Date.now()+9000000),
    //          //     httpOnly:true
    //          // });

    //          const result = {
    //              userValid,
    //              token
    //          }
    //          res.status(201).json({status:201,result})
    //      }
    //  }

 } catch (error) {
     res.status(401).json(error);
     console.log("catch block");
 }
}