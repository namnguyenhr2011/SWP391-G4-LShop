let express = require('express');
let router = express.Router();

const controller = require('../../controllers/client/feedback.controller');
const authorization = require('../../../middleware/user.middleware');


router.post('/addFeedback', authorization.Authorization, controller.addFeedback);
router.get('/getFeedback/:productId', controller.getFeedback);

module.exports = router;