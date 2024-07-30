import { Sequelize, Model, DataTypes } from 'sequelize';
import { config } from 'dotenv';
config();

// Sequelize
const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
    }
);

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch(error){
    console.error('Unable to connect to the database:', error);
}

// 모델

// 회사(Corp)
class Corp extends Model {}
Corp.init(
    {
        corp_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        area: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'Corp',
        timestamps: false
    }
);

// 사용자(User)
class User extends Model {}
User.init(
    {
    user_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
        
    }
    ,
    {
        sequelize,
        modelName: 'User',
        timestamps: false
    }
);

// 채용공고(Notice)
class Notice extends Model {}
Notice.init(
    {
        notice_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false
        },
        award: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        skill: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
    ,
    {
        sequelize,
        modelName: 'Notice',
        timestamps: false
    }
)

// // 지원내역(AppStatus) <- 사용자와 채용공고가 N:M 관계가 아니므로 불필요함.
// class AppStatus extends Model {}
// AppStatus.init(
//     {
//         app_id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             autoIncrement: true,
//         },
//         date: {
//             type: DataTypes.DATE,
//             allowNull: false,
//         }
//     }
//     ,
//     {
//         sequelize,
//         modelName: 'AppStatus',
//         timestamps: false
//     }
// )


// 릴레이션

// 회사 : 채용공고 = 일대다
Corp.hasMany(Notice);
Notice.belongsTo(Corp);

// 채용공고 : 사용자 = 일대다
Notice.hasMany(User);
User.belongsTo(Notice);


await sequelize.sync({force: true});
console.log('All models were synchronized successfully.');


// 임의의 데이터

// 사용자(50명)
const users = await User.bulkCreate(
    [
        { name: "김지현" },
        { name: "이지은" },
        { name: "박수진" },
        { name: "김지영" },
        { name: "이지혜" },
        { name: "박혜민" },
        { name: "김다혜" },
        { name: "이민정" },
        { name: "박지수" },
        { name: "김민정" },
        { name: "이은지" },
        { name: "박혜진" },
        { name: "김수현" },
        { name: "이지연" },
        { name: "박유진" },
        { name: "김민서" },
        { name: "이다혜" },
        { name: "박소연" },
        { name: "김나영" },
        { name: "이예진" },
        { name: "박혜은" },
        { name: "김다영" },
        { name: "이수정" },
        { name: "박하은" },
        { name: "김예진" },
        { name: "이혜민" },
        { name: "박지현" },
        { name: "김아영" },
        { name: "이주현" },
        { name: "박세은" },
        { name: "김하은" },
        { name: "이소영" },
        { name: "박채원" },
        { name: "김현정" },
        { name: "이가영" },
        { name: "박다은" },
        { name: "김지민" },
        { name: "이수진" },
        { name: "박연지" },
        { name: "김지은" },
        { name: "이연주" },
        { name: "박지혜" },
        { name: "김소영" },
        { name: "이서현" },
        { name: "박민주" },
        { name: "김지혜" },
        { name: "이현정" },
        { name: "박지연" },
        { name: "김세영" },
        { name: "이수민" }
    ]
);

