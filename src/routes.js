const Router = require('@koa/router');
const router = new Router();

// user api 
// login
router.post('/users/login', require('./user/controller').login);
// signOut
router.delete('/users', require('./user/controller').signOut);
// register
router.post('/users/register', require('./user/controller').register);

// calendar api
// create
router.post('/calendar', require('./calendar/controller').create);
// delete
router.delete('/calendar/:id', require('./calendar/controller').delete);
// search by calendar id
router.get('/calendar', require('./calendar/controller').find);
// search by user id


module.exports=router;
