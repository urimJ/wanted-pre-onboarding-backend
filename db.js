import { Sequelize, Model, DataTypes } from 'sequelize';
import { config } from 'dotenv';
config();

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

// 개체

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

// 지원내역 (AppStatus)
class AppStatus extends Model {}
AppStatus.init(
    {
        app_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    }
    ,
    {
        sequelize,
        modelName: 'AppStatus',
        timestamps: false
    }
)


// 릴레이션

// 회사 : 채용공고 = 일대다
Corp.hasMany(Notice);
Notice.belongsTo(Corp);

// 사용자 : 채용공고 = 일대일
User.belongsTo(Notice,
    {
        through: 'AppStatus',
        foreignKey: 'notice_id'
    }
);


await sequelize.sync({force: true});
console.log('All models were synchronized successfully.');

// 데이터

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
)

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
)

//sequelize.close();
