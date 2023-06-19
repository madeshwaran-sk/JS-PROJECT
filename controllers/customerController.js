const customer = require("../models/customerSchema");
const userotp = require("../models/userOtp");
const nodemailer = require("nodemailer");
const busboy = require('busboy');
const jwt = require("jsonwebtoken");

const fs = require('fs');
const AWS = require('aws-sdk');
var bcrypt = require("bcryptjs");
const s3 = new AWS.S3({
    accessKeyId: 'AKIATJ5P6XTN4WFZOIMO',
    secretAccessKey: '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'
  });
  AWS.config.update({region: 'us-east-1'});

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
// const fileName = 'test.csv';

// const uploadFile = () => {
//     fs.readFile(fileName, (err, data) => {
//        if (err) throw err;
//        const params = {
//            Bucket: 'testBucket', // pass your bucket name
//            Key: 'contacts.csv', // file will be saved as testBucket/contacts.csv
//            Body: JSON.stringify(data, null, 2)
//        };
//        s3.upload(params, function(s3Err, data) {
//            if (s3Err) throw s3Err
//            console.log(`File uploaded successfully at ${data.Location}`)
//        });
//     });
//   };
  
//   uploadFile();

exports.customerregister = async (req, res) => {
    const { fileurl, email,downloads,salesemail} = req.body;
    // console.log('gggg',fileurl, email)

    if (!fileurl || !email || !salesemail) {
        res.status(400).json({ error: "Please Enter All Input Data" })
    }

    try {
        const presuer = await customer.findOne({ email: email });

        if (presuer) {
            res.status(400).json({ error: "This User Allready exist in our db" })
        } else {
            const customerregister = new customer({
                fileurl, email,downloads,salesemail
            });

            // here password hasing

            const storeData = await customerregister.save();
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "Your File has been uploaded",
                text: `Your recent purchase has been completed and the file has been uploaded to our portal.\n \n You can use the below link to complete the download.\n \n www.itnowtechnologies.us/deliveryportal \n \n Steps to complete the Download:\n \n1: Go to our website www.itnowtechnologies.us/deliveryportal \n 2. Enter the email address which you used to communicate with us.\n 3. Enter the access code which have you received through email. \n 4. Click the Download button in the next page to access the file.`
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
            const mailOptionsforsales = {
                from: process.env.EMAIL,
                to: salesemail,
                subject: `File upload alert`,
                text:`Your recent client's ${email} file has been uploaded successfully by our internal team.\n \n Please inform the client and ask him to download the file within next 20 working days otherwise the file will be deleted from storage.\n \n And also, you can pitch other services such as Email Campaign and Template Creation to your clients.\n \n \n Happy selling! \n \n \n IT Now Technologies`
            }

            tarnsporter.sendMail(mailOptionsforsales, (error, info) => {
                if (error) {
                    console.log("error", error);
                    res.status(400).json({ error: "email not send" })
                } else {
                    console.log("Email sent", info.response);
                    res.status(200).json({ message: "Email sent Successfully" })
                }
            })
            res.status(200).json({status:200})
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }

};

exports.customerList = async (req, res) => {
    // const authHeader = req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')[1]
  
    // if (token == null) return res.sendStatus(401)
  
    // jwt.verify(token, "abcdefghijklmnop", (err, user) => {
    //   console.log(err)
  
    //   if (err) return res.sendStatus(403)
  
    //   req.user = user
    //   const now = Math.floor(Date.now() / 1000)
    //   console.log('req',req)
    //   console.log('hh', req.user.exp  > now)
    // })

    try {
        const customerList = await customer.find({ time : {$gte: req.body.startDate, $lte: req.body.endDate}}).sort({ time: -1 }).limit(req.body.entry);

            res.status(200).json({status:200,customerList})

    } catch (error) {
        res.status(400).json({ error: "unable to fetch data", error })
    }

};

exports.userDetails = async(req,res)=>{
    const {token} = req.body;
   let userId = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())._id;
   console.log('ggg',JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())) ;
   try {
    const userDetails = await customer.find({_id:userId});
    res.status(201).json({status:201,userDetails})

 } catch (error) {
     res.status(401).json(error);
 }
}

