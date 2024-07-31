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

describe('Controllers tests', () => {
    let createStub;

    beforeEach(()=>{
        createStub = sinon.stub(Notice, 'create');
    });

    afterEach(()=>{
        createStub.restore();
    });

    describe('postNotice', () =>{
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
});