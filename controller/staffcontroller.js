const mysql=require('mysql')
const myconstants=require('../myconstants')


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

  exports.add_staff=async(req,res)=>{
    try{
       let data=req.body;
       let get_staff="SELECT * FROM `staff` WHERE email='"+data.email+"'"
       let check_get_staff=await queryDb(get_staff)
       if(check_get_staff.length>0){
        res.send(
            {
                status:myconstants.error_code,
                message:"Staff with this user-email already exist"
            }
        )
       }else{
        let add_staff="INSERT INTO `staff`( `first_name`, `last_name`, `user_name`, `email`, `role`, `university_id`) VALUES ('"+data.first_name+"','"+data.last_name+"','"+data.user_name+"','"+data.email+"','"+data.role+"','"+data.university_id+"')"
        let check_add_staff=await queryDb(add_staff)
        if(check_add_staff.length=0){
            res.send(
                {
                    status:myconstants.error_code,
                    message:"Unable to insert the user-staff"
                }
            )
        }else{
            res.send(
                {
                    status:myconstants.success_code,
                    message:"Successfully inserted the user"
                }
            )
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

  exports.get_staff_by_id=async(req,res)=>{
    try{
      let data=req.params
      let get_staff="SELECT * FROM `staff` WHERE id='"+req.params.id+"'"
      let check_get_staff=await queryDb(get_staff)
      console.log("my staff is=-=-=",check_get_staff)
      if(!check_get_staff.length>0){
        res.send(
            {
                status:myconstants.error_code,
                message:"Unable to get data with this id"
            }
        )
      }else{
        res.send(
            {
                status:myconstants.success_code,
                message:"Successfully accessed the data",
                result:check_get_staff
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

  exports.delete_staff=async(req,res)=>{
    try{
        
       let data=req.params;
       let status='inactive'
       let get_data="SELECT * FROM `staff` WHERE id='"+data.id+"'"
       let check_get_data=await queryDb(get_data)
       if(!check_get_data.length>0){
        res.send(
            {
                status:myconstants.error_code,
                message:"Staff with this id do not exist"
            }
        )
       }else{
        let delete_staff="UPDATE `staff` SET `status`='"+status+"' WHERE id='"+data.id+"'"
        let check_delete_staff=await queryDb(delete_staff)
        if(!check_delete_staff.affectedRows>0){
            res.send(
                {
                    status:myconstants.error_code,
                    message:"Unable to delete the staff"
                }
            )
        }else{
            res.send(
                {
                    status:myconstants.success_code,
                    message:"Successfully deleted the staff"
                }
            )
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

  exports.get_All_staff=async(req,res)=>{
    try{
      let data=req.body;
      let status='active'
      let get_staff_data="SELECT * FROM `university` WHERE status='"+status+"'"
      let check_get_staff_data=await queryDb(get_staff_data)
      if(!check_get_staff_data.length>0){
        res.send(
            {
                status:myconstants.error_code,
                message:"Data not found"
            }
        )
      }else{
        res.send(
            {
                status:myconstants.success_code,
                message:"successfully accessed the staff data",
                result:check_get_staff_data
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
