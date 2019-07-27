const path = require('path');

const ROOT = path.join(__dirname);
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const PUBLIC = path.join(ROOT, 'public');
const CLIENT = path.join(SRC, 'client');

module.exports = {
  ROOT,
  SRC,
  DIST,
  PUBLIC,
  CLIENT,
}