define([
  'jquery', 
  'underscore', 
  'backbone',
  'module/Module',
  'ui/UIBreadcumbs',
  'ui/UITable',
  'test/Suites',
  'text!module/test/TestConsole.jtpl'
], function($, _, Backbone, module, UIBreadcumbs, UITable, Suites, TestConsoleTmpl) {
  var SuiteTable = UITable.extend({
    el: '#TestSuiteTable',
    label: "TestSuiteTable",
    config : {
      toolbar: {
        dflt: {
          actions: [
          ]
        }
      },
      bean: {
        fields: [
          { label: 'Name', field: 'name', toggled: true, filterable: true },
          { label: 'Status', field: 'status', toggled: true, filterable: true }
        ]
      }
    }
  }) ;
  
  /**@type view.TestConsole*/
  TestConsole = Backbone.View.extend({
    label: "Test Console", 
    //el: $("#TestConsole"),
    /**@type test.Suites*/
    Suites: Suites ,
    
    initialize: function () {
      _.bindAll(this, 'render', 'onCleanDBSuite', 'onRunScenario', 'onRunServiceAPISuite', 
                'onFastAnimateUISuite', 'onSlowAnimateUISuite') ;
      this.suiteTable = new SuiteTable() ;
      this.suiteTable.setBeans([]) ;
      this.render() ;
    },

    _template: _.template(TestConsoleTmpl),
  
    /**@memberOf view.TestConsole*/
    render: function() {
      var params = { Suites: this.Suites, selectSuite: this.selectSuite } ;
      $(this.el).html(this._template(params));
      $(this.el).trigger("create") ;
      this.suiteTable.setElement(this.$('.TestSuiteTable')).render();
    },
    
    /**@memberOf view.TestConsole*/
    updateSuiteTable: function() {
      this.suiteTable.setElement(this.$('.TestSuiteTable')).render();
    },
    
    events: {
      'click a.onRunSuite': 'onRunSuite',
      'click a.onCleanDBSuite': 'onCleanDBSuite',
      'click a.onRunScenario': 'onRunScenario',
      'click a.onRunServiceAPISuite': 'onRunServiceAPISuite',
      'click a.onFastAnimateUISuite': 'onFastAnimateUISuite',
      'click a.onSlowAnimateUISuite': 'onSlowAnimateUISuite'
    },
    
    onCleanDBSuite: function(ev) {
      console.log("Clean DB.....");
      this.Suites.cleanDB({report: true}) ;
    },
    
    onRunScenario: function(evt) {
      var scenario = this.$el.find('.SelectScenario').find(":selected").val() ;
      console.log('Run Scenario: ' + scenario);
      var suite = this.Suites.getScenarioSuite(scenario);
      
      this.Suites.cleanDB({report: true}) ;
      this.selectSuite = suite ;
      this.suiteTable.setBeans(suite.unitTasks) ;
      suite.execute({report: true}) ;
    } , 
    
    onRunServiceAPISuite: function(evt) {
      var module = this.$el.find('.SelectServiceAPI').find(":selected").val();
      if('all' == module) {
        for(var key in this.Suites.modules) {
          this.runServiceAPISuite(key) ;
        }
      } else {
        this.runServiceAPISuite(module) ;
      }
    } ,
    
    runServiceAPISuite: function(module) {
      var suite = this.Suites.getServiceAPISuite(module);
      
      this.Suites.cleanDB() ;
      this.Suites.getScenarioSuite('default').execute();
      
      this.selectSuite = suite ;
      this.suiteTable.setBeans(suite.unitTaska) ;
      this.suiteTable.render() ;
      suite.execute({report: true}) ;
    } ,
    
    onFastAnimateUISuite: function(evt) {
      this.animateUISuite(50) ;
    },
    
    onSlowAnimateUISuite: function(evt) {
      this.animateUISuite(1000) ;
    },
    
    animateUISuite: function(timeout) {
      var path = this.$el.find('.SelectUISuite').find(":selected").val();
      var name = path.split('/') ;
      if(name[0] == 'all') {
        this.Suites.animateAll(1000) ;
      } else {
        this.Suites.cleanDB() ;
        this.Suites.getScenarioSuite('default').execute();
        
        this.selectSuite = this.Suites.getUISuite(name[0], name[1]) ;
        this.suiteTable.setBeans(this.selectSuite.unitTasks) ;
        this.updateSuiteTable() ;
        
        this.selectSuite.animate(timeout) ;
      }
    },
  });
  
  var UITests = module.UIScreen.extend({
    initialize: function (options) {
      this.TestConsole = new TestConsole() ;
    },

    activate: function() { 
      this.viewStack = new UIBreadcumbs({el: "#workspace"}) ;
      this.viewStack.push(this.TestConsole) ;
    },
    
    deactivate: function() { }
    
  });
  
  return UITests ;
});