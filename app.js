import express from 'express';
import routes from './routes/routes.js'
import { syncModels } from './models/index.js';
import seedDatabase from './seed.js'

// express
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/', routes);

syncModels().then(() => {           // 데이터베이스 동기화
    seedDatabase().then(() => {     // 초기 데이터 삽입(데이터베이스가 비어 있는 경우)
        app.listen(port, () => {
            console.log(`Example app listening on ${port}`);
        });
    });
});