#!/usr/bin/env node

const {
  existsSync,
  unlinkSync,
} = require('fs');

const exec = require('child_process').execSync;

const dirs = [
  '.nyc_output',
  'coverage',
  'node_modules',
];

const files = [
  'yarn.lock',
  'package-lock.json',
  'coverage.lcov',
];

dirs.forEach((d) => {
  exec(`rm -rf ${d}`);
});

files.forEach((f) => {
  if (existsSync(f)) {
    unlinkSync(f);
  }
});
