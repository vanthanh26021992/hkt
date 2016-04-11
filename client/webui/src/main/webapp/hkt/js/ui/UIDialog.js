define([
  'jquery', 
  'underscore', 
  'backbone',
  'jqplot',
  'ui/ModalView',
  'text!ui/UIDialog.jtpl',
  'css!ui/UIDialog.css',
  'css!libs/jqplot/jquery.jqplot.css',
], function($, _, Backbone, jqplot, ModalView,UITableTmpl) {

	var UIDialog = ModalView.extend(
			{
			    name: "AddPersonView",
			    initialize:
			        function()
			        {
			            _.bindAll( this, "render");
			            this.template = _.template(UITableTmpl);
			        },
			    events:
			        {
			            "submit form": "addPerson"
//			    		'click a.onToggleBean': 'addPerson',
			        },
			    addPerson:
			        function(event)
			        {
			            this.hideModal();
			            event.preventDefault();
			        },
			    render:
			        function()
			        {
			    	var params = {
			    			str: this.str
			    	      } ;
			            $(this.el).html( this.template(params));
			            return this;
			        },
			        showNotice:
				        function(str)
				        {
			        	   this.str = str;
			        	   if(this.str=="" || this.str==null){
			        		   this.str = "Trùng thời gian";
			        	   }
				           this.render();
				           this.showModal();
				        },
			});
  
  return UIDialog ;
});