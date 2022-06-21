import { Router } from 'express';
import runAsyncWrapper from '../../utils/runAsyncWrapper';

const router = Router();

router.get(
  '/',
  runAsyncWrapper(async (req, res) => {
    res.render('./index', { page: 'test' });
  })
);

export default router;
