const mysql=require('mysql')
const myconstants=require('../myconstants')
const multer=require('multer')
const path=require('path')
const jwt=require('jsonwebtoken')
const secretkey="superkey"
const bcrypt=require('bcrypt')
const authToken = '6d1553d935f09f4acd3fa4430a6449a1'
const accountSid = 'AC55780947fbe52709d410111e64671587'
const client = require('twilio')(accountSid, authToken);




const conn=mysql.createConnection(
    {
        host: "localhost",
        user: 'root',
        password: '',
        database: 'pathports',
    }
)

conn.connect(function(err) {
    if (err) throw err;
    console.log("database Connected!");
  });
  
  function queryDb(query) {
      return new Promise((resolve, reject) => {
        conn.query(query, (err, result) => {
              if (err) {
                  return reject(err);
              }
              resolve(result);
        });
        
      })
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,"../user_Images/images"))
    },
    filename: function (req, file, cb) {
        console.log('file data +++++++++++++++++++++++++',file)
        cb(null, file.fieldname + '-' +Date.now()+path.extname(file.originalname) )
    }
}
  )

  
var store = multer({ storage: storage }).single('profile')



exports.user_signUp=async(req,res)=>{
  try{
    store(req,res,async(err)=>{
    let file=req.file;
    if(err) throw err;
    let myprofile=file.filename;
    let data=req.body;
    let hash=bcrypt.hashSync(data.password,10)
    data.password=hash;
    let get_user="SELECT * FROM `users` WHERE email='"+data.email+"'"
    let check_user=await queryDb(get_user)
    if(check_user.length>0){
        res.send(
            {
                status:myconstants.error_code,
                message:"user with this email already exist"
            }
        )
    }else{
        let otp=Math.ceil(Math.random()*1000000)

    client.
    messages.create
    (
        { 
            to: data.phonenumber, 
            from: +12525855097,
            body: 'Verify First: Your code is ' + otp
        }
        )
        let add_user="INSERT INTO `users`( `first_name`, `last_name`, `email`, `password`, `phonenumber`, `gender`, `profile`,`otp`) VALUES ('"+data.first_name+"','"+data.last_name+"','"+data.email+"','"+data.password+"','"+data.phonenumber+"','"+data.gender+"','"+myprofile+"','"+otp+"')"
        let chech_add_user=await queryDb(add_user)
        if(!chech_add_user.affectedRows>0){
            res.send(
                {
                    status:myconstants.error_code,
                    message:"Unable to insert data"
                }
            )
        }else{
            let token=jwt.sign(
                {
                    userId:chech_add_user.id
                },
                secretkey,
                {
                    expiresIn:"20d"
                }
            )
            if(token){
                let id=chech_add_user.insertId
                console.log("my user id is=-=-=-=-",id)
                let update_token="UPDATE `users` SET `jwt_token`='"+token+"' WHERE id='"+id+"'"
                let check_updateToken=await queryDb(update_token)
                if(!check_updateToken.affectedRows>0){
                    res.send(
                        {
                            status:myconstants.error_code,
                            message:"Unable to add the token "
                        }
                    )
                }else{
                    res.send(
                        {
                            status:myconstants.success_code,
                            message:"Successfully added the user"
                        }
                    )
                }
            }
        }
    }
}
)
  }catch(err){
    res.send(
        {
            status:myconstants.error_code,
            message:err.message
        }
    )
  }
}

exports.verify_user=async(req,res)=>{
    try{
      let data=req.body;
      let get_user="SELECT * FROM `users` WHERE email='"+data.email+"'"
      let check_get_user=await queryDb(get_user)
      if(!check_get_user.length>0){
        res.send(
            {
                status:myconstants.error_code,
                message:"data not found,user with this email id do not exist"
            }
        )
      }else{
        if(data.otp!=check_get_user[0].otp){
            res.send(
                {
                    status:myconstants.error_code,
                    message:"otp you sent is not correct"
                }
            )
        }else{
            let otp_status='true'
            let update_user_otpstatus="UPDATE `users` SET `otp_status`='"+otp_status+"' WHERE email='"+data.email+"'"
            let check_update_user_otpstatus=await queryDb(update_user_otpstatus)
            if(!check_update_user_otpstatus.affectedRows>0){
                res.send(
                    {
                        status:myconstants.error_code,
                        message:"Unable to update otp_status"
                    }
                )
            }else{
                res.send(
                    {
                        status:myconstants.success_code,
                        message:"Successfully verified user"
                    }
                )
            }
        }
      }
    }catch(err){
        res.send(
            {
                status:myconstants.error_code,
                message:err.message
            }
        )
    }
}

