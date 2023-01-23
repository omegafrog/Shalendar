const Router = require('@koa/router');
const router = new Router();
const {login} = require('./auth/jwt');

router.use( async (ctx, next) => {
    console.log( `URL : ${ctx.request.url}`);
    return next();
});

router.get('/', (ctx)=>{ctx.body={result:"ok"}})
// user api 
// login
router.post('/users/login', require('./user/controller').login);
// signOut
router.delete('/users', login, require('./user/controller').signOut);
// register
router.post('/users/register', require('./user/controller').register);

// calendar api
// create
router.post('/calendar', login, require('./calendar/controller').create);
// search by calendar id
router.get('/calendar/:id', login, require('./calendar/controller').findById);
// search by user id
router.get('/calendar', login, require('./calendar/controller').findByUserId);
// delete
router.delete('/calendar/:id', login, require('./calendar/controller').delete);


// todo api
// create
router.post('/calendar/:id/todo',login, require('./todo/controller').create);
// find by todo id using params
router.get('/todo/:id', login, require('./todo/controller').find);
router.get('/calendar/:id/todo', login, require('./todo/controller').findByCalendarId);
// need login
router.get('/users/todo', login, require('./todo/controller').findByUserId);

// delete todo by querystring
router.delete('/todo/:id', login,  require('./todo/controller').delete);
// update
router.put('/todo/:id', login, require('./todo/controller').update);
// Change TODO completion check
router.get('/api/todo/:id', login, require('./todo/controller').checkComplete);


// make calendar share key
router.get ('/api/calendar/:id/share-key', login, require('./api/controller').makeShareKey);
// process share key
router.post('/api/calendar/process-key',login, require('./api/controller').processShareKey);
// unshare user
router.get ('/api/calendar/:id/unshare' ,login, require('./api/controller').unshareUser);

module.exports=router;
