const Router = require('express')
const router = new Router()
const groupController = require('../controller/group.controller')



//post
router.post('/createGroup', groupController.createGroup)
router.post('/getGroup', groupController.getGroup)

//put
router.put('/updateGroup',groupController.updateGroup)

//delete
router.delete('/deleteGroup',groupController.deleteGroup)


module.exports = router