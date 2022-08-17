import path from 'path';
import Git from 'nodegit';

const getCurrentBranch = async (req, res) => {
  const repository = await Git.Repository.open(path.join(__dirname + '../../../../project/launcher'));
  let currentBranchName;
  if (repository) {
    const currentBranch = await repository.getCurrentBranch();
    currentBranchName = currentBranch.shorthand();
  }
  res.json(currentBranchName);
};

export default getCurrentBranch;
