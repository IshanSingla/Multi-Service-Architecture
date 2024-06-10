import { Router } from 'express';
import privateRouter from './private';
import publicRouter from './public';
const router: Router = Router();

router.get('/', (req, res) => {
    res.send('server is live');
});

router.use('/private', privateRouter);
router.use('/public', publicRouter);

export default router;
