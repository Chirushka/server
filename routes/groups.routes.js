const Router = require('express')
const router = new Router()
const groupController = require('../controller/groups.controller')



//post
router.post('/createGroup', groupController.createGroup)
router.post('/getGroups', groupController.getGroups)


//put
router.put('/updateGroup',groupController.updateGroup)

//delete
router.delete('/group/deleteGroup', groupController.deleteGroup);


module.exports = router