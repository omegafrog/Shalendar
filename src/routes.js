const Router = require('@koa/router');
const router = new Router();

// user api 
// login
router.post('/users/login', require('./user/controller').login);
// signOut
router.delete('/users', require('./user/controller').signOut);
// register
router.post('/users/register', require('./user/controller').register);

module.exports=router;
