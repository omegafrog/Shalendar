const Koa = require('koa');
const app = new Koa();
const Router= require('@koa/router');
const router = new Router();

const port = process.env.PORT || 3000;

app.use(router.routes());
app.use(router.allowedMethods);

app.listen(port, ()=>{
    console.log(`Running web server ... ${port}`);
})