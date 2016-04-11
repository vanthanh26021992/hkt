define([
  'jquery',
  'test/Site'
], function($, Site) {
  /**@type test.UnitTask */
  var UnitTask = Class.extend({
    name: 'UnitTask' ,
    /**@memberOf test.UnitTask */
    description: null,
    /**@memberOf test.UnitTask */
    units: [],
    init: function(config) {
      if(config.name != null) this.name = config.name ;
      if(config.description != null) this.description = config.description ;
      if(config.units != null) this.units = config.units ;
    },
    
    animateUnits: function(timeout) {
      if(timeout == undefined) timeout = 1000 ;
      var instance = this ;
      this.status = 'RUNNING' ;
      var i = 0;
      var doExecute = function() {
        var method = instance.units[i++] ;
        try {
          $('#page').find('[UnitTaskFocus]').css('opacity', '1') ;
          $('#page').find('[UnitTaskFocus]').removeAttr('UnitTaskFocus') ;
          method() ;
        } catch(e) {
          console.log(e.stack) ;
          instance.status = 'ERROR' ;
          return ;
        }
        if(i < instance.units.length) {
          setTimeout(doExecute, timeout); 
        } else {
          instance.status = 'OK' ;
        }
      };
      setTimeout(doExecute, 1000);
    },
    
    executeUnits: function() {
      this.status = 'RUNNING' ;
      try {
        for ( var i = 0; i < this.units.length; i++) {
          var method = this.units[i++];
          method();
        }
      } catch (e) {
        console.log(e.stack);
        this.status = 'ERROR';
        return false ;
      }
      this.status = 'OK';
      return true ;
    },
  });
  
  /**@type test.Suite */
  var Suite = Class.extend({
    /**@memberOf test.Suite */
    name: null ,
    /**@memberOf test.Suite */
    description: null,
    /**@memberOf test.Suite */
    unitTasks: [] ,
    
    /**@memberOf test.Suite */
    addUnits: function(units) {
      this.unitTasks.push(units) ;
    },
    
    
    /**@memberOf test.Suite */
    execute: function(config) {
      for(var i = 0; i < this.unitTasks.length; i++) {
        this.unitTasks[i].status = "INIT" ;
      }
      
      for(var i = 0; i < this.unitTasks.length; i++) {
        var task = this.unitTasks[i] ;
        if(!task.executeUnits()) break;
      }
      if(config != null && config.report) {
        this.report() ;
      }
    },
    
    /**@memberOf test.Suite */
    animate: function(timeout) {
      if(timeout == undefined) timeout = 1000 ;
      
      for(var i = 0; i < this.unitTasks.length; i++) {
        var unit = this.unitTasks[i] ;
        unit.status = 'INIT' ;
      }
      
      var instance = this ;
      instance.status = 'RUNNING' ;
      var currentIdx = 0 ;
      var doExecute = function() {
        if(currentIdx == instance.unitTasks.length) {
          instance.status = 'FINISH' ;
          instance.report() ;
          return ;
        }
        
        var unitTask = instance.unitTasks[currentIdx] ;
        if(unitTask.status == 'INIT') {
          unitTask.animateUnits(timeout) ;
        } else if(unitTask.status == 'ERROR') {
          instance.status = 'FINISH' ;
          instance.report() ;
          return ;
        } else if(unitTask.status == 'OK') {
          currentIdx++ ;
          doExecute() ;
          return ;
        }
        setTimeout(doExecute, timeout);
      };
      doExecute() ;
    },
    
    report: function() {
      Site.Navigation.clickMenuItem("admin", "Tests") ; 
      
      console.h2(this.name + ': ' + this.description) ;
      var cellWidth = [30, 10, 50] ;
      console.cells(["Name", "Status", "Description"], cellWidth) ;
      for(var i = 0; i < this.unitTasks.length; i++) {
        var unit = this.unitTasks[i] ;
        console.cells([unit.name, unit.status, unit.description], cellWidth) ;
      }
    }
  });
  
  var test = {
    UnitTask: UnitTask,
    Suite: Suite,
  };
  
  return test ;
});