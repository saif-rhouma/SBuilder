import { Router } from 'express';
import apiRoutes from './api.routes';
import viewsRoutes from './views.routes';
const router = Router();

router.use('/api', apiRoutes);
router.use(viewsRoutes);

export default router;
