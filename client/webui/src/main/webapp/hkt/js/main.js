var ROOT_CONTEXT = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"));
var libs = "../../js/libs" ;

require.config({
  urlArgs: "bust=" + (new Date()).getTime(), //prevent cache for development
  baseUrl: 'js',
  waitSeconds: 60,
  
  paths: {
    libs:         libs,
    jquery:       libs + '/jquery/jquery',
    underscore:   libs + '/underscore/underscore-1.5.2',
    backbone:     libs + '/backbonejs/backbonejs-1.1.0',
    moment:       libs + '/moment/moment.min',
    jquerymobile: libs + '/jquery/mobile/1.4.2/jquery.mobile-1.4.2.min',
    datepickerui:     libs + '/datepicker/jquery.ui.datepicker',
    datepickermb:   libs + '/datepicker/jquery.mobile.datepicker',
    jqplot:       libs + '/jqplot/jquery.jqplot.min'
  },
  
  shim: {
    jquery: {
      exports: '$'
    },
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },
    moment: {
      exports: "moment"
    },
    jqplot: {
      deps: ["jquery"],
      exports: "$.jqplot"
    },
    jquerymobile: {
      deps: ['jquery'],
      exports: 'jquerymobile'
    },
    datepickerui: {
      deps: ["jquery", "jquerymobile"],
      exports: 'datepickerui'
    },
    datepickermb: {
      deps: ["jquerymobile", "datepickerui"],
      exports: 'datepickermb'
    }
  }
});

require([
  'jquery', 'datepickermb', 'app'
], function($, datepickermb, App){
  app = App ;
  app.initialize() ;
});
