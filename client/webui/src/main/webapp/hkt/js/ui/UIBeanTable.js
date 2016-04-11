define([
	'jquery', 'underscore', 'backbone', 'ui/UIBeanExt', 'text!ui/UIBeanTable.jtpl', 'css!ui/UIBeanTable.css'
], function($,_,Backbone,UIBeanExt,UITreeTableTmpl,UITestBean) {
	var UITableBean = UIBeanExt.extend({
		config : {
			beans : {
				bean : {
					fields : []
				}
			}
		},

		init : function(UITable,bean,index,row) {
			this.row = row;
			this.UITable = UITable;
			this.label = UITable.config.bean.label;
			this.config.beans.bean.fields[0] = UITable.config.bean.fields[index];

			this.bind('bean', bean, true);
			this.getBeanState('bean').editMode = true;

			return this;
		},

		setUILoad : function(UILoad,valueTarget) {
			this.UILoad = UILoad;
			this.valueTarget = valueTarget;
		},

		load : function() {
			if (this.UILoad) {
				var target = 0;
				for (var x = 0; x < this.UILoad.length - 1; x++) {
					var bean = this.UILoad[x].getBean('bean');
					var a = this.UILoad[x].config.beans.bean.fields[0].field;
					var value = bean[a];
					target = Number(target) + Number(value);
				}
				var cl = Number(this.valueTarget) - Number(target);
				var beanLoad = this.UILoad[this.UILoad.length - 1].getBean('bean');
				var aLoad = this.UILoad[this.UILoad.length - 1].config.beans.bean.fields[0].field;
				beanLoad[aLoad] = cl;
				this.UILoad[this.UILoad.length - 1].render();
			}

		}
	});

	var Node = function(id,bean,name,index,icon) {
		this.bean = bean;
		this.name = name;
		this.id = id;
		this.index = index;
		this.children = [];
		this.collapsed = true;
		this.icon = icon;

		this.addChild = function(bean,name) {
			var childId = this.id + "_" + this.children.length;
			var child = new Node(childId, bean, name, this.index + 1);
			this.children.push(child);
			return child;
		};
		this.addChild = function(bean,name,icon) {
			var childId = this.id + "_" + this.children.length;
			var child = new Node(childId, bean, name, this.index + 1, icon);
			this.children.push(child);
			return child;
		};

		this.getChildren = function() {
			return this.children;
		};

		this.isCollapsed = function() {
			return this.collapsed;
		};

		this.setCollapsed = function(collapsed) {
			this.collapsed = collapsed;
		};

		this.toggleCollapsed = function() {
			this.collapsed = !this.collapsed;
		};

		this.findDescendant = function(id) {
			if (this.id == id)
				return this;
			for (var i = 0; i < this.children.length; i++) {
				var found = this.children[i].findDescendant(id);
				if (found != null)
					return found;
			}
			return null;
		};
	};
	/**
	 * @type widget.UITreeTable
	 */
	var UITreeTable = Backbone.View.extend({

		initialize : function(options) {
			this.nodes = [];
			this.k = 0;
			this.UIContainer = [];
			this.nameContainer = [];
			_.bindAll(this, 'render', 'onDfltToolbarAction', 'onCollapseDelete', 'onCollapseExpand', 'save', 'reset');

		},

		getNodes : function() {
			return this.nodes;
		},

		addNode : function(bean,name) {
			var id = this.nodes.length;
			var node = new Node(id, bean, name, 0, "");
			this.nodes.push(node);
			return node;
		},

		setBeans : function(beans) {
			this.k = 0;
			this.UIContainer = [];
			this.nameContainer = [];
			this.nodes = [];
			var pageSize = beans.length;
			if (pageSize > 1) {
				for (var i = 0; i < beans.length; i++) {
					var node = this.addNode(beans[i], "");
					for (var j = 0; j < this.config.bean.fields.length; j++) {
						var h = this.k + j;
						this.UIContainer[h] = new UITableBean().init(this, beans[i], j, node.id);
						this.nameContainer[h] = "UIContainer" + h;
					}
					this.k = this.k + this.config.bean.fields.length;
				}
			} else {
				for (var i = 0; i < beans.length; i++) {
					var node = this.addNode(beans[i], beans[i].name);
				}
				for (var j = 0; j < this.config.bean.fields.length; j++) {
					this.UIContainer[j] = new UITableBean().init(this, {}, j, 0);
					this.nameContainer[j] = "UIContainer" + j;
				}
			}
		},

		_template : _.template(UITreeTableTmpl),

		render : function() {
			var params = {
				config : this.config, nodes : this.nodes, nameContainer : this.nameContainer
			};

			$(this.el).html(this._template(params));
			$(this.el).trigger("create");
			for (var i = 0; i < this.UIContainer.length; i++) {
				this.UIContainer[i].setElement(this.$('.' + this.nameContainer[i])).render();
			}

		},

		events : {
			'click a.onCollapseExpand' : 'onCollapseExpand', 'click a.onCollapseDelete' : 'onCollapseDelete',
			'click  a.onDfltToolbarAction' : 'onDfltToolbarAction', 'click  a.save' : 'save', 'click  a.reset' : 'reset',
		},

		onCollapseExpand : function(evt) {
			var b = {};
			var node = this.addNode(b, "");
			this.k = this.k + this.config.bean.fields.length;
			for (var j = 0; j < this.config.bean.fields.length; j++) {
				var h = this.k + j;
				this.UIContainer[h] = new UITableBean().init(this, {}, j, node.id);
				this.nameContainer[h] = "UIContainer" + h;
			}

			this.render();
		},

		addRow : function(a) {
			var node = this.addNode(a, "");
			this.k = this.k + this.config.bean.fields.length;
			for (var j = 0; j < this.config.bean.fields.length; j++) {
				var h = this.k + j;
				this.UIContainer[h] = new UITableBean().init(this, a, j, node.id);
				this.nameContainer[h] = "UIContainer" + h;
			}

			// this.render() ;
		},

		onCollapseDelete : function(evt) {
			var nodeId = $(evt.target).attr('nodeId');
			var node = this._findNode(nodeId);
			for (var j = 0; j < this.UIContainer.length;) {
				if (node.id == this.UIContainer[j].row) {
					this.UIContainer.splice(j, 1);
					this.nameContainer.splice(j, 1);
				} else {
					j++;
				}
			}
			this.nodes.splice(node.id, 1);
			this.k = this.k - this.config.bean.fields.length;
			this.nameContainer = [];
			for (var j = 0; j < this.UIContainer.length; j++) {
				this.nameContainer[j] = "UIContainer" + j;
			}
			for (var j = 0; j < this.nodes.length; j++) {
				var a = this.nodes[j].id;
				this.nodes[j].id = j;
				for (var h = 0; h < this.UIContainer.length; h++) {
					if (this.UIContainer[h].row == a) {
						this.UIContainer[h].row = j;
					}
				}
			}

			this.render();
		},

		onDfltToolbarAction : function(evt) {
			var actionIdx = parseInt($(evt.target).closest('a').attr('action'));
			var actions = this.config.toolbar.dflt.actions;
			actions[actionIdx].onClick(this);
		},

		_findNode : function(nodeId) {
			for (var i = 0; i < this.nodes.length; i++) {
				var found = this.nodes[i].findDescendant(nodeId);
				if (found != null)
					return found;
			}
			return null;
		},

		save : function(evt) {

		}, reset : function(evt) {

		},
	});

	return UITreeTable;
});
