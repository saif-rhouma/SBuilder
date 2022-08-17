import path from 'path';
import Git from 'nodegit';
import { nanoid } from 'nanoid';

const viewBranches = async (req, res) => {
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
};

export default viewBranches;
