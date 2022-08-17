import { Router } from 'express';
import { v1Routes } from '../controllers';
import runAsyncWrapper from '../utils/runAsyncWrapper';

const viewsRoutes = Router();

viewsRoutes.get('/branches', runAsyncWrapper(v1Routes.viewBranches));
viewsRoutes.get('/build', runAsyncWrapper(v1Routes.viewBuilds));
viewsRoutes.get('/build/create', runAsyncWrapper(v1Routes.viewCreateBuild));
viewsRoutes.get('/build/extrabuild', runAsyncWrapper(v1Routes.viewExtraBuild));
viewsRoutes.get('/', runAsyncWrapper(v1Routes.viewHome));
viewsRoutes.post('/build/create', runAsyncWrapper(v1Routes.viewPostCreateBuild));

export default viewsRoutes;
