import express from 'express';
import { User, Notice, Corp, initializeDatabase } from './db.js';
import { QueryTypes } from 'sequelize';
import con from './mysql.js';


// express
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));


// 데이터베이스 초기화(임의의 데이터 값을 한 번만 넣도록 조치)
initializeDatabase().then(()=>{
    console.log('Database initialized');
})


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
app.get('/list', async (req, res) =>{
    try {
        const notices = await Notice.findAll({
            attributes: ['notice_id', 'position', 'award', 'skill'],
            include: {
                model: Corp,
                attributes: ['name', 'country', 'area']
            }
        });
        
        // 결과값 예시와 같이 변환
        const noticeList = notices.map(item => {
            return {
                notice_id: item.notice_id,
                name: item.Corp.name,
                country: item.Corp.country,
                area: item.Corp.area,
                position: item.position,
                award: item.award,
                skill: item.skill
            };
        });

        res.status(200).send({
            success: true,
            message: '공고 목록을 조회합니다.',
            data: noticeList,
        });

    } catch (err) {
        console.error('Error: ', err);
        res.status(500).send('Internal Server Error');
    }

});

// 4-2. 채용공고 검색
app.get('/search/:key', async (req, res) =>{
    const { key } = req.params;  // 검색 키
    const query = `
        SELECT n.notice_id, c.name, c.country, c.area, n.position, n.award, n.skill 
        FROM Notices n
        INNER JOIN Corps c ON n.CorpCorpId = c.corp_id
        WHERE n.skill LIKE ? OR c.name LIKE ?
        `;
    const replacements = [`%${key}%`, `%${key}%`]   // '%'를 사용해 부분 일치 적용
    con.query(query, replacements, (error, results) => {
        if (error) {
            console.error('Error: ', error);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).send({
            success: true,
            message: '검색 결과를 조회합니다.',
            data: results,
        });
    });
});

// 5. 채용상세 페이지


// 6. 채용공고에 지원


app.listen(port, ()=>{
    console.log(`Example app listening on ${port}`);
});