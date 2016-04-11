define([
  'jquery', 
  'underscore', 
  'backbone',
  'moment',
  'text!ui/UIReportTable.jtpl',
  'text!ui/UIReportTableData.jtpl',
  'css!ui/UIReportTable.css'
], function($, _, Backbone, moment, UIReportTableTmpl, UIReportTableDataTmpl) {  
  var CompareTransform = function(fields, keyFields, compareField, valueField) {
    this.fieldMap = {} ;
    this.keyFields = keyFields ;
    this.compareField = compareField;
    this.valueField   = valueField ;
    this.newFields = {} ;
    
    this.fields  = [] ;
    this.records = [] ;
    
    for(var i = 0; i < fields.length; i++) {
      var field = fields[i] ;
      this.fieldMap[field.label] = field ;
    }
    
    this.transform = function(records) {
      for(var i = 0; i < records.length; i++) {
        this._addRecord(records[i]) ;
      }
      for(var i = 0; i < this.keyFields.length; i++) {
        this.fields.push(this.fieldMap[this.keyFields[i]]) ;
      }
      for(var newField in this.newFields) {
        this.fields.push(this.newFields[newField]) ;
      }
    };
    
    this._addRecord = function(record) {
      var newRecord  = null ;
      for(var i = 0; i < this.records.length; i++) {
        var sel = this.records[i] ;
        var match = true ;
        for(var j = 0; j < this.keyFields.length; j++) {
          var field = this.keyFields[j] ;
          if(sel[field] != record[field]) {
            match = false ;
            break ;
          }
        }
        if(match) {
          newRecord = sel ;
          break ;
        }
      }
      if(newRecord == null) {
        newRecord = {} ;
        for(var i = 0; i < this.keyFields.length; i++) {
          newRecord[this.keyFields[i]] = record[this.keyFields[i]] ;
        }
        this.records.push(newRecord) ;
      }
      newRecord[record[compareField]] = record[valueField] ;
      if(this.newFields[record[compareField]] == null) {
        this.newFields[record[compareField]] = {
          label: record[compareField], type: 'number'
        } ;
      }
    }
  };
  
  var ReportData = function(fields, records) {
    this.fields = fields ;
    this.records = records ;
    
    this.displayFields = fields.slice() ; //clone fields
    this.displayRecords = records ;
    
    this.hasField = function(field) {
      for(var i = 0; i < this.fields.length; i++) {
        if(this.fields[i].label == field) return true ;
      }
      return false;
    };
    
    this.setDisplayFieldVisible = function(field, visible) {
      if(this.displayFields[field]) {
        this.displayFields[field].visible = visible ;
      }
    };
    
    this.groupByCompare = function(keyFields, compareField, valueField) {
      var transformer = 
        new CompareTransform(this.fields, keyFields, compareField, valueField) ;
      transformer.transform(this.records) ;
      this.displayFields = transformer.fields ;
      this.displayRecords = transformer.records ;
    };
  };
  
  /**
   *@type ui.UIReportTable 
   */
  var UIReportTable = Backbone.View.extend({
    initialize: function (options) {
      this.reportId = this.randomId() ;
      _.bindAll(this, 'render', 'onToggleQueryOption', 'onSelectReport', 
                'onSelectDateRange', 'onChangeOptionInput', 'onClickAction') ;
    },
    
    setReportData: function(data) {
      this.createReportDataByQueryResult(data) ;
      //console.log('This method will be removed , use setReportDataByQueryResult(..)')
    },
    
    createReportDataByQueryResult: function(data) {
      var fields = [] ;
      for(var i = 0; i < data.query.fields.length; i++) {
        var field = data.query.fields[i] ;
        fields[i] = { label: field.alias, type: field.type };
      }
      var records = [] ;
      for(var i = 0; i < data.records.length; i++) {
        var record = data.records[i];
        records[i] = record ;
      }
      this.reportData = new ReportData(fields, records) ;
      return this.reportData ;
    },
    
    getReportData: function() { return this.reportData ; },
    
    _template: _.template(UIReportTableTmpl),
    
    _dataTemplate: _.template(UIReportTableDataTmpl),
    
    /**
     *@memberOf ui.UITable 
     */
    render: function() {
      if(this.selectedReport == null) {
        var defaultName = this.reportGroups[0].reports[0].uiconfig.name ;
        this.selectedReport = this._getReportStateByName(defaultName) ;
      }
      var params = {
        reportId: this.reportId,
        reportGroups: this.reportGroups,
        selectedReport:  this.selectedReport
      } ;
      $(this.el).html(this._template(params));
      $(this.el).trigger("create");
      this.renderReportData() ;
    },
    
    renderReportData: function() {
      if(this.reportData == null) return ;
      var params = {
        reportId: this.reportId,
        reportGroups: this.reportGroups,
        selectedReport:  this.selectedReport,
        data: this.reportData
      } ;
      var tableBlock = $(this.el).find(".UIReportTableData");
      tableBlock.html(this._dataTemplate(params));
      tableBlock.trigger("create");
    },
    
    events: {
      'click  a.onToggleQueryOption': 'onToggleQueryOption',
      'change select.onSelectReport': 'onSelectReport',
      'change select.onSelectDateRange': 'onSelectDateRange',
      'click  a.onClickAction': 'onClickAction',
      'blur   .onChangeOptionInput': 'onChangeOptionInput',
    },
    
    onToggleQueryOption: function(evt) {
      var toolbar = $(evt.target).closest('div.Toolbar') ;
      this._toogleBlock(toolbar.find('div.QueryOption')) ;
    },
    
    onSelectReport: function(evt) {
      var reportName = $(evt.target, ".onSelectReport").find(":selected").attr("value") ;
      this.selectedReport = this._getReportStateByName(reportName) ;
      this.render() ;
    },
    
    onSelectDateRange: function(evt) {
      var dateRange = $(evt.target, ".onSelectDateRange").find(":selected").attr("value") ;
      var toolbarBlock = $(evt.target).closest('.Toolbar') ;
      var state = this.selectedReport.state ;
      var fromDate = moment() ;
      if('currentMonth' == dateRange) {
        fromDate.set('date', 1) ;
      } else if('last3Month' == dateRange) {
        fromDate.subtract('months', 3) ;
      } else if('currentYear' == dateRange) {
        fromDate.set('date', 1) ;
        fromDate.set('month', 0) ;
      } else {
        state.fromDate = null ;
        toolbarBlock.find("input[name=fromDate]").val(state.fromDate) ;
        state.toDate = null ;
        toolbarBlock.find("input[name=toDate]").val(state.toDate) ;
        return ;
      }
      state.fromDate = fromDate.format("DD/MM/YYYY") ;
      toolbarBlock.find("input[name=fromDate]").val(state.fromDate) ;
      
      state.toDate = null ;
      toolbarBlock.find("input[name=toDate]").val(state.toDate) ;
    },
    
    onClickAction: function(evt) {
      var actionName = $(evt.target).closest("a[name]").attr('name') ;
      var action = this._getActionByName(actionName) ;
      action.onClick(this, this.selectedReport.report, this.selectedReport.state) ;
      this.renderReportData() ;
    },
    
    onChangeOptionInput: function(evt) {
      var reportState = this.selectedReport ;
      var name = $(evt.target).attr('name') ;
      var value = $(evt.target).val() ;
      reportState.state[name] = value ;
    },
    
    _getReportStateByName: function(name) {
      if(this.reportStates == null) this.reportStates = {} ;
      if(this.reportStates[name] != null) return this.reportStates[name] ; 
      for(var k = 0; k < this.reportGroups.length; k++) {
        var reportGroup = this.reportGroups[k] ;
        var reports = reportGroup.reports ;
        for(var i = 0; i < reports.length; i++) {
          if(reports[i].uiconfig.name == name) {
            this.reportStates[name] = {
              report: reports[i],
              state: {}
            };
            return this.reportStates[name] ;
          }
        }
      }
      throw new Error("Cannot find the report " + name) ;
    },
    
    _getActionByName: function(name) {
      var actions = this.selectedReport.report.uiconfig.actions ;
      for(var i = 0; i < actions.length; i++) {
        if(actions[i].name == name) return actions[i] ;
      }
      return null ;
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
  
  return UIReportTable ;
});