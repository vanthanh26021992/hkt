define([
  'jquery',
  'test/Assert'
], function($, Assert) {
  var focusElement = function(el) {
    el.css('opacity', '0.3') ;
    el.attr('UnitTaskFocus', 'true') ;
  };
  
  var Block = function(el) {
    this.el = el ;
    
    this.find = function(selector) {
      var block = this.el.find(selector);
      return new Block(block) ;
    };
    
    this.clickButton = function(text) {
      var a = this.el.find('a:contains("' + text + '")');
      Assert.assertTrue(a.length > 0, "Expect to find the button " + text) ;
      focusElement(a) ;
      a.click ();
    };
    
    this.clickLink = function(text) {
      var a = this.el.find('a:contains("' + text + '")');
      Assert.assertTrue(a.length > 0, "Expect to find the button " + text) ;
      focusElement(a) ;
      a.click ();
    };
    
    this.toolbarWith = function(text) {
      var ele = this.el.find("[data-role='controlgroup']");
      Assert.assertTrue(ele.length > 0, "Expect to find block with text " + text) ;
      ele = this.el.find(":contains('" + text + "')");
      Assert.assertTrue(ele.length > 0, "Expect to find block with text " + text) ;
      return new Block(ele) ;
    };
    
    this.formWithText = function(text) {
      var ele = this.el.find(':contains("' + text + '")');
      Assert.assertTrue(ele.length > 0, "Expect to find form with text " + text) ;
      var form = ele.closest('form') ;
      Assert.assertTrue(form.length > 0, "Expect to find form with text " + text) ;
      return new Block(form) ;
    };
    
    this.collapsibleBlock = function(header) {
      var ele = this.el.find('div.UICollapsibleBlock h4:contains("' + header + '")');
      Assert.assertTrue(ele.length > 0, "Expect to find collapsible block with header " + header) ;
      var block = ele.closest('div.UICollapsibleBlock') ;
      return new Block(block) ;
    };
    
    this.tableWithHeader = function(header) {
      var ele = this.el.find('table th:contains("' + header + '")');
      Assert.assertTrue(ele.length == 1, "Expect to find table with header " + header) ;
      var table = ele.closest('table') ;
      return new Block(table) ;
    };
    
    this.tableToolbar = function(text) {
      var ele = this.el.find('.UITable .Toolbar:contains("' + text + '")');
      Assert.assertTrue(ele.length == 1, "Expect to find the table toolbar with text " + text) ;
      return new Block(ele) ;
    };
    
    this.tableToolbars = function(text) {
      var ele = this.el.find('.UITableToolbars:contains("' + text + '")');
      Assert.assertTrue(ele.length == 1, "Expect to find the table toolbars with " + text) ;
      return new Block(ele) ;
    };
    
    this.tableRowWithText = function(text) {
      var ele = this.el.find('tr:contains("' + text + '")');
      Assert.assertTrue(ele.length == 1, "Expect to find one row with text " + text + ', but found ' + ele.length) ;
      var row = ele.closest('tr') ;
      return new Block(row) ;
    };
    
    this.inputVal = function(name, val){
      var input = this.el.find("[name=" + name + "]") ;
      Assert.assertTrue(input.length == 1, "Expect to find the only 1 input with name " + name + ', but found ' + input.length) ;
      focusElement(input) ;
      input.val(val) ;
      input.blur() ;
    };
    
    this.selectVal = function(name, val){
      var select = this.el.find("[name=" + name + "]") ;
      Assert.assertTrue(select.length == 1, "Expect to find the select input with name " + name) ;
      focusElement(select) ;
      select.find('option[value='+val+']').attr('selected', 'selected');
      select.selectmenu( "refresh", true );
      select.blur() ;
    };
    
    this.html = function() { 
      return this.el.html() ;
    };
  };
  
  /**@type test.Site */
  var Site = {
    Banner : {
      el: "#BannerView",
      
      clickButton: function(label) {
        var found = null ;
        var buttons = $(this.el).find("a[data-role=button]") ;
        console.log(buttons.length) ;
        for (var i = 0;  i < buttons.length; i++) {
          var text = $(buttons[i]).text().trim() ;
          if(text == label) {
            found = $(buttons[i]) ;
            break  ;
          }
        }
          
        if(found != null) {
          if (found.attr ('onclick') === undefined ) {
            document.location = found.attr('href' );
          } else {
             found.click ();
          }
        }
      }
    },
    
    /**@type test.Site.Navigation */
    Navigation: {
      el: "#navspace" ,
      
      clickMenu: function(menu, trigger) {
        var navMenu = $(this.el).find("h3[nav-submenu=" + menu + "]");
        if(navMenu === undefined) {
          throw new Exception("Cannot find the menu " + menu) ;
        }
        $(navMenu).trigger(trigger);
      },
      
      expandMenu: function(menu) { this.clickMenu(menu, 'expand'); },
      
      collapseMenu: function(menu) { this.clickMenu(menu, 'collapse'); },
     
      /**@memberOf test.Site.Navigation */
      clickMenuItem: function(menu, item) {
        this.expandMenu(menu) ;
        var block = $(this.el).find("h3:contains(" + menu + ")").parent() ;
        var a = block.find('a:contains("' + item + '")');
        focusElement(a) ;
        a.click ();
      }
    },
    
    /**@type test.Site.Workspace */
    Workspace: new Block($("#workspace")),
    PopupPanel: new Block($("#PopupPanel"))
  } ;
  
  return Site ;
});