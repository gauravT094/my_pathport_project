var express = require('express');
var router = express.Router();
const universityController=require('../controller/universityController')
const staffcontroller=require('../controller/staffcontroller')
const usercontroller=require('../controller/usercontroller')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/add_university',universityController.add_university)
router.get('/get_university_data/:id',universityController.get_university_data)
router.post('/update_university',universityController.update_university)
router.get('/get_all_university',universityController.get_all_university)
router.delete('/delete_university/:id',universityController.delete_university)
router.post('/search_university',universityController.search_university)
router.post('/get_university_staff',universityController.get_university_staff)

///////////my staff api's////////////

router.post('/add_staff',staffcontroller.add_staff)
router.get('/get_staff_by_id/:id',staffcontroller.get_staff_by_id)
router.delete('/delete_staff/:id',staffcontroller.delete_staff)
router.get('/get_All_staff',staffcontroller.get_All_staff)


///////////user's api"s///////
router.post('/user_signUp',usercontroller.user_signUp)
router.get('/verify_user',usercontroller.verify_user)
router.post('/user_signIn',usercontroller.user_signIn)
router.post('/change_password',usercontroller.change_password)
router.post('/get_all_users',usercontroller.get_all_users)

module.exports = router;
