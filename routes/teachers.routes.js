const Router = require('express')
const router = new Router()
const teacherController = require('../controller/teacher.controller')



router.post('/createTeacher', teacherController.createTeacher)
router.post('/getTeacher', teacherController.getTeacher)

//delete
router.delete('/deleteTeacher',teacherController.deleteTeacher)


module.exports = router