exports.user_signIn=async(req,res)=>{
    try{
      let data=req.body;
      let user="SELECT * FROM `users` WHERE email='"+data.email+"'"
      let check_user=await queryDb(user)
      if(!check_user.length>0){
        res.send(
            {
                status:myconstants.success_code,
                message:"user do not exist with this email id"
            }
        )
      }else{
        if(check_user[0].otp_status!="true"){
            res.send(
                {
                    status:myconstants.error_code,
                    message:"First verify user before login"
                }
            )
        }else{
            let comparedPassword= await bcrypt.compare(data.password,check_user[0].password)
            console.log("compared password is-=-=-=",comparedPassword)
            if(comparedPassword==true){
                let token=jwt.sign(
                    {
                        userId:check_user[0].id
                    },
                    secretkey,
                    {
                        expiresIn:"30d"
                    }
                )
                if(!token){
                    res.send(
                        {
                            status:myconstants.success_code,
                            message:"unable to generate the token"
                        }
                    )
                }else{
                    let id=check_user[0].id
                    let update_token="UPDATE `users` SET `jwt_token`='"+token+"' WHERE id='"+id+"'"
                    let check_update_user=await queryDb(update_token)
                    if(!check_update_user.affectedRows>0){
                        res.send(
                            {
                                status:myconstants.error_code,
                                message:"unable to update token into user"
                            }
                        )
                    }else{
                        res.send(
                            {
                                status:myconstants.success_code,
                                message:"successfully user signed_in"
                            }
                        )
                    }
                }
            }else{
                res.send(
                    {
                        status:myconstants.error_code,
                        message:"Password did not match"
                    }
                )
            }
        }
      }
    }catch(err){
        res.send(
            {
                status:myconstants.error_code,
                message:err.message
            }
        )
    }
}

exports.change_password=async(req,res)=>{
    try{
        let email=req.body.email
       let old_password=req.body.old_password
       let new_password=req.body.new_password
       let confirm_password=req.body.confirm_password
       let get_user="SELECT * FROM `users` WHERE email='"+email+"'"
       let check_get_user=await queryDb(get_user)
       if(!check_get_user.length>0){
        res.send(
            {
                status:myconstants.success_code,
                message:"did not find data with this email id"
            }
        )
       }else{
         if((await bcrypt.compare(old_password,check_get_user[0].password))==false){
                res.send(
                    {
                        status:myconstants.error_code,
                        message:"Old password did not match"
                    }
                )
            
        }else{
            if(new_password!=confirm_password){
                res.send(
                    {
                        status:myconstants.error_code,
                        message:"New password and confirm password are not same"
                    }
                )
            }else{
                let hash=bcrypt.hashSync(new_password,10)
                new_password=hash
                let update_password="UPDATE `users` SET `password`='"+new_password+"' WHERE email='"+email+"'"
                let check_update_password=await queryDb(update_password)
                if(!check_update_password.affectedRows>0){
                    res.send(
                        {
                            status:myconstants.error_code,
                            message:"Unable to set password to new password"
                        }
                    )
                }else{
                    res.send(
                        {
                            status:myconstants.success_code,
                            message:"Successfully updated password to new password"
                        }
                    )
                }
            }
    }
       }
    }catch(err){
        res.send(
            {
                status:myconstants.error_code,
                message:err.message
            }
        )
    }
}

exports.get_all_users=async(req,res)=>{
    try{
       let LIMIT=req.body.limit
       let curent_page=req.body.current_page
       OFFSET=(curent_page-1)*LIMIT
       let status='active'
       let count_data="select * FROM `users`"
       let check_count_data=await queryDb(count_data)
       let count=check_count_data.length
       let get_user_data="SELECT * FROM `users` WHERE status='"+status+"' LIMIT "+LIMIT+" OFFSET "+OFFSET+"" 
       let check_get_user_data=await queryDb(get_user_data)
       if(!check_get_user_data.length>0){
        res.send(
            {
                status:myconstants.error_code,
                message:"data not found"
            }
        )
       }else{
        res.send(
            {
                status:myconstants.success_code,
                message:"Successfully accessed users data",
                count:count,
                result:check_get_user_data

            }
        )
       }
    }catch(err){
        res.send(
            {
                status:myconstants.error_code,
                message:err.message
            }
        )
    }
}


