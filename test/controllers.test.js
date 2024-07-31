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
import { Notice, Corp, User } from '../models/index.js';

// 단위 테스트(unit test)

describe('Controllers tests-----', () => {
    let createStub, updateStub, destroyStub, findAllStub;

    beforeEach(()=>{
        createStub = sinon.stub(Notice, 'create');
        updateStub = sinon.stub(Notice, 'update');
        destroyStub = sinon.stub(Notice, 'destroy');
        findAllStub = sinon.stub(Notice, 'findAll');
    });

    afterEach(()=>{
        createStub.restore();
        updateStub.restore();
        destroyStub.restore();
        findAllStub.restore();
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
});