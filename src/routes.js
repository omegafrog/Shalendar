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
router.get('/calendar/:id', require('./calendar/controller').findById);
// search by user id
router.get('/calendar', require('./calendar/controller').findByUserId);


// todo api
// create
router.post('/calendar/:id/todo', require('./todo/controller').create);
// find by todo id using params
router.get('/todo/:id', require('./todo/controller').find);
router.get('/calendar/:id/todo', require('./todo/controller').findByCalendarId);
// need login
router.get('/users/todo', require('./todo/controller').findByUserId);

// delete todo by querystring
router.delete('/todo/:id', require('./todo/controller').delete);
// update
router.put('/todo/:id', require('./todo/controller').update);
// Change TODO completion check
router.get('/api/todo/:id', require('./todo/controller').checkComplete);


module.exports=router;
