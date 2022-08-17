import { Op } from 'sequelize';
import models from '../../models';
import VersionNumber from '../../helpers/versionNumber';
import getLevel from '../../helpers/getLevel';
import BuilProject from '../../utils/buildProject';

const { AppBuild, BuildKey } = models;

const viewPostCreateBuild = async (req, res) => {
  try {
    const releaseData = {
      logo: 'images.jpg',
      title: req.body.title || 'New Build',
      description: req.body.title || 'Generique Description ...',
      type: req.body.type,
      gitbranch: req.body.gitbranch,
      versionType: req.body.versionType,
      versionName: req.body.versionName || 'New Version',
      buildName: req.body.buildName || 'New Build',
      versionNumber: req.body.lastVersionNumber,
      buildNumber: req.body.lastBuildNumber,
    };

    const versionNumber = new VersionNumber();
    if (getLevel(releaseData.versionType) <= 1) {
      releaseData.versionNumber = versionNumber.nextVersion(
        getLevel(releaseData.versionType),
        releaseData.versionNumber
      );
      releaseData.buildNumber = '1.0';
    }
    if (getLevel(releaseData.versionType) > 1 && getLevel(releaseData.versionType) < 4) {
      releaseData.buildNumber = versionNumber.nextVersion(
        getLevel(releaseData.versionType) - 2,
        req.body.lastBuildNumber
      );
    }

    const lastBuild = await AppBuild.findOne(
      {
        where: {
          type: {
            [Op.like]: `%${releaseData.type}%`, // Like: status IS NULL
          },
          versionNumber: {
            [Op.like]: `%${releaseData.versionNumber}%`, // Like: status IS NULL
          },
          buildNumber: {
            [Op.like]: `%${releaseData.buildNumber}%`, // Like: status IS NULL
          },
        },
      },
      { raw: true }
    );
    let lastBuildKeyNumber = '0000';
    if (lastBuild) {
      const buildKey = await BuildKey.findOne(
        {
          where: {
            AppBuildId: lastBuild.id,
          },
          order: [['createdAt', 'DESC']],
        },
        { raw: true }
      );
      lastBuildKeyNumber = buildKey.buildNumber;
    }

    const appBuild = {
      logo: releaseData.logo,
      title: releaseData.title,
      description: releaseData.description,
      type: releaseData.type,
      gitbranch: releaseData.gitbranch,
      versionType: releaseData.versionType,
      versionName: releaseData.versionName,
      buildName: releaseData.buildName,
      versionNumber: releaseData.versionNumber,
      buildNumber: releaseData.buildNumber,
    };

    const appBuildData = await AppBuild.create(appBuild);

    const builProject = new BuilProject(
      'launcher',
      {
        appBuildId: appBuildData.id,
        stage: releaseData.type,
        version: releaseData.versionNumber,
        buildVersion: releaseData.buildNumber,
        lastbuildNumber: lastBuildKeyNumber,
      },
      req.body.quantity
    );
    builProject.executeAllJobs();
    res.redirect('/v1/build');
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export default viewPostCreateBuild;
