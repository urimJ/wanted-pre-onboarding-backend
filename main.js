import express from 'express';
import { User, Notice, Corp } from './db.js'
import con from './mysql.js';
import { QueryTypes } from 'sequelize';

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
app.get('/noticeDetail/:notice_id', async (req, res) =>{
    try {
        const { notice_id } = req.params;
        const noticeDetail = await Notice.findOne({
            attributes: ['notice_id', 'position', 'award', 'skill', 'description'],
            include: {
                model: Corp,
                attributes: ['name', 'country', 'area']
            },
            where: {
                notice_id: notice_id,   // 해당 채용공고의 회사 이름
            },
        });

        if (!noticeDetail) {
            return res.status(404).send({
                success: false,
                message: '공고를 찾을 수 없습니다.',
            });
        }
        //console.log('noticeDetail:', noticeDetail);

        // 해당 회사의 모든 공고
        const query = `
            SELECT n.notice_id from Notices n
            INNER JOIN Corps c ON c.corp_id = n.CorpCorpId
            WHERE c.name = ?                        
        `;
        const replacements = [noticeDetail.Corp.name];   // 해당 채용 공고의 회사 이름으로 찾기
        con.query(query, replacements, (error, results) => {
            if (error) {
                console.error('Error: ', error);
                return res.status(500).send('Internal Server Error');
            }

            //console.log('results: ', results);

            // 해당 회사의 현재 공고를 제외한 나머지 공고 목록
            const arrAllNotices = results.map(item=>item.notice_id);
            const numberNoticeId = parseInt(notice_id);   // notice_id가 문자열이므로 정수로 변환
            const arrOtherNotices = arrAllNotices.filter(item => item !== numberNoticeId);

            //console.log('type of notice_id:', typeof notice_id);
            
            // 결과값 예시와 같이 변환
            const detail = {
                notice_id: noticeDetail.notice_id,
                name: noticeDetail.Corp.name,
                country: noticeDetail.Corp.country,
                area: noticeDetail.Corp.area,
                position: noticeDetail.position,
                award: noticeDetail.award,
                skill: noticeDetail.skill,
                description: noticeDetail.description,
                otherNotices: arrOtherNotices,
            };

            res.status(200).send({
                success: true,
                message: '검색 결과를 조회합니다.',
                data: detail,
            });
        });

    } catch (err) {
        console.error('Error: ', err);
        res.status(500).send('Internal Server Error');
    }
});


// 6. 채용공고에 지원


app.listen(port, ()=>{
    console.log(`Example app listening on ${port}`);
});