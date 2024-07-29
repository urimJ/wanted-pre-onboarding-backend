import express from 'express';
//import cors from 'cors';
//import con from '../mysql';

// express
const app = express();
const port = 3000;

// cors
// const corsOptions = {
//     origin: "http://localhost:3000",
//     credential: true,
// };

//app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// localhost:3000 웹페이지 테스트
const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}

app.get('/', async(req, res)=>{
    let randomNumber = getRandomInt(3);
    res.status(200).send(`randomNumber: ${randomNumber}`);
})

// RESTful API

// 1. 채용공고 등록

// 2. 채용공고 수정

// 3. 채용공고 삭제

// 4. 채용공고 목록 조회

// 4-2. 채용공고 검색

// 5. 채용상세 페이지

// 6. 채용공고에 지원


app.listen(port, ()=>{
    console.log(`Example app listening on ${port}`);
});