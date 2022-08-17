import path from 'path';
import Git from 'nodegit';
import models from '../../models';
import VersionNumber from '../../helpers/versionNumber';
import BuildNumber from '../../helpers/buildNumber';
import moment from 'moment';
import { nameByRace } from 'fantasy-name-generator';

const { AppBuild, BuildKey } = models;

const viewCreateBuild = async (req, res) => {
  let currentBranchName = 'master';
  try {
    const repository = await Git.Repository.open(path.join(__dirname + '../../../../project/launcher'));
    const currentBranch = await repository.getCurrentBranch();
    currentBranchName = currentBranch.shorthand();
  } catch (error) {
    console.log(error);
  }
  try {
    const lastBuild = await AppBuild.findOne(
      {
        order: [['createdAt', 'DESC']],
      },
      { raw: true }
    );

    let buildNumber = '1.0.0';
    let versionNumber = '1.0.0';
    let lastBuildKey;
    if (lastBuild !== null) {
      buildNumber = lastBuild.buildNumber;
      versionNumber = lastBuild.versionNumber;
      try {
        lastBuildKey = (
          await BuildKey.findOne(
            {
              where: {
                appBuildId: lastBuild.id,
              },
              order: [['createdAt', 'DESC']],
            },
            { raw: true }
          )
        ).buildNumber;
      } catch (error) {}
    }
    lastBuildKey = '0000';
    const versionNumberGen = new VersionNumber();
    const buildNumberGen = new BuildNumber();
    const releaseNumber = await AppBuild.count();
    const releaseBuildNumber = await BuildKey.count();

    const description = `${moment().format('MMMM Do YYYY, h:mm:ss a')} \nThis is ${
      releaseNumber + 1
    } release(s), with total builds ${releaseBuildNumber + 1} including this one. `;
    const buildName = nameByRace('dragon', { gender: 'female' });
    res.render('./builder', {
      page: 'build',
      gitbranch: currentBranchName,
      lastBuildNumber: buildNumber,
      lastVersionNumber: versionNumber,
      title: `[ ${buildNumberGen.nextBuild(releaseNumber)} / ${buildNumberGen.nextBuild(
        releaseBuildNumber
      )} ] - New Build Release`,
      description: description,
      buildName: buildName,
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export default viewCreateBuild;
