const getLevel = (level) => {
  switch (level) {
    case 'Super Major Feature':
      return 0;
    case 'Major Feature':
      return 1;
    case 'Simple Feature':
      return 2;
    case 'Hotfix':
      return 3;
    case 'Simple Build':
      return 4;
    default:
      return 0;
  }
};

export default getLevel;
