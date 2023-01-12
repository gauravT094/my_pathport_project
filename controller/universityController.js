const mysql=require('mysql')
const multer=require('multer')
const path=require('path')
const myconstants=require('../myconstants')
const { count } = require('console')


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
        cb(null, path.join(__dirname,"../university_images/university"))
    },
    filename: function (req, file, cb) {
        console.log('file data +++++++++++++++++++++++++',file)
        cb(null, file.fieldname + '-' +Date.now()+path.extname(file.originalname) )
    }
})
var store = multer({ storage: storage }).single('university_logo')

exports.add_university=async(req,res)=>{
    try{
    store(req,res,async(err)=>{
        if(err) throw err;
        let data=req.body;
        let getUniversity_email="SELECT * FROM `university` WHERE email='"+data.email+"'"
        let check_university_email=await queryDb(getUniversity_email)
        if(check_university_email.length>0){
            res.send(
                {
                    status:myconstants.error_code,
                    message:"university with this email address already exist"
                }
            )
        }else{
            let file=req.file
            let myfile=file.filename
            if(myfile){
                let insert_universityData="INSERT INTO `university`(`university_name`, `email`, `contact`, `alt_contact`, `university_description`, `university_address`, `university_slogan`, `university_logo`) VALUES ('"+data.university_name+"','"+data.email+"','"+data.contact+"','"+data.alt_contact+"','"+data.university_description+"','"+data.university_address+"','"+data.university_slogan+"','"+myfile+"')"
                let check_universityData=await queryDb(insert_universityData)
                if(!check_universityData){
                    res.send({
                        status:myconstants.error_code,
                        message:"Unable to add university data"
                    })
                }
                else{
                    res.send(
                        {
                            status:myconstants.success_code,
                            message:"Successfully added university data"
                        }
                    )
                }
            }else{
                res.send(
                    {
                        status:myconstants.error_code,
                        message:"Unable to get file"
                    }
                )
            }
        }
    })
}catch(err){
    res.send(
        {
            status:myconstants.error_code,
            message:err.message
        }
    )
}
}

