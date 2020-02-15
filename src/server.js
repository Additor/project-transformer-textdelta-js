import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import router from './routes';
import globalErrorHandler from './controllers/error';

const app = express();
const port = process.env.PORT || 3030;

//Content Type: application/json
app.use(bodyParser.json());

//모든 도메인에 대한 cors 허용 (나중에 변경 필요)
app.use(cors());

//API: version 1.0
app.use('/v1', router);

//Global Error Handler
app.use(globalErrorHandler);

app.listen(port, () => console.log(`listening on port ${port}`));
