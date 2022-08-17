import path from 'path';
import fs from 'fs/promises';
import { nanoid } from 'nanoid';
import { google } from 'googleapis';
import STRINGS from '../constants/messages';
import models from '../models';

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
    /*
    Avaxia Own Deleted Part Of The Code.
    */
    return true;
  }
  //// ! Job 2 : Commit The Project
  async gitCommit() {
    console.log(STRINGS['BUILD_PROJECT/gitCommit/msg']);
    /*
    Avaxia Own Deleted Part Of The Code.
    */
  }
  //// ! Job 3 : Building The Project
  executeBuild(filename) {
    console.log(STRINGS['BUILD_PROJECT/executeBuild/msg']);
    /*
    Avaxia Own Deleted Part Of The Code.
    */
  }
  //// ! Job 4 : Rename & Copy The Build File
  async renameAndMoveBuild(filename = 'my-app Setup 0.1.0.exe', newFilename) {
    console.log(STRINGS['BUILD_PROJECT/renameAndMoveBuild/msg']);
    /*
    Avaxia Own Deleted Part Of The Code.
    */
  }
  //// ! Job 5 : Upload The File
  async uploadBuildFile(filename, mimeType = 'application/vnd.microsoft.portable-executable') {
    console.log(STRINGS['BUILD_PROJECT/uploadBuildFile/msg']);
    /*
    Avaxia Own Deleted Part Of The Code.
    */
  }

  //// ! Jobs : Execute All Jobs
  async executeAllJobs() {
    console.log(STRINGS['BUILD_PROJECT/executeAllJobs/msg']);
    /*
    Avaxia Own Deleted Part Of The Code.
    */
  }
}

export default BuilProject;
