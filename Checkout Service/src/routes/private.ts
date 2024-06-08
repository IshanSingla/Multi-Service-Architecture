import { Router } from 'express';

const router: Router = Router();

router.get('/', (req, res) => {
    res.send('server is live');
});


export default router;
