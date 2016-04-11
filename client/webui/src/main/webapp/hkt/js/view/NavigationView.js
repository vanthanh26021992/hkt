define([ 'jquery', 'underscore', 'backbone', 'i18n',
		'text!view/NavigationTemplate.jtpl',
		'text!module/account/ListMenu.jtpl' ], function($, _, Backbone, i18n,
		NavigationTemplate) {

	NavigationMenu = Backbone.Model.extend({
		menu : null
	});

	/**
	 * @type view.NavigationView
	 * @constructor
	 */
	NavigationView = Backbone.View.extend({
		el : $("#navspace"),
		model : null,

		/** @type module.ModuleManager */
		moduleManager : null,

		_template : _.template(NavigationTemplate),

		toggleNav : function() {
			var hide = "none" == $("#navspace").css("display");
			if (hide) {
				var navWidth = 0;
				$("#navspace").css("display", "block");
				var navShow = function() {
					navWidth += 30;
					$("#navspace").width(navWidth);
					$("#workspace").css("margin-left", navWidth + 30 + "px");
					if (navWidth >= 200) { // check finish condition
						clearInterval(id);
					}
				};
				var id = setInterval(navShow, 20);
			} else {
				var navWidth = 200;
				var navHide = function() {
					navWidth -= 30;
					$("#navspace").width(navWidth);
					$("#workspace").css("margin-left", navWidth + "px");
					if (navWidth <= 0) { 
						clearInterval(id);
						$("#navspace").css("display", "none");
					}
				}
				var id = setInterval(navHide, 20);
			}
		},

		/** @memberOf view.NavigationView */
		render : function() {
			var res = i18n.getResource('view/navigation');
			var params = {
				res : res,
				moduleManager : this.moduleManager
			};
			$(this.el).html(this._template(params));
			$(this.el).trigger("create");
		},

		initialize : function(options) {
			_.bindAll(this, 'render', 'onClickMenuItem', 'onMy');
			this.moduleManager = options.moduleManager;
		},

		events : {
			'click a.onClickMenuItem' : 'onClickMenuItem',
			'click a.onMy' : 'onMy',
			'click a.onMyTest': 'onMyTest'
		},

		onClickMenuItem : function(evt) {
			var moduleId = $(evt.target).attr("moduleId");
			app.view.WorkspaceView.activateModule(moduleId);
		},

		onMy : function(evt) {
			app.view.WorkspaceView.activateMy();
		},
		onMyTest: function(evt){
			app.view.WorkspaceView.activateMy();
		}
		
	});

	return NavigationView;
});
