"use strict";
const router = require('koa-router')();


module.exports = function(app) {

  router.get('/', function *(next) {
    this.render('index',{
      title: '逸轩的博客'
    })

    yield next
  });

  return router.middleware();
};