exports.updateDownloads = async(req,res)=>{
    const {token,downloads} = req.body;
   let userId = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())._id;
   try {
    const userDetails = await customer.findOneAndUpdate({_id:userId},{downloads:downloads});

    if(userDetails && userDetails.salesemail){
        const mailOptionsforsales = {
            from: process.env.EMAIL,
            to: `${userDetails.salesemail}`,
            subject: `File is downloaded for user of email id :${userDetails.email}`,
            text:`File is downloaded for user of email id :${userDetails.email} `
        }
    
        tarnsporter.sendMail(mailOptionsforsales, (error, info) => {
            if (error) {
                res.status(400).json({ error: "email not send" })
            } else {
                console.log("Email sent", info.response);
                res.status(200).json({ message: "Email sent Successfully" })
            }
        })
    }else{
        console.log("email not sent");
    }
    
    res.status(201).json({status:201,userDetails})
 } catch (error) {
     res.status(401).json(error);
 }
}


exports.uploadFile=(req,res)=>{
    // console.log(req);
    // console.log("response", res);
    // console.log('hhh',req.body)
    //  const { file} = req.b;

    // const params = {
    //     Bucket: 'wp-s3-bucket-wiki', // pass your bucket name
    //      Key: 'test.csv',
    //     Body: file.data
    //   };
    
    //   s3.upload(params, (err, data) => {
    //     if (err) {
    //       console.log('Error:', err);
    //     } else {
    //       console.log('Upload Success:', data.Location);
    //     }
    //   });

    const bb = busboy({ headers: req.headers });

  

    bb.on('file', (_, file, fileName) => {
        // console.log('kk',file);
        // console.log('kk',fileName)
        try{
            const params = {
                Bucket: 'cloud-delivery-portal', // pass your bucket name
                Key: fileName.filename, // file will be saved as testBucket/contacts.csv
                // Body: JSON.stringify(file, null, 2)
                Body: file
            };
            s3.upload(params, function(s3Err, data) {
                if (s3Err) throw s3Err
                res.status(200).json( `${data.Location}`)
                console.log(`File uploaded successfully at ${data.Location}`)
            });
       } catch (error) {
        console.log('error',error)
        res.status(400).json({ error: "unable to upload file", error })
        
    }
       
    });

    req.pipe(bb)
  

    // console.log("object type", file);
    // try {
    //       fs.readFile("file",(err, file) => {
    //         console.log('err',err)
    //     if (err) throw err;
    //     const params = {
    //         Bucket: 'wp-s3-bucket-wiki', // pass your bucket name
    //         Key: 'test.csv', // file will be saved as testBucket/contacts.csv
    //         // Body: JSON.stringify(file, null, 2)
    //         Body: fs.createReadStream(file)
    //     };
    //     s3.upload(params, function(s3Err, data) {
    //         if (s3Err) throw s3Err
    //         console.log(`File uploaded successfully at ${data.Location}`)
    //     });
    //  });
    // } catch (error) {
    //     console.log('error',error)
    //     res.status(400).json({ error: "Invalid Details", error })
        
    // }



    // ===================
    // var params = {
    //     Bucket: 'wp-s3-bucket-wiki',
    //     Key: 'test.csv',
    //     Body: file,
    //     ContentType: 'application/octet-stream',
    //     ContentDisposition: contentDisposition('test.csv', {
    //         type: 'inline'
    //     }),
    //     CacheControl: 'public, max-age=86400'
    // }
    // s3.putObject(params, function(err, data) {
    //     if (err) {
    //         console.log("Error at uploadCSVFileOnS3Bucket function", err);
    //         next(err);
    //     } else {
    //         console.log("File uploaded Successfully");
    //         next(null, 'test.csv');
    //     }
    // });

}



