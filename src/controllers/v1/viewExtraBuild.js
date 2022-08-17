import models from '../../models';

import BuilProject from '../../utils/buildProject';

const { AppBuild, BuildKey } = models;

const viewExtraBuild = async (req, res) => {
  try {
    const releaseData = await AppBuild.findByPk(req.query.id, { raw: true });
    let lastBuildKeyNumber = '0000';
    try {
      const buildKey = await BuildKey.findOne(
        {
          where: {
            AppBuildId: releaseData.id,
          },
          order: [['createdAt', 'DESC']],
        },
        { raw: true }
      );
      lastBuildKeyNumber = buildKey.buildNumber;
    } catch (error) {}
    const builProject = new BuilProject(
      'launcher',
      {
        appBuildId: releaseData.id,
        stage: releaseData.type,
        version: releaseData.versionNumber,
        buildVersion: releaseData.buildNumber,
        lastbuildNumber: lastBuildKeyNumber,
      },
      1
    );
    builProject.executeAllJobs();
    res.redirect('/v1/build');
  } catch (error) {
    res.status(500).json(error);
  }
};
export default viewExtraBuild;
