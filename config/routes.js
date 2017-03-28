"use strict";
const router = require('koa-router')();


module.exports = function(app) {

  router.get('/', function *(next) {
    this.render('index',{
      title: 'hello'
    })

    yield next
  });

  return router.middleware();
};
