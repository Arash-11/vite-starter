#!/usr/bin/env node

import { spawnSync } from 'child_process';
import { dirname, join } from 'path';
import { chdir } from 'process';
import { fileURLToPath } from 'url';
import fsExtraPkg from 'fs-extra';
const { realpathSync, readdirSync, rm, copySync } = fsExtraPkg;

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const projectName = process.argv[2];
const __dirname = dirname(fileURLToPath(import.meta.url));

function removeFilesInDir(isMsgShown, directory, filesToIgnore = []) {
  const files = readdirSync(directory);

  if (files.length > 0) {
    if (!isMsgShown.state) {
      isMsgShown.state = true;
      console.log('Removing unneeded files...');
    }

    files.forEach(file => {
      if (!filesToIgnore.includes(file)) {
        rm(join(directory, file), err => {
          if (err) throw err;
        });
      }
    });
  }
}

function removeExtraFiles() {
  const projectPublicDirPath = join(dirname(realpathSync(projectName)), projectName, 'public');
  const projectSrcDirPath = join(dirname(realpathSync(projectName)), projectName, 'src');

  const isMsgShown = { state: false };

  removeFilesInDir(isMsgShown, projectPublicDirPath);
  removeFilesInDir(isMsgShown, projectSrcDirPath, ['main.ts', 'vite-env.d.ts']);
}

function addStylesDir() {
  const srcDir = join(__dirname, 'styles');
  const targetDir = join(dirname(realpathSync(projectName)), projectName, 'src', 'styles');

  copySync(srcDir, targetDir, { overwrite: true }, err => {
    if (err) {
      console.error(err);
    } else {
      console.log('Adding styles directory...');
    }
  });
}

function addDependencies() {
  try {
    const newDir = join(dirname(realpathSync(projectName)), projectName);
    chdir(newDir);

    console.log('Installing dependencies...');
    const cmd = spawnSync(npm, ['add', '-D', 'sass']);
    const stderr = cmd.output[2];

    if (stderr.length > 0) throw stderr;
  } catch (error) {
    console.error(error, error.toString());
  }
}

function runViteCmd() {
  const cmd = spawnSync(npm, ['create', 'vite@latest', projectName, '--', '--template', 'vanilla-ts']);
  const stdout = cmd.output[1];
  const stderr = cmd.output[2];

  if (stderr.length === 0) {
    console.log(stdout.toString().split('\n')[1]);
    removeExtraFiles();
    addStylesDir();
    addDependencies();
    console.log("You're good to go! You can now run:\n");
    console.log(`  cd ${projectName}\n  npm run dev`);
  } else {
    console.error(stderr.toString());
  }
}

function init() {
  if (process.argv.length < 3) {
    return console.log("It looks like you didn't pass in the name for your project.");
  }

  runViteCmd();
}

init();
