const Router = require('express')
const router = new Router()
const studentsController = require('../controller/students.controller')



router.post('/createStudent', studentsController.createStudent)
router.post('/getStudent', studentsController.getStudent)

//put
router.put('/setStudentToken',studentsController.setStudentToken)
router.put('/setStudentGrp', studentsController.setStudentGrp)

//delete
router.delete('/deleteStudent',studentsController.deleteStudent)


module.exports = router