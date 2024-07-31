import Corp from './corp.js';
import User from './user.js';
import Notice from './notice.js';

// 릴레이션
// 회사 : 채용공고 = 일대다
Corp.hasMany(Notice);
Notice.belongsTo(Corp);

//  채용공고 : 사용자 = 일대다
Notice.hasMany(User);
User.belongsTo(Notice);

// 스키마 동기화(스키마가 이미 존재하는 경우 무시)
const syncModels = async () => {
    await Corp.sync();
    await User.sync();
    await Notice.sync();
};
console.log('All models were synchronized successfully.');

export { Corp, User, Notice, syncModels };