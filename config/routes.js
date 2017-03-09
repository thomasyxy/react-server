"use strict";
const router = require('koa-router')();


module.exports = function(app) {

  router.get('/', function *(next) {
    this.body = 'hello world';

    yield next;
  });

  return router.middleware();
};
