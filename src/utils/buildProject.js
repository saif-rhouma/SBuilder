import path from 'path';
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import { exec } from 'child_process';
import { nanoid } from 'nanoid';
import Git from 'nodegit';
import { google } from 'googleapis';
import capitalizeFirstLetter from '../helpers/capitalize';
import BuildNumber from '../helpers/buildNumber';
import STRINGS from '../constants/messages';
import models from '../models';

const { BuildKey } = models;

////////////*
////////* Google Drive Config
////////////*
const KEYFILEPATH = path.join(__dirname + `/../keys/sbuilderbuildfiles-d969a8a307c4.json`);
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});
////////////*
class BuilProject {
  constructor(project, metadata, executing, stage = 1) {
    this.projectName = project;
    this.projectPath = path.join(__dirname + `../../../project/${project}`);
    this.buildingStage = stage;
    this.executing = executing;
    this.metadata = { ...metadata, launcherId: nanoid(10) };
  }
  //// ! Job 0 : Delete The Build Directory
  async rmDir(path) {
    console.log(STRINGS['BUILD_PROJECT/rmDir/msg']);
    this.buildingStage += 1;
    return await fs.rm(this.projectPath + `/${path}`, { recursive: true, force: true });
  }
  //// ! Job 1 : Create The Setting File
  async createLauncherSettingFile(stage, version, buildVersion) {
    console.log(STRINGS['BUILD_PROJECT/createLauncherSettingFile/msg']);
    this.buildingStage += 1;
    const appSettings = JSON.parse(await fs.readFile(path.join(this.projectPath, '/public/settings.json')));
    appSettings.LAUNCHER.LAUNCHER_ID = this.metadata.launcherId;
    appSettings.LAUNCHER.STAGE = stage;
    appSettings.LAUNCHER.VERSION = version;
    appSettings.LAUNCHER.BUILD_VERSION = buildVersion;
    await fs.writeFile(path.join(this.projectPath, '/public/settings.json'), JSON.stringify(appSettings));
    return true;
  }
  //// ! Job 2 : Commit The Project
  async gitCommit() {
    console.log(STRINGS['BUILD_PROJECT/gitCommit/msg']);
    this.buildingStage += 1;
    const repository = await Git.Repository.open(this.projectPath);
    const index = await repository.refreshIndex();
    await index.addAll();
    await index.write();
    const changes = await index.writeTree();
    const head = await Git.Reference.nameToId(repository, 'HEAD'); // get reference to the current state
    const parent = await repository.getCommit(head); // get the commit for current state
    const author = Git.Signature.now('SBuilder', 'saifeddine.rhouma@avaxia-group.com'); // build auth/committer
    const committer = Git.Signature.now('SBuilder', 'saifeddine.rhouma@avaxia-group.com');
    const commitId = await repository.createCommit('HEAD', author, committer, 'Commited By SBuilder', changes, [
      parent,
    ]);
  }
  //// ! Job 3 : Building The Project
  executeBuild(filename) {
    console.log(STRINGS['BUILD_PROJECT/executeBuild/msg']);
    const process__ = exec('npm run electron-build', { cwd: this.projectPath }, function (err, stdout, stderr) {
      if (err) {
        console.error(`exec error: ${err}`);
        return;
      }
    });
    process__.on('spawn', () => {
      console.log('Start Building Project ... ');
    });
    process__.on('close', async () => {
      console.log('Building Finish With Success ... ');
      this.executing -= 1;
      const buildNumberGen = new BuildNumber();
      const buildProject = new BuilProject(
        this.projectName,
        { ...this.metadata, lastbuildNumber: buildNumberGen.nextBuild(this.metadata.lastbuildNumber) },
        this.executing,
        this.buildingStage
      );
      const nextStep = await buildProject.renameAndMoveBuild(undefined, filename);
      if (nextStep === undefined) {
        buildProject.uploadBuildFile(filename);
        try {
          const dataToSave = {
            buildKey: this.metadata.launcherId,
            buildNumber: buildNumberGen.nextBuild(this.metadata.lastbuildNumber),
            AppBuildId: this.metadata.appBuildId,
          };
          await BuildKey.create(dataToSave);
          console.log('Adding in DataBase...');
        } catch (error) {}
        setTimeout(() => {
          if (this.executing > 0) {
            buildProject.executeAllJobs();
          }
        }, 3000);
      }
    });
  }
  //// ! Job 4 : Rename & Copy The Build File
  async renameAndMoveBuild(filename = 'my-app Setup 0.1.0.exe', newFilename) {
    console.log(STRINGS['BUILD_PROJECT/renameAndMoveBuild/msg']);
    return await fs.rename(
      path.join(this.projectPath + `/dist/${filename}`),
      path.join(__dirname + `../../../build/${newFilename}.exe`),
      (err) => {
        if (err) throw err;
        this.buildingStage += 1;
      }
    );
  }
  //// ! Job 5 : Upload The File
  async uploadBuildFile(filename, mimeType = 'application/vnd.microsoft.portable-executable') {
    console.log(STRINGS['BUILD_PROJECT/uploadBuildFile/msg']);

    const driveService = google.drive({ version: 'v3', auth });
    let fileMetaData = {
      name: `${filename}.exe`,
      parents: ['1RiQG_NumM0VXnxoxxuf0B-JeGmNPJyzh'],
    };
    let media = {
      mimeType: mimeType,
      body: createReadStream(path.join(__dirname + `../../../build/${filename}.exe`)),
    };
    const response = await driveService.files.create({
      resource: fileMetaData,
      media: media,
      fields: 'id',
    });
    switch (response.status) {
      case 200:
        console.log('File Created id :', response.data.id);
        break;

      default:
        console.log('Error Creating file, ', response.errors);
        break;
    }
  }

  //// ! Jobs : Execute All Jobs
  async executeAllJobs() {
    console.log(STRINGS['BUILD_PROJECT/executeAllJobs/msg']);
    this.rmDir('dist');
    const executeSetting = this.rmDir('build');
    const buildNumberGen = new BuildNumber();
    const buildVersionNumber =
      `${this.metadata.buildVersion}.` + buildNumberGen.nextBuild(this.metadata.lastbuildNumber);
    const executeCommit = await this.createLauncherSettingFile(
      this.metadata.stage,
      this.metadata.version,
      buildVersionNumber
    );

    if (executeCommit) await this.gitCommit();
    const createFileName = `${capitalizeFirstLetter(this.projectName)} - ${capitalizeFirstLetter(
      this.metadata.stage
    )} ${this.metadata.version} [Build ${buildVersionNumber}]`;
    if (executeSetting) {
      await this.executeBuild(createFileName);
    }
    return this.metadata;
  }
}

export default BuilProject;
