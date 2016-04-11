define([
	'jquery', 'underscore', 'backbone', 'text!ui/UICollapsible.jtpl',
], function($,_,Backbone,UICollapsibleTmpl) {
	/**
	 * @type ui.UICollapsible
	 */
	var UICollapsible = Backbone.View.extend({

		initialize : function(options) {
			this.clear();
			this.onInit(options);
			_.bindAll(this, 'render', 'onToggleBlock', 'onAction');
		},

		onInit : function(options) {
		},

		add : function(component,collapsed,isChange) {
			component.collapible = {};
			if (isChange!=null){
				component.isChange = isChange;
			}else{
				component.isChange = true;
			}
			if (collapsed)
				component.collapible.collapsed = true;
			this.components.push(component);
		},

		hidenButton : function(name,bool) {
			var config = this.config.actions;
			for (var i = 0; i < config.length; i++) {
				if (config[i].action == name) {
					config[i].hidden = bool;
				}
			}
		}, disableButton : function(name,bool) {
			var config = this.config.actions;
			for (var i = 0; i < config.length; i++) {
				if (config[i].action == name) {
					config[i].disable = bool;
				}
			}
		}, showButton : function() {
			var config = this.config.actions;
			for (var i = 0; i < config.length; i++) {
				config[i].hidden = false;
			}
		}, setActionHidden : function(actionName,bool) {
			if (this.state.actions[actionName] == null) {
				this.state.actions[actionName] = {};
			}
			this.state.actions[actionName].hidden = bool;
		},

		clear : function() {
			this.components = [];
			this.state = {
				actions : {}
			};
		},

		_template : _.template(UICollapsibleTmpl),

		render : function() {
			var params = {
				title : this.label, config : this.config, state : this.state, components : this.components
			};
			$(this.el).html(this._template(params));
			$(this.el).trigger("create");

			for (var i = 0; i < this.components.length; i++) {
				var comp = this.components[i];
				var blockClass = '.UICollapsibleBlockContent' + i;
				comp.setElement(this.$(blockClass)).render();
			}
		},

		events : {
			'click a.onToggleBlock' : 'onToggleBlock', 'click a.onAction' : 'onAction',
		},

		onToggleBlock : function(evt) {
			var compIdx = $(evt.target).closest("a").attr("component");
			if (!this.components[compIdx].isChange) {
				return;
			}
			this.components[compIdx].collapible.collapsed = !this.components[compIdx].collapible.collapsed;
			var blockClass = '.UICollapsibleBlockContent' + compIdx;
			if (this.components[compIdx].collapible.collapsed) {
				$(evt.target).closest("a").buttonMarkup({
					icon : "plus"
				});
				this.$(blockClass).css("display", "none");
			} else {
				$(evt.target).closest("a").buttonMarkup({
					icon : "minus"
				});
				this.$(blockClass).css("display", "block");
			}
		},

		onAction : function(evt) {
			var actionName = $(evt.target).closest('a').attr('action');
			var actions = this.config.actions;
			for (var i = 0; i < actions.length; i++) {
				if (actions[i].action == actionName) {
					actions[i].onClick(this);
					return;
				}
			}
		}
	});

	return UICollapsible;
});