define([
  'jquery', 
  'underscore', 
  'backbone',
  'view/BannerView',
  'view/NavigationView',
  'view/WorkspaceView'
], function($, _, Backbone, BannerView, NavigationView, WorkspaceView) {
  var app = {
    view : {
      BannerView: new BannerView() ,
      NavigationView: new NavigationView(),
      WorkspaceView: new WorkspaceView()
    }
  } ;
  return app ;
});