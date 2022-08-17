import path from 'path';
import Git from 'nodegit';
import { nanoid } from 'nanoid';

const getAllBranches = async (req, res) => {
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
};

export default getAllBranches;
