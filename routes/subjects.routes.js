const Router = require('express')
const router = new Router()
const subjectsController = require('../controller/subjects.controller')



//post
router.post('/createSubject', subjectsController.createSubject)
router.post('/getSubjects', subjectsController.getSubjects)
router.post('/getSubjectById', subjectsController.getSubjectById)
//put
router.put('/updateSubject', subjectsController.updateSubject)

//delete
router.delete('/deleteSubject',subjectsController.deleteSubject)


module.exports = router