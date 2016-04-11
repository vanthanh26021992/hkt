define([
  'jquery', 
  'underscore', 
  'backbone',
  'util/PageList',
  'ui/UIPopup',
  'ui/UIBean',
  'text!ui/UITableExt.jtpl',
  'text!ui/UITableRowsExt.jtpl',
  'css!ui/UITable.css'
], function($, _, Backbone, PageList, UIPopup, UIBean, 
            UITableTmpl, UITableRowsTmpl) {
  
  /**
   *@type ui.UITable 
   */
  var UITable = Backbone.View.extend({
    initialize: function (options) {
      this.tableId = this.randomId() ;
      _.bindAll(this, 'render', 'onBeanAction') ;
    },
    
    _template: _.template(UITableTmpl),
    
    _rows: _.template(UITableRowsTmpl),
    
    /**
     *@memberOf ui.UITable 
     */
    setBeans: function(beans) {
      this.beans = beans ;
      var pageSize = beans.length
      this.state = {beans: [], pageSize: pageSize } ;
      for(var i = 0; i < beans.length; i++) {
        this.state.beans.push( { bean: beans[i] }) ;
      }
      this._filter() ;
    },
    
    _filter: function() {
        this.pageList = new PageList(this.state.pageSize, this.state.beans) ;  
      },
    
    getBeans: function() {
      this.commitChange() ;
      return this.beans ; 
    },
    
    commitChange: function() {
      this.beans.length = 0 ;
      for(var i = 0; i < this.state.beans.length; i++) {
        this.beans[i] = this.state.beans[i].bean ;
      }
    },
    
    up: function() {
    	 var j = 0;
       for(var i = 0; i < this.pageList.getPageSize(); i++) {
         var item = this.pageList.getItemOnCurrentPage(i).bean ;
        
         if(item.recycleBin){
        	var item1 = this.pageList.getItemOnCurrentPage(i-1).bean ;
        	var k = item.priority-item1.priority;
        	item.priority = i;
        	if(k==1){
        		j = i-1;
        		item1.priority = item1.priority+1;
            	this.beans[i-1].priority=item1.priority;
        	}else {
        		var item2 = this.pageList.getItemOnCurrentPage(j).bean ;
        		item2.priority = item2.priority+1;
            	this.beans[j].priority=item2.priority;
			}

        	this.beans[i].priority=item.priority;
         }
         this.beans[i].recycleBin=false;
       }

       this.beans =_.sortBy(this.beans, "priority")
       this.setBeans(this.beans);
       this.renderRows();
	},
	
	top: function() {
		do {
		   this.loadTop();
		   //console.log("ok");
		}
		while (!this.beans[0].recycleBin);
      this.beans =_.sortBy(this.beans, "priority")
      this.setBeans(this.beans);
      this.renderRows();
	},
	
	loadTop: function() {
   	 var j = 0;
      for(var i = 0; i < this.beans.length; i++) {
        var item = this.beans[i] ;
       
        if(item.recycleBin){
       	var item1 = this.beans[i-1] ;
       	var k = item.priority-item1.priority;
       	item.priority = i;
       	if(k==1){
       		j = i-1;
       		item1.priority = item1.priority+1;
       	}else {
       		var item2 = this.beans[j] 
       		item2.priority = item2.priority+1;
			}
        }
      }

      this.beans =_.sortBy(this.beans, "priority")
	},
	
	end: function() {
		do {
		   this.loadEnd();
		}
		while (!this.beans[this.beans.length-1].recycleBin);
      this.beans =_.sortBy(this.beans, "priority")
      this.setBeans(this.beans);
      this.renderRows();
	},
	
	loadEnd: function() {
		var j = 0;
        for(var i =  this.beans.length-1; i >=0 ; i--) {
          var item = this.beans[i];
         
          if(item.recycleBin){
         	var item1 = this.beans[i+1];
         	var k = item1.priority-item.priority;
         	item.priority = item.priority+1;
         	if(k==1){
         		j = i+1;
         		item1.priority = item1.priority-1;
         	}else {
         		var item2 = this.beans[j] ;
         		item2.priority = item2.priority-1;
 			}
          }
        }

        this.beans =_.sortBy(this.beans, "priority")
	},
	
	 down: function() {
    	 var j = 0;
         for(var i = this.pageList.getPageSize()-1; i >=0 ; i--) {
           var item = this.pageList.getItemOnCurrentPage(i).bean ;
          
           if(item.recycleBin){
          	var item1 = this.pageList.getItemOnCurrentPage(i+1).bean ;
          	var k = item1.priority-item.priority;
          	item.priority = item.priority+1;
          	if(k==1){
          		j = i+1;
          		item1.priority = item1.priority-1;
              	this.beans[i+1].priority=item1.priority;
          	}else {
          		var item2 = this.pageList.getItemOnCurrentPage(j).bean ;
          		item2.priority = item2.priority-1;
              	this.beans[j].priority=item2.priority;
  			}

          	this.beans[i].priority=item.priority;
           }
           this.beans[i].recycleBin=false;
         }

         this.beans =_.sortBy(this.beans, "priority")
         this.setBeans(this.beans);
         this.renderRows();
  	},
    
    /**
     *@memberOf ui.UITable
     */
    getItemOnCurrentPage : function(idx) {
      return this.pageList.getItemOnCurrentPage(idx).bean ;
    },

    
    /**
     *@memberOf ui.UITable 
     */
    render: function() {
      var params = {
        config:   this.config,
        pageList: this.pageList,
        tableId: this.tableId
      } ;
      $(this.el).html(this._template(params));
      $(this.el).trigger("create");
      this.renderRows() ;
      for(var i = 0; i < this.pageList.getPageSize(); i++) {
          var item = this.pageList.getItemOnCurrentPage(i).bean ;
        	  item.priority=i+1;
        }
    },
    
    renderRows: function() {
      var params = { 
        config:   this.config,
        state: this.state,
        pageList: this.pageList,
        tableId: this.tableId 
      } ;
      var tableBlock = $(this.el).find(".UITableRows");
      tableBlock.html(this._rows(params));
      tableBlock.trigger("create");
      
    },
    
    events: {
      'click  input.onBeanAction': 'onBeanAction'
    },

    onBeanAction: function(evt) {
    	
      var row      = parseInt($(evt.target).closest('tr').attr('row')) ;
      var item = this.getItemOnCurrentPage(row) ;
      var item1 = this.getItemOnCurrentPage(row-1) ;
      item.recycleBin = !item.recycleBin;
    },
   
    
    _toogleBlock: function(block) {
      if(block.css('display') == 'none') {
        block.css('display', 'block') ;
      } else {
        block.css('display', 'none') ;
      }
    },
    
    randomId: function() {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for( var i=0; i < 5; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }
  });
  
  return UITable ;
});