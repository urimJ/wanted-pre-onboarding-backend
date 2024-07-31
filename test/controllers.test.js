import { expect } from 'chai';
import sinon from 'sinon';
import { 
    postNotice, 
    editNotice, 
    deleteNotice, 
    list, 
    search, 
    noticeDetail, 
    apply } 
from '../controllers/controllers.js';
import con from '../config/mysql.js'
import { Notice, User } from '../models/index.js';

// 단위 테스트(unit test)

describe('Controllers tests-----', () => {
    let createStub, updateStub, destroyStub, findAllStub, findOneStub;
    let findOneStubU, updateStubU;

    beforeEach(()=>{
        createStub = sinon.stub(Notice, 'create');
        updateStub = sinon.stub(Notice, 'update');
        destroyStub = sinon.stub(Notice, 'destroy');
        findAllStub = sinon.stub(Notice, 'findAll');
        findOneStub = sinon.stub(Notice, 'findOne')
        findOneStubU = sinon.stub(User, 'findOne');
        updateStubU = sinon.stub(User, 'update');
    });

    afterEach(()=>{
        createStub.restore();
        updateStub.restore();
        destroyStub.restore();
        findAllStub.restore();
        findOneStub.restore();
        findOneStubU.restore();
        updateStubU.restore();
    });

    describe('---postNotice---', () =>{
        it('should create a notice successfully', async() =>{
            const req = {
                params: { corp_id: 1 },
                body: {
                    position: '주니어 백엔드 개발자',
                    award: '1000000',
                    description: '구글에서 주니어 백엔드 개발자를 모집합니다. 자격 요건은..',
                    skill: 'Javascript'
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
            const newNotice = {
                notice_id: null,
                ...req.body
            };

            createStub.resolves(newNotice);

            await postNotice(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.send.calledWith({
                success: true,
                message: '공고가 등록되었습니다.',
                data: newNotice
            })).to.be.true;
        });

        it('should handle missing required fields', async () => {
            const req = {
                params: { corp_id: 1 },
                body: {
                    position: '주니어 백엔드 개발자',
                    award: '1000000',
                    description: '구글에서 주니어 백엔드 개발자를 모집합니다. 자격 요건은..'
                    // skill 필드 누락
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            await postNotice(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledWith('Bad Request: Missing required fields')).to.be.true;
        });

        it('should handle errors', async()=>{
            const req = {
                params: { corp_id: 1 },
                body: {
                    position: '주니어 백엔드 개발자',
                    award: '1000000',
                    description: '구글에서 주니어 백엔드 개발자를 모집합니다. 자격 요건은..',
                    skill: 'Javascript'
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            createStub.rejects(new Error('Error posting notice'));

            await postNotice(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith('Internal Server Error')).to.be.true;
        });
    });

    describe('---editNotice---', () =>{
        it('should edit a notice successfully', async() =>{
            const req = {
                params: { notice_id: 1 },
                body: {
                    position: '시니어 개발자',
                    description: '구글에서 시니어 개발자를 모집 중입니다. 자격 요건은..'
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
            const updatedNotice = [1]; // Sequelize update returns number of affected rows

            updateStub.resolves(updatedNotice);

            await editNotice(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.send.calledWith({
                success: true,
                message: '공고가 수정되었습니다.',
                data: updatedNotice
            })).to.be.true;
        });

        it('should handle errors', async() =>{
            const req = {
                params: { notice_id: 1 },
                body: {
                    position: '시니어 개발자',
                    description: '구글에서 시니어 개발자를 모집 중입니다. 자격 요건은..'
                }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            updateStub.rejects(new Error('Error updating notice'));

            await editNotice(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith('Internal Server Error')).to.be.true;
        });
    });

    describe('---deleteNotice---', () => {
        it('should delete a notice successfully', async () => {
            const req = {
                params: { notice_id: 1 }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
        
            destroyStub.resolves(1); // Sequelize destroy returns number of affected rows
        
            await deleteNotice(req, res);
        
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledWith({
                success: true,
                message: '공고가 삭제되었습니다.',
                data: 1
            })).to.be.true;
            });
        
            it('should handle errors', async () => {
            const req = {
                params: { notice_id: 1 }
            };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };
        
            destroyStub.rejects(new Error('Error deleting notice'));
        
            await deleteNotice(req, res);
        
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith('Internal Server Error')).to.be.true;
            });
        });

    describe('---list---', () => {
        
        it('should list notices successfully', async () => {
            const notices = [
                {
                    notice_id: 1,
                    position: '주니어 백엔드 개발자',
                    award: 1000000,
                    skill: 'Javascript',
                    Corp: {
                        name: 'Google',
                        country: '미국',
                        area: '캘리포니아, 마운틴 뷰'
                    }
                }
            ];
            findAllStub.resolves(notices);

            const req = {};
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            await list(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledWith({
                success: true,
                message: '공고 목록을 조회합니다.',
                data: [
                    {
                        notice_id: 1,
                        name: 'Google',
                        country: '미국',
                        area: '캘리포니아, 마운틴 뷰',
                        position: '주니어 백엔드 개발자',
                        award: 1000000,
                        skill: 'Javascript'
                    }
                ]
            })).to.be.true;
        });

        it('should handle errors', async () => {
            findAllStub.rejects(new Error('Error fetching notices'));

            const req = {};
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            await list(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith('Internal Server Error')).to.be.true;
        });
    });

    describe('---search---', () => {
        let queryStub;

        beforeEach(()=>{
            queryStub = sinon.stub(con, 'query');
        });

        afterEach(()=>{
            queryStub.restore();
        });

        it('should search notices successfully', async () => {
            const results = [
                {
                    notice_id: 1,
                    name: 'Google',
                    country: '미국',
                    area: '캘리포니아, 마운틴 뷰',
                    position: '주니어 백엔드 개발자',
                    award: 1000000,
                    skill: 'Javascript',
                }
            ];
            queryStub.yields(null, results);

            const req = { params: { key: 'Java' } };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            search(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledWith({
                success: true,
                message: '검색 결과를 조회합니다.',
                data: results
            })).to.be.true;
        });

        it('should handle errors', async () => {
            queryStub.yields(new Error('Error searching notices'));


            const req = { params: { key: 'Java' } };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            search(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith('Internal Server Error')).to.be.true;
        });
    });

    describe('---noticeDetail---', () => {
        let queryStub;

        beforeEach(()=>{
            queryStub = sinon.stub(con, 'query');
        });

        afterEach(()=>{
            queryStub.restore();
        });

        it('should get notice detail successfully', async () => {
            const detail = {
                notice_id: 1,
                position: '주니어 백엔드 개발자',
                award: 1000000,
                skill: 'Javascript',
                description: 'Google에서 주니어 백엔드 개발자를 모집합니다. 자격 요건은..',
                Corp: {
                    name: 'Google',
                    country: '미국',
                    area: '캘리포니아, 마운틴 뷰'
                }
            };
            findOneStub.resolves(detail);

            const results = [{ notice_id: 2 }];
            queryStub.yields(null, results);

            const req = { params: { notice_id: 1 } };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            await noticeDetail(req, res);

            // // 디버깅 출력 추가
            // console.log('Response status:', res.status.getCall(0).args[0]);
            // console.log('Response send:', res.send.getCall(0).args[0]);
            
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.send.calledWith({
                success: true,
                message: '채용공고 상세입니다.',
                data: {
                    notice_id: 1,
                    name: 'Google',
                    country: '미국',
                    area: '캘리포니아, 마운틴 뷰',
                    position: '주니어 백엔드 개발자',
                    award: 1000000,
                    skill: 'Javascript',
                    description: 'Google에서 주니어 백엔드 개발자를 모집합니다. 자격 요건은..',
                    otherNotices: [2]
                }
            })).to.be.true;
        });

        it('should handle not found', async () => {
            findOneStub.resolves(null);

            const req = { params: { notice_id: 10 } };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            await noticeDetail(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.send.calledWith({
                success: false,
                message: '공고를 찾을 수 없습니다.'
            })).to.be.true;
        });

        it('should handle errors', async () => {
            findOneStub.rejects(new Error('Error fetching notice detail'));

            const req = { params: { notice_id: 1 } };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            await noticeDetail(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith('Internal Server Error')).to.be.true;
        });
    });

    describe('---apply---', () => {
        
        it('should apply to a notice successfully', async () => {
            const user = { user_id: 1, NoticeNoticeId: null };
            findOneStubU.resolves(user);

            updateStub.resolves([1]);

            const appliedUser = { user_id: 1, NoticeNoticeId: 1 };
            findOneStubU.onSecondCall().resolves(appliedUser);

            const req = { params: { notice_id: 1, user_id: 1 } };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            await apply(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.send.calledWith({
                success: true,
                message: '해당 공고에 지원되었습니다.',
                data: appliedUser
            })).to.be.true;
        });

        it('should handle already applied user', async () => {
            const user = { user_id: 1, NoticeNoticeId: 1 };
            findOneStubU.resolves(user);

            const req = { params: { notice_id: 1, user_id: 1 } };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            await apply(req, res);

            expect(res.status.calledWith(409)).to.be.true;
            expect(res.send.calledWith({
                success: false,
                message: '이미 지원한 사용자입니다.'
            })).to.be.true;
        });

        it('should handle errors', async () => {
            findOneStubU.rejects(new Error('Error applying to notice'));

            const req = { params: { notice_id: 1, user_id: 1 } };
            const res = {
                status: sinon.stub().returnsThis(),
                send: sinon.stub()
            };

            await apply(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.send.calledWith('Internal Server Error')).to.be.true;
        });
    });
});