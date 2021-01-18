//require('dotenv').config();
import dotenv from 'dotenv';
import Koa from "koa";
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
//기존에 있던 index.js에 api index.js를 불러옴
//const api = require('./api');
import api from './api/index.js';
//가짜 데이터 생성용 
//import createFakeData from './createFakeData.js';
import jwtMiddleware from './lib/jwtMiddleware.js';

//import RealbodyParser  from 'body-parser';

// koa-static으로 정적파일 제공 27.4.2
import serve from 'koa-static';
import path from 'path';
import send from 'koa-send';

dotenv.config()

// 비구조화 할당을 통해 process.env 내부 값에 대한 레퍼런스 만들기
const { PORT, MONGO_URI } = process.env;

const MAX_BODY = '1000mb';

mongoose
.connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    console.log('Connected to MongoDB');
    //가짜 데이터 생성용 
    //createFakeData();
  })
  .catch(e => {
    console.error(e);
});

const app = new Koa();
const router = new Router();

//기존에 있던 index.js에 api index.js를 불러옴
router.use('/api', api.routes());

//라우터 설정
router.get('/', ctx => {
    ctx.body = 'home';
});

// url 파라미터
// 경로 : about/name 으로 들어가면 이름 나옴
router.get('/about/:name?', ctx => {
    const  { name } = ctx.params;
    ctx.body = name ? `${name}의 소개` : '소개';
});

// url 쿼리
// ex) /post?id=kyu => 포스트 #kyu
router.get('/posts', ctx => {
    const  { id } = ctx.query;
    ctx.body = id ? `포스트 #${id}` : '포스트 아이디가 없음';
});

app.use(jwtMiddleware);
app.use(bodyParser(
  {
    multipart: true,
    json: true,
    jsonLimit: MAX_BODY,
    formLimit: MAX_BODY,
    textLimit: MAX_BODY,
    formidable: {
        maxFileSize: MAX_BODY
    }
  }
));

//app 인스턴스에 라우터  적용
app.use(router.routes()).use(router.allowedMethods());

// koa-static으로 정적파일 제공 27.4.2
//const __dirname = path.resolve();
/* 
const buildDirectory = path.resolve('C:/Users/2066a/blog/blog-frontend/build');
app.use(serve(buildDirectory));
app.use(async ctx => {
  // Not Found이고, 주소가 /api로 시작하지 않는 경우
  if(ctx.status === 404 && ctx.path.indexOf('/api') !== 0) {
    //index.html 내용을 반환
    await send(ctx, 'index.html', { root: buildDirectory });
  }
});
 */
const port = PORT || 4000;
app.listen(port, () => {
  console.log('Listening to port %d', port);
});``