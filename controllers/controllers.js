import { Notice, Corp, User } from '../models/index.js';
import con from '../config/mysql.js'


// 1. 채용공고 등록
export const postNotice = async (req, res) => {
    try {
        const { corp_id } = req.params;
        const { position, award, description, skill } = req.body;

        // 필수 필드 유효성 검사
        if (!position || !award || !description || !skill) {
            return res.status(400).send('Bad Request: Missing required fields');
        }

        const postNotice = await Notice.create({
            position,
            award,
            description,
            skill,
            CorpCorpId: corp_id,
        });

        res.status(201).send({
            success: true,
            message: '공고가 등록되었습니다.',
            data: postNotice,
        });
    } catch (err) {
        console.error('Error: ', err);
        res.status(500).send('Internal Server Error');
    }
};

// 2. 채용공고 수정
export const editNotice = async (req, res) => {
    try {
        const { notice_id } = req.params;
        const { position, award, description, skill } = req.body;
        const editNotice = await Notice.update(
            {
                position,
                award,
                description,
                skill,
            },
            {
                where: { notice_id },
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
}

// 3. 채용공고 삭제
export const deleteNotice = async (req, res) => {
    try {
        const { notice_id } = req.params;
        const deleteNotice = await Notice.destroy({
            where: { notice_id },
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
};

// 4. 채용공고 목록 조회
export const list = async (req, res) => {
    try {
        const notices = await Notice.findAll({
            attributes: ['notice_id', 'position', 'award', 'skill'],
            include: {
                model: Corp,
                attributes: ['name', 'country', 'area'],
            },
        });

        const noticeList = notices.map((item) => {
            return {
                notice_id: item.notice_id,
                name: item.Corp.name,
                country: item.Corp.country,
                area: item.Corp.area,
                position: item.position,
                award: item.award,
                skill: item.skill,
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
};

// 4-2. 채용공고 검색
export const search = (req, res) => {
    const { key } = req.params;
    const query = `
        SELECT n.notice_id, c.name, c.country, c.area, n.position, n.award, n.skill 
        FROM Notices n
        INNER JOIN Corps c ON n.CorpCorpId = c.corp_id
        WHERE n.skill LIKE ? OR c.name LIKE ?
    `;
    const replacements = [`%${key}%`, `%${key}%`];
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
};

// 5. 채용상세 페이지
export const noticeDetail = async (req, res) => {
    try {
        const { notice_id } = req.params;
        const noticeDetail = await Notice.findOne({
            attributes: ['notice_id', 'position', 'award', 'skill', 'description'],
            include: {
                model: Corp,
                attributes: ['name', 'country', 'area'],
            },
            where: { notice_id },
        });

        if (!noticeDetail) {
            return res.status(404).send({
                success: false,
                message: '공고를 찾을 수 없습니다.',
            });
        }

        const query = `
            SELECT n.notice_id FROM Notices n
            INNER JOIN Corps c ON c.corp_id = n.CorpCorpId
            WHERE c.name = ?
        `;
        const replacements = [noticeDetail.Corp.name];
        con.query(query, replacements, (error, results) => {
            if (error) {
                console.error('Error: ', error);
                return res.status(500).send('Internal Server Error');
            }

            const arrAllNotices = results.map((item) => item.notice_id);
            const numberNoticeId = parseInt(notice_id, 10);
            const arrOtherNotices = arrAllNotices.filter((item) => item !== numberNoticeId);

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
};

// 6. 채용공고에 지원
export const apply = async (req, res) => {
    try {
        const { notice_id, user_id } = req.params;

        const user = await User.findOne({ where: { user_id } });
        // 사용자는 1회만 지원 가능
        if (user.NoticeNoticeId === null) {
            await User.update(
                { NoticeNoticeId: notice_id },
                { where: { user_id } }
            );

            const appliedUser = await User.findOne({
                attributes: ['NoticeNoticeId', 'user_id'],
                where: { user_id },
            });

            res.status(201).send({
                success: true,
                message: '해당 공고에 지원되었습니다.',
                data: appliedUser,
            });
        } else {
            res.status(409).send({
                success: false,
                message: '이미 지원한 사용자입니다.',
            });
        }
    } catch (err) {
        console.error('Error: ', err);
        res.status(500).send('Internal Server Error');
    }
};
