"use strict";
const router = require('koa-router')();
const React = require('react');
import ReactDOM from 'react-dom/server';
import App from '../src/pages/home/mods/app.jsx';


module.exports = function(app) {

  router.get('/', function *(next) {
    this.render('index',{
      title: 'hello'
    })

    yield next
  });

  router.get('/server', function *(next) {
    let Component = React.createFactory(App)

    console.log(Component)

    this.render('client', {
      react: ReactDOM.renderToString(Component({name: "John"}))
    })

    yield next
  })

  return router.middleware();
};
