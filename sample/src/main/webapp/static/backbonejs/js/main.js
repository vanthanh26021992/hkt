require.config({
  urlArgs: "bust=" + (new Date()).getTime(), //prevent cache for development
  baseUrl: 'js',
  
  paths: {
    jquery: 'libs/jquery/jquery',
    underscore: 'libs/underscore/underscore-1.5.2',
    backbone: 'libs/backbonejs/backbonejs-1.1.0'
  },
  
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    }
  }
});

define([
  'app'
], function(App){
  app = App ;
});
