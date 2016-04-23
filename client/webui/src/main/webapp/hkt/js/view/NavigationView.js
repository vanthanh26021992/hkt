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
			var self = this;
			var res = i18n.getResource('view/navigation');
			var params = {
				res : res,
				moduleManager : this.moduleManager,
			};
			$(this.el).html(this._template(params));
			$(this.el).trigger("create");
			this.onLoadMenu();
			this.returnTimeNow();
		},

		initialize : function(options) {
			_.bindAll(this, 'render', 'onClickMenuItem', 'onMy', 'onMyTest',
					'clickMenu');
			this.moduleManager = options.moduleManager;
		},
		events : {
			'click a.onClickMenuItem' : 'onClickMenuItem',
			'click a.onMy' : 'onMy',
			'click a.onMyTest' : 'onMyTest',
			'click li.clickMenu' : 'clickMenu',
		},
		onLoadMenu : function() {

		},
		returnTimeNow : function() {
			function time() {
				var today = new Date();
				var dd = today.getDate();
				var mm = today.getMonth() + 1;
				var yyyy = today.getFullYear();
				var h = today.getHours();
				var m = today.getMinutes();
				var s = today.getSeconds();
				m = checkTime(m);
				s = checkTime(s);
				nowTime = h + ":" + m + ":" + s;
				if (dd < 10) {
					dd = '0' + dd
				}
				if (mm < 10) {
					mm = '0' + mm
				}
				today = dd + '/' + mm + '/' + yyyy;

				tmp = '<span class="date">' + today + ' | ' + nowTime
						+ '</span>';

				clocktime = setTimeout("time()", "500", "JavaScript");
				function checkTime(i) {
					if (i < 10) {
						i = "0" + i;
					}
					return i;
				}
				return tmp;
			}
			document.getElementById("timer").innerHTML = time();
			console.log(document.getElementById("timer").innerHTML);
		},
		onClickMenuItem : function(evt) {
			var moduleId = $(evt.target).attr("moduleId");
			app.view.WorkspaceView.activateModule(moduleId);
		},
		onMy : function(evt) {
			app.view.WorkspaceView.activateMy();
		},

		onMyTest : function() {

		},
		clickMenu : function(evt) {
			var menuId = $(evt.target).attr("nav-submenu");
			var listMenu = [];
			var listUnderMenuItems = [];
			var listUnderImages = [];
			var listImages = [];
			var moduleName = null;
			var moduleUnderName= null;
			this.moduleManager.getModules().forEach(function(module) {
				if (module.config.name == menuId) {
					moduleName = module.config.name;
					module.screens.forEach(function(screen) {
						if(screen.config.moduleName!= null)
							moduleUnderName =screen.config.moduleName;
						listUnderMenuItems.push(screen.config.underName);
						listUnderImages.push(screen.config.underIcon);
						listImages.push(screen.config.icon);
						listMenu.push(screen.config.name);
					});
				}
			});
			var ListMenuView = Backbone.View.extend({
				el : $("#workspace"),
				model : null,
				module : null,
				moduleName : null,
				moduleUnderName: null,
				listImages : [],
				listUnderImages : [],
				listUnderMenuItems : [],
				listMenuItem : [],
				_template : _.template(ListMenu),
				initialize : function() {
					_.bindAll(this, 'render', 'onClickMenuItem');
					this.listMenuItem = listMenu;
					this.module = menuId;
					this.moduleName = moduleName;
					this.listImages = listImages;
					this.listUnderImages = listUnderImages;
					this.listUnderMenuItems = listUnderMenuItems;
					this.moduleUnderName=moduleUnderName;
					this.render();
				},
				render : function() {
					var res = i18n.getResource('view/navigation');
					var params = {
						res : res,
						listMenuItem : this.listMenuItem,
						module : this.module,
						moduleName : this.moduleName,
						listImages : this.listImages,
						listUnderMenuItems : this.listUnderMenuItems,
						listUnderImages : this.listUnderImages,
						moduleUnderName: this.moduleUnderName
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