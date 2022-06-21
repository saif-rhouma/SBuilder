import path from 'path';
import { Router } from 'express';
import Git from 'nodegit';
import { Op } from 'sequelize';
import models from '../../models';
import runAsyncWrapper from '../../utils/runAsyncWrapper';
import VersionNumber from '../../helpers/versionNumber';
import BuildNumber from '../../helpers/buildNumber';
import moment from 'moment';
import { nameByRace } from 'fantasy-name-generator';
import getLevel from '../../helpers/getLevel';
import BuilProject from '../../utils/buildProject';

const router = Router();

const { AppBuild, BuildKey } = models;

router.get(
  '/build',
  runAsyncWrapper(async (req, res) => {
    try {
      const limit = 8;
      let page = 1;
      if (req.query.page) {
        page = req.query.page;
      }

      const offset = 0 + (page - 1) * limit;

      const appBuilds = await AppBuild.findAll(
        {
          offset: offset,
          limit: limit,
          order: [['createdAt', 'DESC']],
        },
        { raw: true }
      );

      const prCount = await AppBuild.count();

      res.render('./buildHistory', {
        page: 'build',
        appBuilds,
        offsetPage: page,
        lastPage: parseInt(Math.ceil(prCount / limit)),
      });
    } catch (error) {
      res.send(error);
    }
  })
);

router.get(
  '/build/create',
  runAsyncWrapper(async (req, res) => {
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
  })
);

router.get(
  '/api/build',
  runAsyncWrapper(async (req, res) => {
    try {
      const appBuild = await AppBuild.findAll();
      res.status(200).json(appBuild);
    } catch (error) {
      res.status(500).json(error);
    }
  })
);

router.post(
  '/api/build/appbuild',
  runAsyncWrapper(async (req, res) => {
    try {
      const appBuild = await AppBuild.create({ ...req.body });
      res.status(200).json(appBuild);
    } catch (error) {
      res.status(500).json(error);
    }
  })
);

router.post(
  '/api/build/buildkey',
  runAsyncWrapper(async (req, res) => {
    try {
      const buildKey = await BuildKey.create({ ...req.body });
      res.status(200).json(buildKey);
    } catch (error) {
      res.status(500).json(error);
    }
  })
);

router.post(
  '/build/create',
  runAsyncWrapper(async (req, res) => {
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
  })
);

router.get(
  '/build/extrabuild',
  runAsyncWrapper(async (req, res) => {
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
  })
);

export default router;