exports.get_university_data=async(req,res)=>{
    try{
       let data=req.params
       let get_university="SELECT * FROM `university` WHERE id='"+req.params.id+"'"
       let check_get_university=await queryDb(get_university)
       if(!check_get_university.length>0){
        res.send(
            {
                status:myconstants.error_code,
                message:"Unable to get university data"
            }
        )
       }else{
        res.send(
        {
            status:myconstants.success_code,
            message:"Successfully accessed the university data",
            university:check_get_university
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

exports.update_university=async(req,res)=>{
    try{
        store(req,res,async(err)=>{
            if(err) throw err;
            let data=req.body;
               //console.log("my data is=-=-=-=",req.body)
               let get_data="SELECT * FROM `university` WHERE id='"+data.id+"'"
               let check_getData=await queryDb(get_data)
               console.log("check all data===",check_getData)
               if(!check_getData.length>0){
                res.send(
                    {
                        status:myconstants.error_code,
                        message:"Unable to get data with this id"
                    }
                )}else{
    //    if(err) throw err;
       if(req.file){
        let file=req.file;
        let myfile=file.filename 
        let update_university="UPDATE `university` SET `university_name`='"+data.university_name+"',`email`='"+data.email+"',`contact`='"+data.contact+"',`alt_contact`='"+data.alt_contact+"',`university_description`='"+data.university_description+"',`university_address`='"+data.university_address+"',`university_slogan`='"+data.university_slogan+"',`university_logo`='"+myfile+"' WHERE id='"+data.id+"'"
        let check_updateuniversity=await queryDb(update_university)
        if(!check_updateuniversity.affectedRows){
            res.send(
                {
                    status:myconstants.error_code,
                    message:"Unable to update university"
                }
            )
        }
        else{
            res.send(
                {
                    status:myconstants.success_code,
                    message:"Successfully updated university with file"
                }
            )
        }
       }else{
        let update_university="UPDATE `university` SET `university_name`='"+data.university_name+"',`email`='"+data.email+"',`contact`='"+data.contact+"',`alt_contact`='"+data.alt_contact+"',`university_description`='"+data.university_description+"',`university_address`='"+data.university_address+"',`university_slogan`='"+data.university_slogan+"' WHERE id='"+data.id+"'"
        let check_update_university=await queryDb(update_university)
        if(!check_update_university.affectedRows>0){
            res.send(
                {
                    status:myconstants.error_code,
                    message:"Unable to update university......"
                }
            )
        }else{
            res.send(
                {
                    status:myconstants.success_code,
                    message:"Successfully updated university info"
                }
            )
        }
       }
    }

        }
        )
    //     let file=req.file;
    //    let myfile=file.filename
       
    }catch(err){
        res.send(
            {
                status:myconstants.error_code,
                message:err.message 
            }
        )
    }
}

exports.get_all_university=async(req,res)=>{
    try{
        let current_page=req.body.page
        let LIMIT=req.body.limit
        let OFFSET = (current_page - 1) * LIMIT;
        let status='Active'
        let getData_count="SELECT * FROM `university` WHERE `status`='"+status+"'"
        let check_getData_count=await queryDb(getData_count)
        let count=check_getData_count.length;

      let getData="SELECT * FROM `university` WHERE `status`='"+status+"' LIMIT "+LIMIT+" OFFSET "+OFFSET+""
      let check_getData=await queryDb(getData)
      if(!check_getData.length>0){
        res.send(
            {
                status:myconstants.error_code,
                message:"Unable to get data"
                
            }
        )
      }
      else{
        res.send(
            {
                status:myconstants.success_code,
                message:"Successfully accessed all universities data",
                count:count,
                result:check_getData
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

exports.delete_university=async(req,res)=>{
    try{
     let data=req.params;
     let get_University ="SELECT * FROM `university` WHERE id='"+req.params.id+"'"
     let check_get_University=await queryDb(get_University)
     if(!check_get_University.length>0){
        res.send(
            {
                status:myconstants.error_code,
                message:"Unable to get university with this id"
            }
        )
     }else{
        let status="in_Active"
        let deleteUniversity="UPDATE `university` SET `status`='"+status+"' WHERE id='"+check_get_University[0].id+"'"
        let check_deleteUniversity=await queryDb(deleteUniversity)
        if(!check_deleteUniversity.affectedRows>0){
            res.send(
                {
                    status:myconstants.error_code,
                    message:"Unable to delete the university"
                }
            )
        }else{
            res.send(
                {
                    status:myconstants.success_code,
                    message:"Successfully deleted the university"
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

exports.search_university=async(req,res)=>{
    try{
        let name=req.body.name
        let current_page=req.body.page
        let LIMIT=req.body.limit
        let OFFSET = (current_page - 1) * LIMIT;
        let get_count="SELECT * FROM `university` WHERE university_name LIKE '"+name+"%' OR email LIKE '"+name+"%' OR contact LIKE '"+name+"%'"
        let count_searched_data=await queryDb(get_count)
        let count=count_searched_data.length;
       let searched_data="SELECT * FROM `university` WHERE university_name LIKE '"+name+"%' OR email LIKE '"+name+"%' OR contact LIKE '"+name+"%' LIMIT "+LIMIT+" OFFSET "+OFFSET+""
       let check_searched_data=await queryDb(searched_data)
       if(!check_searched_data.length>0){
        res.send(
            {
                status:myconstants.error_code,
                message:"Unable to get the university data"
            }
        )
       }else{
        res.send(
            {
                status:myconstants.success_code,
                message:"Successfully accessed the spescific university data",
                count:count,
                result:check_searched_data
            }
        )
       }
    }
    catch(err){
        res.send(
            {
                status:myconstants.error_code,
                message:err.message
            }
        )
    }
}


exports.get_university_staff=async(req,res)=>{
    try{
       let data=req.body;
       let status='active'
       let get_staff="SELECT * FROM `staff` WHERE university_id='"+data.university_id+"' && status='"+status+"'"
       let check_get_staff=await queryDb(get_staff)
       if(!check_get_staff.length>0){
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
                message:"successfully accessed the staff from spescific university",
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