// 회사(25개)
const corps = await Corp.bulkCreate(
    [
        { name: 'Google', country: '미국', area: '캘리포니아, 마운틴 뷰' },
        { name: 'Microsoft', country: '미국', area: '워싱턴, 레드먼드' },
        { name: 'Apple', country: '미국', area: '캘리포니아, 쿠퍼티노' },
        { name: 'Amazon', country: '미국', area: '워싱턴, 시애틀' },
        { name: 'Facebook (Meta)', country: '미국', area: '캘리포니아, 멘로 파크' },
        { name: 'IBM', country: '미국', area: '뉴욕, 아몬크' },
        { name: 'Oracle', country: '미국', area: '텍사스, 오스틴' },
        { name: 'Intel', country: '미국', area: '캘리포니아, 산타 클라라' },
        { name: 'Cisco', country: '미국', area: '캘리포니아, 산호세' },
        { name: 'SAP', country: '독일', area: '발도르프' },
        { name: 'Dell Technologies', country: '미국', area: '텍사스, 라운드 록' },
        { name: 'Hewlett Packard Enterprise (HPE)', country: '미국', area: '텍사스, 휴스턴' },
        { name: 'Adobe', country: '미국', area: '캘리포니아, 샌호제' },
        { name: 'Salesforce', country: '미국', area: '캘리포니아, 샌프란시스코' },
        { name: 'NVIDIA', country: '미국', area: '캘리포니아, 산타 클라라' },
        { name: 'Tencent', country: '중국', area: '광둥성, 선전' },
        { name: 'Alibaba', country: '중국', area: '저장성, 항저우' },
        { name: 'Sony', country: '일본', area: '도쿄' },
        { name: 'Samsung Electronics', country: '대한민국', area: '경기도, 수원' },
        { name: 'LG Electronics', country: '대한민국', area: '서울' },
        { name: 'Xiaomi', country: '중국', area: '베이징' },
        { name: 'Lenovo', country: '중국', area: '베이징' },
        { name: 'Qualcomm', country: '미국', area: '캘리포니아, 샌디에이고' },
        { name: 'PayPal', country: '미국', area: '캘리포니아, 산호세' },
        { name: 'VMware', country: '미국', area: '캘리포니아, 팔로 알토' }
    ]
);

