require('dotenv').config();
const Koa = require('koa');
const app = new Koa();
const Router= require('@koa/router');
const router = new Router();
const bodyParser = require('koa-bodyparser');


const port = process.env.PORT || 3000;

app.use(bodyParser({formLimit:'5mb'}));

app.use(require('./src/routes').routes());
app.use(router.routes());
app.use(router.allowedMethods);

app.listen(port, ()=>{
    console.log(`Running web server ... ${port}`);
})