define([ 'jquery', 'underscore', 'backbone', 'i18n',
		'text!view/NavigationTemplate.jtpl',
		'text!module/account/ListMenu.jtpl', ], function($, _, Backbone, i18n,
		NavigationTemplate, ListMenu) {

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
			_.bindAll(this, 'render', 'onClickMenuItem', 'onMy', 'onMyTest', 'clickMenu');
			this.moduleManager = options.moduleManager;
		},

		events : {
			'click a.onClickMenuItem' : 'onClickMenuItem',
			'click a.onMy' : 'onMy',
			'click a.onMyTest' : 'onMyTest',
			'click a.clickMenu': 'clickMenu'
		},
		
		onClickMenuItem : function(evt) {
			console.log("1");
			var moduleId = $(evt.target).attr("moduleId");
			app.view.WorkspaceView.activateModule(moduleId);
		},
		onMy : function(evt) {
			app.view.WorkspaceView.activateMy();
		},
		
		onMyTest : function() {
			
		},
		clickMenu: function (evt){
			var menuId = $(evt.target).attr("nav-submenu");
			var listMenu = [];
			this.moduleManager.getModules().forEach(function(module) {
				if (module.config.name == menuId) {
					module.screens.forEach(function(screen) {
						listMenu.push(screen.config.name);
					});
				}
			});
			var ListMenuView = Backbone.View.extend({
				el : $("#workspace"),
				model : null,
				module: null,
				listMenuItem : [],
				_template : _.template(ListMenu),
				initialize : function() {
					_.bindAll(this, 'render','onClickMenuItem' );
					this.listMenuItem = listMenu;
					this.module=menuId;
					this.render();
				},
				render : function() {
					var params = {
						listMenuItem : this.listMenuItem,
						module: this.module
					};
					$(this.el).html(this._template(params));
					$(this.el).trigger("create");
				},
				events : {
					'click a.onClickMenuItem' : 'onClickMenuItem',
					'click div.onClickMenuItem' : 'onClickMenuItem',
				},
				onClickMenuItem : function(evt) {
					var moduleId = $(evt.target).attr("moduleId");
					app.view.WorkspaceView.activateModule(moduleId);
				},
				activate : function() {
					this.render();
				},

				deactivate : function() {
				}
			});
			new ListMenuView();
			
		},

	});

	return NavigationView;
});