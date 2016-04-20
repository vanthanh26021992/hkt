define([
  'jquery', 
  'underscore', 
  'backbone',
  'dialog/DialogNotice'
], function($, _, Backbone,UIDialog) {
  var UIPopup = Backbone.View.extend({
    el: "#PopupPanel",
    
    initialize: function (options) {
    	
    },
    
    activate: function(view) {
      $(this.el).off();
//      $(this.el).css({
//          width: window.innerWidth,
//          height: window.innerHeigh,
//          left: 0,
//          top: 0
//      });
      var instance = this ;
      view.clopsePopup = function() {
        instance.clopsePopup() ;
      };
      this.view = view ;
      this.render() ;
    },
    
    showNotice: function(notice) {
    	var dialog = {nameDialog: "", isDialog: true, kpi: []};
   		dialog.nameDialog = notice;
   		dialog.isDialog = true; 
   	   this.activate(new UIDialog.UIDialogNotice().init(this,dialog));
	},
	
	 getPermission: function(screen, permis){
	    	var per = "";
	    	if(this.accountConfig.loginId=="admin"){
	    		return true;
	    	}else{
	    		if(this.accountConfig.profiles.config!=null &&
	    				this.accountConfig.profiles.config[screen]!=null){
	    			per= this.accountConfig.profiles.config[screen];
	    			if(per=="not"){
	    				this.showNotice("Bạn chưa có quyền này");
	        			return false;
	    			}else{
	    				if(per=="read" && per!=permis){
	    					this.showNotice("Bạn chưa có quyền này");
	    		    		return false;
	    		    	}
	    		    	if((per == "write") && (permis == "all")){
	    		    		this.showNotice("Bạn chưa có quyền này");
	    		    		return false;
	    		    	}
	    			}
	    		}else{
	    			this.showNotice("Bạn chưa có quyền này");
	    			return false;
	    		}
	    		
	    	}
	    	
	    	return true;
	    },
    _template: _.template(
      "<div>" +
      "  <h3 style='border-bottom: 1px solid; margin: 0px'><%=title%></h3>" +
      "  <div class='UIPopupContent'></div>" +
      "</div>"
    ),
    
    render: function() {
      var params = {
        title: this.view.label  
      } ;
      $(this.el).html(this._template(params));
      $(this.el).trigger("create") ;
      
      this.view.setElement(this.$('.UIPopupContent')).render();
      $(this.el).popup( "open", {});
    },
    
    closePopup: function() {
      $(this.el).popup("close") ;
    },
  });
  
  return new UIPopup() ;
});
