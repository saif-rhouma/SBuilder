import { Router } from 'express';
import testRouter from './fntest';
import homeRouter from './home';
import buildRouter from './build';
import branchesRouter from './branches';

const router = Router();

router.use(testRouter);
router.use(homeRouter);
router.use(buildRouter);
router.use(branchesRouter);

export default router;