// 채용공고(30개)
const notices = await Notice.bulkCreate(
    [
        { name: 'Google', position: '프론트엔드 주니어 개발자', award: 1000000, skill: 'Python', description: 'Google에서 프론트엔드 주니어 개발자를 채용합니다. 자격요건은..', CorpCorpId: 1 },
        { name: 'Google', position: '백엔드 시니어 개발자', award: 1200000, skill: 'Java', description: 'Google에서 백엔드 시니어 개발자를 채용합니다. 자격요건은..', CorpCorpId: 1 },
        { name: 'Microsoft', position: '백엔드 주니어 개발자', award: 1100000, skill: 'C++', description: 'Microsoft에서 백엔드 주니어 개발자를 채용합니다. 자격요건은..', CorpCorpId: 2 },
        { name: 'Microsoft', position: '앱 개발자', award: 1300000, skill: 'Java', description: 'Microsoft에서 앱 개발자를 채용합니다. 자격요건은..', CorpCorpId: 2 },
        { name: 'Apple', position: '프론트엔드 시니어 개발자', award: 1500000, skill: 'Javascript', description: 'Apple에서 프론트엔드 시니어 개발자를 채용합니다. 자격요건은..', CorpCorpId: 3 },
        { name: 'Amazon', position: '보안 개발자', award: 1400000, skill: 'Python', description: 'Amazon에서 보안 개발자를 채용합니다. 자격요건은..', CorpCorpId: 4 },
        { name: 'Facebook (Meta)', position: '임베디드 개발자', award: 1300000, skill: 'C', description: 'Facebook (Meta)에서 임베디드 개발자를 채용합니다. 자격요건은..', CorpCorpId: 5 },
        { name: 'IBM', position: '프론트엔드 주니어 개발자', award: 1000000, skill: 'Javascript', description: 'IBM에서 프론트엔드 주니어 개발자를 채용합니다. 자격요건은..', CorpCorpId: 6 },
        { name: 'Oracle', position: '백엔드 시니어 개발자', award: 1200000, skill: 'Java', description: 'Oracle에서 백엔드 시니어 개발자를 채용합니다. 자격요건은..', CorpCorpId: 7 },
        { name: 'Intel', position: '앱 개발자', award: 1100000, skill: 'C++', description: 'Intel에서 앱 개발자를 채용합니다. 자격요건은..', CorpCorpId: 8 },
        { name: 'Cisco', position: '프론트엔드 시니어 개발자', award: 1500000, skill: 'Javascript', description: 'Cisco에서 프론트엔드 시니어 개발자를 채용합니다. 자격요건은..', CorpCorpId: 9 },
        { name: 'SAP', position: '백엔드 주니어 개발자', award: 1000000, skill: 'Python', description: 'SAP에서 백엔드 주니어 개발자를 채용합니다. 자격요건은..', CorpCorpId: 10 },
        { name: 'SAP', position: '프론트엔드 시니어 개발자', award: 1200000, skill: 'Javascript', description: 'SAP에서 프론트엔드 시니어 개발자를 채용합니다. 자격요건은..', CorpCorpId: 10 },
        { name: 'SAP', position: '보안 개발자', award: 1400000, skill: 'Java', description: 'SAP에서 보안 개발자를 채용합니다. 자격요건은..', CorpCorpId: 10 },
        { name: 'SAP', position: '임베디드 개발자', award: 1300000, skill: 'C', description: 'SAP에서 임베디드 개발자를 채용합니다. 자격요건은..', CorpCorpId: 10 },
        { name: 'Dell Technologies', position: '임베디드 개발자', award: 1300000, skill: 'C', description: 'Dell Technologies에서 임베디드 개발자를 채용합니다. 자격요건은..', CorpCorpId: 11 },
        { name: 'Hewlett Packard Enterprise (HPE)', position: '보안 개발자', award: 1200000, skill: 'Java', description: 'Hewlett Packard Enterprise (HPE)에서 보안 개발자를 채용합니다. 자격요건은..', CorpCorpId: 12 },
        { name: 'Adobe', position: '프론트엔드 주니어 개발자', award: 1100000, skill: 'Javascript', description: 'Adobe에서 프론트엔드 주니어 개발자를 채용합니다. 자격요건은..', CorpCorpId: 13 },
        { name: 'Salesforce', position: '백엔드 시니어 개발자', award: 1400000, skill: 'C++', description: 'Salesforce에서 백엔드 시니어 개발자를 채용합니다. 자격요건은..', CorpCorpId: 14 },
        { name: 'NVIDIA', position: '앱 개발자', award: 1500000, skill: 'Java', description: 'NVIDIA에서 앱 개발자를 채용합니다. 자격요건은..', CorpCorpId: 15 },
        { name: 'Tencent', position: '프론트엔드 시니어 개발자', award: 1200000, skill: 'Javascript', description: 'Tencent에서 프론트엔드 시니어 개발자를 채용합니다. 자격요건은..', CorpCorpId: 16 },
        { name: 'Alibaba', position: '임베디드 개발자', award: 1000000, skill: 'C', description: 'Alibaba에서 임베디드 개발자를 채용합니다. 자격요건은..', CorpCorpId: 17 },
        { name: 'Sony', position: '보안 개발자', award: 1300000, skill: 'Python', description: 'Sony에서 보안 개발자를 채용합니다. 자격요건은..', CorpCorpId: 18 },
        { name: 'Samsung Electronics', position: '프론트엔드 주니어 개발자', award: 1100000, skill: 'Javascript', description: 'Samsung Electronics에서 프론트엔드 주니어 개발자를 채용합니다. 자격요건은..', CorpCorpId: 19 },
        { name: 'LG Electronics', position: '백엔드 시니어 개발자', award: 1400000, skill: 'Java', description: 'LG Electronics에서 백엔드 시니어 개발자를 채용합니다. 자격요건은..', CorpCorpId: 20 },
        { name: 'Xiaomi', position: '앱 개발자', award: 1000000, skill: 'C++', description: 'Xiaomi에서 앱 개발자를 채용합니다. 자격요건은..', CorpCorpId: 21 },
        { name: 'Lenovo', position: '프론트엔드 시니어 개발자', award: 1500000, skill: 'Javascript', description: 'Lenovo에서 프론트엔드 시니어 개발자를 채용합니다. 자격요건은..', CorpCorpId: 22 },
        { name: 'Qualcomm', position: '백엔드 주니어 개발자', award: 1200000, skill: 'Python', description: 'Qualcomm에서 백엔드 주니어 개발자를 채용합니다. 자격요건은..', CorpCorpId: 23 },
        { name: 'PayPal', position: '임베디드 개발자', award: 1300000, skill: 'C', description: 'PayPal에서 임베디드 개발자를 채용합니다. 자격요건은..', CorpCorpId: 24 },
        { name: 'VMware', position: '보안 개발자', award: 1400000, skill: 'Java', description: 'VMware에서 보안 개발자를 채용합니다. 자격요건은..', CorpCorpId: 25 }
    ]
);

export {User, Notice, Corp};

//sequelize.close();
