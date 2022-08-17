import { Router } from 'express';
import { v1Routes } from '../controllers';
import runAsyncWrapper from '../utils/runAsyncWrapper';

const apiRoutes = Router();

apiRoutes.post('/build/appbuild', runAsyncWrapper(v1Routes.createAppBuild));
apiRoutes.post('/build/buildkey', runAsyncWrapper(v1Routes.createBuildKey));
apiRoutes.get('/build', runAsyncWrapper(v1Routes.getAllAppBuild));
apiRoutes.get('/branches', runAsyncWrapper(v1Routes.getAllBranches));
apiRoutes.get('/branch', runAsyncWrapper(v1Routes.getCurrentBranch));

export default apiRoutes;
