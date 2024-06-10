import express from 'express';
import bodyParser from 'body-parser';
import { morganInstance } from './configs/morgan';
import router from './routes';
import { notFound, errorHandler } from './middleware';
import { env } from './configs/env';

const app = express();

app.set('trust proxy', true)
    .disable('x-powered-by')
    .use(morganInstance)
    .use(express.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use('/', router)
    .use(notFound)
    .use(errorHandler);

app.listen(env.PORT, () => {
    console.log(`Auth Server is running on port ${env.PORT}`);
});
