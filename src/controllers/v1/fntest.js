import path from 'path';
import { Router } from 'express';
import Git from 'nodegit';
// import simpleGit from 'simple-git';
import runAsyncWrapper from '../../utils/runAsyncWrapper';

const router = Router();

router.get(
  '/test',
  runAsyncWrapper(async (req, res) => {
    const repository = await Git.Repository.open(path.join(__dirname + '../../../../launcher'));
    if (repository) {
      const currentBranch = await repository.getCurrentBranch();
      let currentBranchName = currentBranch.shorthand();

      const refs = await repository.getReferences();
      const remoteRefs = refs.filter((r) => r.isRemote() === 1);
      remoteRefs.map((r) => {
        console.log(r.name());
      });
      console.log(currentBranchName);
    }
    res.json('Test');
  })
);

export default router;
