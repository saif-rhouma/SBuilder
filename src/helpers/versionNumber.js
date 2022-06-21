String.prototype.replaceAt = function (index, replacement) {
  return this.substring(0, index) + replacement + this.substring(index + replacement.length);
};

class VersionNumber {
  constructor() {
    this.vNumber = '1.0';
  }
  getNumber() {
    return this.vNumber;
  }
  generateNumber(length = 2) {
    let versionNumber = '1';
    for (let index = 1; index < length; index++) {
      versionNumber += '.0';
    }
    return versionNumber;
  }
  normalize(vnum) {
    let versionNumber = vnum[0];
    if (vnum.length <= 1) {
      return (versionNumber += '.0');
    }
    for (let index = 1; index < vnum.length; index++) {
      versionNumber += `.${vnum[index]}`;
    }
    return versionNumber;
  }
  nextVersion(level, base) {
    let baseNumber = base.toString();
    if (baseNumber.length > 2 && baseNumber.indexOf('.') === -1) {
      baseNumber = this.normalize(baseNumber);
    }
    let nextNumber;
    const iterate = level * 2 > baseNumber.length ? level * 2 : baseNumber.length;
    for (let index = 0; index < iterate; index++) {
      if (baseNumber[index] && index < level * 2) {
        baseNumber = baseNumber.replaceAt(index, baseNumber[index]);
      }
      if (index > level * 2) {
        const char = baseNumber[index] === '.' ? '.' : '0';
        baseNumber = baseNumber.replaceAt(index, char);
      }
      if (!baseNumber[index]) {
        baseNumber += '.0';
      }
    }
    nextNumber = parseInt(baseNumber[level * 2]) + 1;
    baseNumber = baseNumber.replaceAt(level * 2, `${nextNumber}`);
    return baseNumber;
  }
}

export default VersionNumber;
