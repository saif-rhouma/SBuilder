class BuildNumber {
  constructor() {}
  generateNumber(length = 0) {
    let buildNumber = '';
    for (let index = 1; index < length; index++) {
      buildNumber += '0';
    }
    buildNumber += '1';
    return buildNumber;
  }

  addLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, '0');
  }

  nextBuild(base) {
    const length = base.toString().length;
    let baseNumber = parseInt(base) + 1;
    baseNumber = this.addLeadingZeros(baseNumber, length);
    return baseNumber;
  }
}
export default BuildNumber;
