define([
  'jquery', 
  'underscore', 
  'backbone',
  'jqplot',
  'text!ui/UIReport.jtpl',
  'css!libs/jqplot/jquery.jqplot.css'
], function($, _, Backbone, jqplot, UIReportTmpl) {
  require([
      'libs/jqplot/plugins/jqplot.barRenderer.min', 
      'libs/jqplot/plugins/jqplot.pieRenderer.min', 
      'libs/jqplot/plugins/jqplot.logAxisRenderer.min', 
      'libs/jqplot/plugins/jqplot.categoryAxisRenderer.min', 
      'libs/jqplot/plugins/jqplot.canvasAxisTickRenderer.min', 
      'libs/jqplot/plugins/jqplot.canvasTextRenderer.min', 
      'libs/jqplot/plugins/jqplot.pointLabels.min', 
      'libs/jqplot/plugins/jqplot.enhancedLegendRenderer.min'
    ], 
    function () {
    }
  );
  
  var BarChart = function() {
    this.getChartData = function(chartConfig, data) {
      var colIdx = [] ;
      for(var i = 0; i < chartConfig.columns.length; i++) {
        for(var j = 0; j < data.headers.length; j++) {
          if(chartConfig.columns[i] == data.headers[j]) {
            colIdx.push(j) ;
            break ;
          }
        }
      }
      colIdx = colIdx.sort() ;
      
      var series = [] ;
      var sdata = [] ;
      for(var i = 0; i < data.rows.length; i++) {
        var row = data.rows[i] ;
        series.push( {label: row.name} ) ;
        var cells = [] ; 
        for(var j = 0; j < colIdx.length; j++) {
          cells.push(row.cells[colIdx[j]]) ;
        }
        sdata.push(cells); 
      }
      var chartData = {
        columns: chartConfig.columns,
        series: series ,
        data: sdata
      };
      return chartData ;
    };
    
    this.render = function(el, chartConfig, data) {
      var chartData = this.getChartData(chartConfig, data) ;
      var jqplotBarChartConfig = {
        title: chartConfig.label ,
        animate: chartConfig.animate,
        
        seriesDefaults:{
          renderer: $.jqplot.BarRenderer,
          pointLabels: { show: true },
          rendererOptions: { 
            fillToZero: true,
          }
        },
        
        series: chartData.series,
        
        legend: {
          show: true, location: 'nw', placement: 'inside'
        },
        axes: {
          xaxis: {
            renderer: $.jqplot.CategoryAxisRenderer,
            ticks: chartData.columns
          },
          yaxis: {
            pad: 1.05,
            tickOptions: { formatString: '%d' + chartConfig.dataUnit }
          }
        },
        highlighter: {
          tooltipAxes: 'x', formatString:'#serieLabel# - %s'
         }
      };
      
      el.unbind() ;
      el.empty() ;
      el.jqplot(chartData.data, jqplotBarChartConfig);
      
      var mouseover = function(evt, seriesIndex, tickIdx, data) {
        var serie = chartData.series[seriesIndex].label ;
        var tick  = chartConfig.columns[tickIdx] ;
        $('#info1').html(serie + ': '+ tick + ' = ' + data[1]);
      };
      el.bind('jqplotDataMouseOver', mouseover);
    };
  };
  
  var PieChart = function() {
    this.getChartData = function(chartConfig, chartData) {
      
    } ;
    
    this.render = function(el, chartConfig, chartData) {
      var data = [
        ['Heavy Industry', 12],['Retail', 9], ['Light Industry', 14], 
        ['Out of home', 16],['Commuting', 7], ['Orientation', 9]
      ];
      var pieChartConfig = {
        seriesDefaults: {
          renderer: jQuery.jqplot.PieRenderer, 
          rendererOptions: {
            // Turn off filling of slices.
            fill: true,
            showDataLabels: true, 
            // Add a margin to seperate the slices.
            sliceMargin: 20, 
            // stroke the slices with a little thicker line.
            lineWidth: 5
          }
        }, 
        legend: { show: true, location: 'e' }
      };
      el.unbind() ;
      el.empty() ;
      var plot2 = el.jqplot([data], pieChartConfig);
    };
  };
  
  var LineChart = function() {
    this.render = function(el, chartConfig, chartData) {
      var l2 = [11, 9, 5, 12, 14];
      var l3 = [4, 8, 5, 3, 6];
      var l4 = [12, 6, 13, 11, 2];    
      
      var lineChartConfig = {
    	// Co hien thi de cac dong len nhau hay ko? true = co
        stackSeries: false,
        showMarker: false,
        // Hien mau
        seriesDefaults: {
            fill: false
        },
        axes: {
          xaxis: {
            renderer: $.jqplot.CategoryAxisRenderer,
            ticks: ["Mon", "Tue", "Wed", "Thr", "Fri"]
          }
        }
      };

      el.unbind() ;
      el.empty() ;
      var plot1b = el.jqplot([l2, l3, l4], lineChartConfig);
      el.bind('jqplotDataHighlight', 
        function (ev, seriesIndex, pointIndex, data) {
          $('#info').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);
        }
      );
       
      el.bind('jqplotDataUnhighlight', 
        function (ev) {
          $('#info').html('Nothing');
        }
      );
    };
  };
  
  var LineChartTest = function() {
	    this.render = function(el, chartConfig, chartData) {
	      var l2 = [11, 9, 5, 12, 14];
	      var l3 = [4, 8, 5, 3, 6];
	      var l4 = [12, 6, 13, 11, 2];    
	      
	      var lineChartConfig = {
	        
	        stackSeries: false,
	        showMarker: false,
	        seriesDefaults: {
	            fill: false
	        },
	        axes: {
	        	legend: {
	            renderer: $.jqplot.EnhancedLegendRenderer,
	            ticks: ["Mon", "Tue", "Wed", "Thr", "Fri"]
	          }
	        }
	      };

	      el.unbind() ;
	      el.empty() ;
	      var plot1b = el.jqplot([l2, l3, l4], lineChartConfig);
	      el.bind('jqplotDataHighlight', 
	        function (ev, seriesIndex, pointIndex, data) {
	          $('#info').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data);
	        }
	      );
	       
	      el.bind('jqplotDataUnhighlight', 
	        function (ev) {
	          $('#info').html('Nothing');
	        }
	      );
	    };
	  };
  /**
   *@type ui.UIReport
   */
  var UIReport = Backbone.View.extend({
    /**
     *@memberOf ui.UIReport
     */
    initialize: function (options) {
      this.data = { headers: null, rows: []} ;
      _.bindAll(this, 'render', 'onDrawChart', 'onReport') ;
    },
    
    setHeaders: function(headers) {
      this.data.headers = headers;
    },
    
    addRow: function(name, cells) {
      this.data.rows.push({name: name, cells: cells }) ;
    },
    
    getChartConfig: function(name) {
      for(var i = 0; i < this.config.charts.length; i++) {
        var chart = this.config.charts[i] ;
        if(name == chart.name) return chart ;
      }
      return null ;
    },
    
    _template: _.template(UIReportTmpl),
    
    render: function() {
      var params = {
        config: this.config,
        data: this.data
      } ;
      $(this.el).html(this._template(params));
      $(this.el).trigger('create') ;
    },
    
    events: {
      'click .onReport': 'onReport',
      'click .onDrawChart': 'onDrawChart'
    },
    
    onReport: function(evt) {
      this.toggleSection('report') ;
    },
    
    onDrawChart: function(evt) {
      this.toggleSection('chart') ;
      var name = $(evt.target).closest('a').attr('chart') ;
      var chartConfig = this.getChartConfig(name) ;
      var el = $(this.el).find('.ChartContainer') ;
      if(chartConfig.type == 'bar') {
        new BarChart().render(el, chartConfig, this.data) ;
      } else if(chartConfig.type == 'pie') {
        new PieChart().render(el, chartConfig, this.data) ;
      } else if(chartConfig.type == 'line') {
        new LineChart().render(el, chartConfig, this.data) ;
      }
    },
    
    toggleSection: function(name) {
      var reportSection = $(this.el).find('.ReportSection') ;
      var chartSection  = $(this.el).find('.ChartSection') ;
      if(name == 'chart') {
        reportSection.css('display', 'none') ;
        chartSection.css('display', 'block') ;
      } else {
        reportSection.css('display', 'block') ;
        chartSection.css('display', 'none') ;
      }
    },
  });
  
  return UIReport ;
});