const getReleaseLevel = (level) => {
  switch (key) {
    case 'Release':
      return 'R';
    case 'Beta':
      return 'B';
    case 'Alpha':
      return 'A';
    default:
      return 'A';
  }
};

export default getReleaseLevel;
