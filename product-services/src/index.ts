import express from 'express';
import bodyParser from 'body-parser';
import { morganInstance } from './configs/morgan';
import router from './routes';
import { notFound, errorHandler } from './middleware';
import { initializeData } from './utils/autoCreate';
import { env } from './configs/env';

try {
    process.loadEnvFile(); // works with only latest node versions
} catch {
    require('dotenv').config();
}

const app = express();

app.set('trust proxy', true)
    .disable('x-powered-by')
    .use(morganInstance)
    .use(express.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(errorHandler)
    .use('/', router)
    .use(notFound)
    .use(errorHandler);

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
    initializeData();
});
