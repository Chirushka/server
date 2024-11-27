const Router = require('express')
const router = new Router()
const subjectsController = require('../controller/subjects.controller')



//post
router.post('/createSubject', subjectsController.createSubject)
router.post('/getSubject', subjectsController.getSubject)

//put
router.put('/updateSubject', subjectsController.updateSubject)

//delete
router.delete('/deleteSubject',subjectsController.deleteSubject)


module.exports = router