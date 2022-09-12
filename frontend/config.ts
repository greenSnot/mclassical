const default_cfg = require('../config/default').config;
const local = require('../config/local');

const conf = {
  ...default_cfg,
  ...(local ? local.config : {}),
};

export default conf;
