import express from 'express';
import { 
    postNotice, 
    editNotice, 
    deleteNotice, 
    list, 
    search, 
    noticeDetail, 
    apply } 
from '../controllers/controllers.js';

const router = express.Router();

router.post('/post/:corp_id', postNotice);                       // 1. 채용공고 등록
router.put('/edit/:notice_id', editNotice);             // 2. 채용공고 수정
router.delete('delete/:notice_id', deleteNotice);       // 3. 채용공고 삭제
router.get('/list', list);                              // 4. 채용공고 목록 조회
router.get('/search/:key', search);                     // 4-2. 채용공고 검색
router.get('/noticeDetail/:notice_id', noticeDetail);   // 5. 채용상세 페이지
router.put('/apply/:notice_id/:user_id', apply);        // 6. 채용공고에 지원

export default router;