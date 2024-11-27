const Router = require('express')
const router = new Router()
const timetableController = require('../controller/timetable.controller')



//post
router.post('/createTimetable', timetableController.createTimetable)
router.post('/getTimetable', timetableController.getTimetable)
router.post('/getTimetableByGroup',timetableController.getTimetableByGroup)
router.post('/getTimetableByTeacher', timetableController.getTimetableByTeacher)
router.post('/getTimetableByPlace', timetableController.getTimetableByPlace)
//put
router.put('/updateTimetable',timetableController.updateTimetable)
//delete
router.delete('/deleteTimetable',timetableController.deleteTimetable)


module.exports = router