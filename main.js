import express from 'express';
import { User, Notice, Corp } from './db.js';

// express
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));



// RESTful API

// 1. 채용공고 등록
app.post('/post', async (req, res) =>{
    try {
        const { corp_id, position, award, description, skill } = req.body;
        const postNotice = await Notice.create({
            position: position,
            award: award,
            description: description,
            skill: skill,
            CorpCorpId: corp_id
        }) 

        res.status(201).send({
            success: true,
            message: '공고가 등록되었습니다.',
            data: postNotice,
        });

    } catch (err) {
        console.error('Error: ', err);
        res.status(500).send('Internal Server Error');
    }

});

// 2. 채용공고 수정
app.put('/edit/:notice_id', async (req, res) =>{
    try {
        const { notice_id } = req.params;
        const { position, award, description, skill } = req.body;
        const editNotice = await Notice.update({
            position: position,
            award: award,
            description: description,
            skill: skill
            },
            {
                where: { notice_id: notice_id }
            }
        );

        res.status(201).send({
            success: true,
            message: '공고가 수정되었습니다.',
            data: editNotice,
        });

    } catch (err) {
        console.error('Error: ', err);
        res.status(500).send('Internal Server Error');
    }

});

// 3. 채용공고 삭제
app.delete('/delete/:notice_id', async (req, res) =>{
    try {
        const { notice_id } = req.params;
        const deleteNotice = await Notice.destroy({
            where: { notice_id: notice_id }
        });

        res.status(200).send({
            success: true,
            message: '공고가 삭제되었습니다.',
            data: deleteNotice,
        });

    } catch (err) {
        console.error('Error: ', err);
        res.status(500).send('Internal Server Error');
    }

});

// 4. 채용공고 목록 조회

// 4-2. 채용공고 검색

// 5. 채용상세 페이지

// 6. 채용공고에 지원


app.listen(port, ()=>{
    console.log(`Example app listening on ${port}`);
});