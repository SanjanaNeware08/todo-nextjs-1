//import all files and export them here
const config = require("./config");
const controllers = require("./controllers");
const models = require("./models");
const routes = require("./routes");
const daos = require("./daos");
const middlewares = require("./middlewares");
const services = require("./services");
const utils = require("./utils");

module.exports = {
  config,
  controllers,
  models,
  routes,
  daos,
  middlewares,
  services,
  utils
};
