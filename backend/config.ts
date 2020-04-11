const default_cfg = require('../config/default').config;
const local = require('../config/local').config;

const conf = {
  ...default_cfg,
  ...local,
};

export default conf;
