const fs = require('fs');
const path = require('path');

/**
 * Import specs
 */
let where = './test/specs/';
if (fs.existsSync(where)) {
  fs.readdirSync(where).forEach((file) => {
    if (path.extname(file) === '.js') {
      require(path.join('.' + where, file));
    }
  });
}
