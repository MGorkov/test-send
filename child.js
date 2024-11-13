const crypto = require('crypto');
require('./patch-send');

setInterval(() => {
  process.send({data: crypto.randomBytes(1_000_000 + Math.random() * 500_000 | 0)});
}, 1)
