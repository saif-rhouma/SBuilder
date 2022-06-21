import path from 'path';
import { Router } from 'express';
import Git from 'nodegit';
import runAsyncWrapper from '../../utils/runAsyncWrapper';
import { nanoid } from 'nanoid';

const router = Router();

router.get(
  '/branches',
  runAsyncWrapper(async (req, res) => {
    const repository = await Git.Repository.open(path.join(__dirname + '../../../../project/launcher'));
    const currentBranch = await repository.getCurrentBranch();
    const currentBranchName = currentBranch.shorthand();
    const branches = [];
    if (repository) {
      const refs = await repository.getReferences();
      const remoteRefs = refs.filter((r) => r.isRemote() === 1);
      remoteRefs.map((r) => {
        const dataToShow = {
          id: nanoid(),
          name: r.name().replace('refs/remotes/origin/', ''),
          fullName: r.name(),
          isCurrent: r.shorthand().includes(currentBranchName),
        };

        branches.push(dataToShow);
      });
    }
    res.render('./branches', { page: 'branches', branches: branches });
  })
);

router.get(
  '/api/branches',
  runAsyncWrapper(async (req, res) => {
    const repository = await Git.Repository.open(path.join(__dirname + '../../../../project/launcher'));
    const branches = [];
    if (repository) {
      const refs = await repository.getReferences();
      const remoteRefs = refs.filter((r) => r.isRemote() === 1);
      remoteRefs.map((r) => {
        const dataToShow = {
          id: nanoid(),
          name: r.name().replace('refs/remotes/origin/', ''),
          fullName: r.name(),
          isCurrent: true,
        };

        branches.push(dataToShow);
      });
    }
    res.json(branches);
  })
);

router.get(
  '/api/branch',
  runAsyncWrapper(async (req, res) => {
    const repository = await Git.Repository.open(path.join(__dirname + '../../../../project/launcher'));
    let currentBranchName;
    if (repository) {
      const currentBranch = await repository.getCurrentBranch();
      currentBranchName = currentBranch.shorthand();
    }
    res.json(currentBranchName);
  })
);

export default router;
