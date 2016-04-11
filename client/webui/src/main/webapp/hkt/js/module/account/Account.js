/**
 *  Design by Bui Trong Hieu
 */
define(
	[
		'jquery', 'underscore', 'backbone', 'i18n', 'service/service', 'ui/UITable', 'ui/UIPopup', 'ui/UICollapsible',
		'ui/UIBean', 'util/DateTime', 'module/account/Membership',
	],
	function($, _, Backbone, i18n, service, UITable, UIPopup, UICollapsible, UIBean, DateTime, Membership) {

		var res = i18n.getResource('module/account/account');

		var UIAccount = UIBean.extend({
			label : res('UIAccount.label'), config : {
				beans : {
					account : {
						label : res('UIAccount.label'), fields : [
							{
								field : "loginId", label : res('UIAccount.field.loginId'), required : true, validator : {
									name : "empty"
								}
							}, {
								field : "password", label : res('UIAccount.field.password'), required : true, validator : {
									name : "empty"
								}
							}, {
								field : "email", label : res('UIAccount.field.email')
							}
						], edit : {
							disable : true, actions : [],
						}
					}
				},
			},

			init : function(UIParent, account, isConfig) {
				this.UIParent = UIParent;
				this.bind('account', account);
				this.getBeanState('account').editMode = true;
				var config = this.getBeanConfig('account');
				if (!isConfig) {
					for (var i = 0; i < config.beanConfig.fields.length; i++) {
						config.disableField(config.beanConfig.fields[i].field, true);
					}
				}
				return this;
			},

		});

		var UIUserBasic = UIBean.extend({
			label : res('UIUserBasic.label'), config : {
				beans : {
					basic : {
						label : 'Thông tin cá nhân', fields : [
							{
								field : "firstName", label : res('UIUserBasic.field.firstName')
							}, {
								field : "lastName", label : res('UIUserBasic.field.lastName')
							}, {
								field : "gender", label : res('UIUserBasic.field.gender'), defaultValue : "male", select : {
									getOptions : function(field, bean) {
										var options = [
											{
												label : "Nam", value : 'male'
											}, {
												label : "Nữ", value : 'female'
											}, {
												label : "Khác", value : 'order'
											},
										];
										return options;
									}
								}, custom : {
									set : function(bean, thisUI) {
									}, getDisplay : function(bean) {
										if (bean.type == null) {
											return null;
										} else {
											if (bean.gender == "male") {
												return "Nam";
											} else if (bean.gender == "female") {
												return "Nữ";
											} else {
												return "Khác";
											}
										}
									}
								}
							}, {
								field : "birthday", label : res('UIUserBasic.field.birthday'), datepicker : {
									getDate : function(bean) {
										return DateTime.fromDateTimeToDDMMYYYY(bean.birthday);
									}, setDate : function(date, bean) {
										bean.birthday = DateTime.fromDDMMYYYYToDateTime(date);
									},
								}
							},
							//            { field: "avatar",   label: res('UIUserBasic.field.avatar')},
							{
								field : "weight", label : res('UIUserBasic.field.weight'), defaultValue : 0, validator : {
									name : 'number', from : 0, errorMsg : "Nhập số"
								}
							}, {
								field : "height", label : res('UIUserBasic.field.height'), defaultValue : 0, validator : {
									name : 'number', from : 0, errorMsg : "Nhập số"
								}
							}, {
								field : "personalId", label : res('UIUserBasic.field.personalId')
							}, {
								field : "hobby", label : res('UIUserBasic.field.hobby'), textarea : {}
							}
						]
					}
				}
			},

			init : function(profile, isNew) {
				this.bind('basic', profile);
				this.getBeanState('basic').editMode = true;
				var config = this.getBeanConfig('basic');
				if (!isNew) {
					for (var i = 0; i < config.beanConfig.fields.length; i++) {
						config.disableField(config.beanConfig.fields[i].field, true);
					}
				}

				return this;
			}
		});

		var UIUserRelationship = UITable.extend({
			label : res('UIUserRelationship.label'),
			config : {
				toolbar : {
					dflt : {
						actions : [
							{
								action : "onNew", icon : "plus", label : res('UIUserRelationship.action.onNew'),
								onClick : function(thisTable) {
									thisTable.onAddBean();
								}
							}
						]
					},
					filter : {
						fields : [
							{
								field : "relation", label : res('UIUserRelationship.field.relation'), type : 'string',
								operator : 'LIKE'
							}
						], onFilter : function(thisTable, query) {
							console.log('onFilter');
						},
					}
				},

				bean : {
					label : 'Quan hệ gia đình',
					fields : [
						{
							field : "relation", label : res('UIUserRelationship.field.relation'), toggled : true, filterable : true
						},
						{
							field : "gender", label : res('UIUserRelationship.field.gender'), toggled : true, filterable : true,
							defaultValue : "Nam", select : {
								getOptions : function(field, bean) {
									var options = [
										{
											label : "Nam", value : 'male'
										}, {
											label : "Nữ", value : 'female'
										}, {
											label : "Khác", value : 'order'
										},
									];
									return options;
								}
							}, custom : {
								set : function(bean, thisUI) {
								}, getDisplay : function(bean) {
									if (bean.type == null) {
										return null;
									} else {
										if (bean.gender == "male") {
											return "Nam";
										} else if (bean.gender == "female") {
											return "Nữ";
										} else {
											return "Khác";
										}
									}
								}
							}
						},
						{
							field : "firstName", label : res('UIUserRelationship.field.firstName'), toggled : true, filterable : true
						},
						{
							field : "lastName", label : res('UIUserRelationship.field.lastName'), toggled : true, filterable : true
						},
						{
							field : "birthday", label : res('UIUserRelationship.field.birthday'), toggled : true, filterable : true,
							datepicker : {
								getDate : function(bean) {
									return DateTime.fromDateTimeToDDMMYYYY(bean.birthday);
								}, setDate : function(date, bean) {
									bean.birthday = DateTime.fromDDMMYYYYToDateTime(date);
								},
							}
						},
						{
							field : "occupation", label : res('UIUserRelationship.field.occupation'), toggled : true,
							filterable : true
						}
					], actions : [
						{
							icon : "delete", label : "Xóa", onClick : function(thisTable, row) {
								thisTable.removeItemOnCurrentPage(row);
							}
						}, {
							icon : "edit", label : "Sửa", onClick : function(thisTable, row) {
								thisTable.onEditBean(row);
							}
						}
					]
				}
			}, init : function(account, isPopup) {
				this.account = account;
				this.setBeans(account.profiles.userRelationships, isPopup);
				return this;
			}

		});

		var UIAccountGroup = UITable
			.extend({
				label : "Phòng ban",
				config : {
					toolbar : {
						dflt : {
							actions : [
								{
									action : "onNew", icon : "plus", label : "Thêm mới", onClick : function(thisTable) {
										thisTable.onAddBean();
									}
								}
							]
						}
					},

					bean : {
						label : 'Phòng ban',
						fields : [
							{
								field : "name", label : "Phòng ban", toggled : true, filterable : true, custom : {
									getDisplay : function(bean) {
										return bean.name == null ? null : bean.name;
									}, set : function(bean, obj) {
										bean.name = obj.value;
										bean.pathOld = bean.code;
										bean.code = obj.code
									}, autocomplete : {
										search : function(val) {
											var accountGroups = service.AccountService.findGroupByName(val).data
											var result = [];
											for (var i = 0; i < accountGroups.length; i++) {
												var productTag = accountGroups[i];
												result[i] = {
													value : productTag.name, label : productTag.name, code : productTag.code
												};
											}
											return result;
										}
									}
								}
							},
							{
								field : "createBy",
								label : "Chức vụ",
								toggled : true,
								filterable : true,
								custom : {
									getDisplay : function(bean) {
										if (bean.createBy == null) {
											return null;
										} else {
											var membership = service.AccountService.getMembershipByAccountAndGroup(bean.createBy, bean.code).data;
											if (membership != null) {
												bean.createBy = membership.role;
											}
											if (bean.createBy == null) {
												bean.createBy = "";
											}
											var position = service.KpiService.getPositionByCode(bean.createBy).data;
											if (position != null) {
												return position.name;
											} else {
												return null;
											}
										}
									}, set : function(bean, obj) {
										bean.createBy = obj.value;
									}, autocomplete : {
										search : function(val) {
											var positions = service.KpiService.findPositonByName(val).data;
											var result = [];
											for (var i = 0; i < positions.length; i++) {
												var position = positions[i];
												result[i] = {
													value : position.code, label : position.name
												};
											}
											return result;
										}
									}
								}
							}, {
								field : "code", label : "code", toggled : false, filterable : true
							}, {
								field : "pathOld", label : "pathOld", toggled : false, filterable : true
							}
						], actions : [
							{
								icon : "delete", label : "Xóa", onClick : function(thisTable, row) {
									var item = thisTable.getItemOnCurrentPage(row);

									thisTable.beansDelete[thisTable.beansDelete.length] = item;
									thisTable.removeItemOnCurrentPage(row);
								}
							}, {
								icon : "edit", label : "Sửa", onClick : function(thisTable, row) {
									thisTable.onEditBean(row);
								}
							}
						]
					}
				},

				init : function(beans, beansDelete, isPopup) {
					this.beans = beans;
					this.beansDelete = beansDelete;
					this.setBeans(this.beans, isPopup);
					return this;
				}
			});

		var UIUserEducation = UITable.extend({
			label : res('UIUserEducation.label'),
			config : {
				toolbar : {
					dflt : {
						actions : [
							{
								action : "onNew", icon : "plus", label : res('UIUserEducation.action.onNew'),
								onClick : function(thisTable) {
									thisTable.onAddBean();
								}
							}
						]
					},
					filter : {
						fields : [
							{
								field : "schoolOrInstitute", label : res('UIUserEducation.field.schoolOrInstitute'), type : 'string',
								operator : 'LIKE'
							}
						], onFilter : function(thisTable, query) {
							console.log('onFilter');
						},
					}
				},

				bean : {
					label : 'Học vấn',
					fields : [
						{
							field : 'schoolOrInstitute', label : res('UIUserEducation.field.schoolOrInstitute'), toggled : true,
							filterable : true
						},
						{
							field : 'from', label : res('UIUserEducation.field.from'), toggled : true, filterable : true,
							datepicker : {
								getDate : function(bean) {
									if (bean.from == null) {
										bean.from = DateTime.getCurrentDate();
									}
									return DateTime.fromDateTimeToDDMMYYYY(bean.from);
								}, setDate : function(date, bean) {
									bean.from = DateTime.fromDDMMYYYYToDateTime(date);
								},
							}
						},
						{
							field : 'to', label : res('UIUserEducation.field.to'), toggled : true, filterable : true, datepicker : {
								getDate : function(bean) {
									if (bean.to == null) {
										bean.to = DateTime.getCurrentDate();
									}
									return DateTime.fromDateTimeToDDMMYYYY(bean.to);
								}, setDate : function(date, bean) {
									bean.to = DateTime.fromDDMMYYYYToDateTime(date);
								},
							}
						},
						{
							field : 'major', label : res('UIUserEducation.field.major'), toggled : true, filterable : true
						},
						{
							field : 'certificate', label : res('UIUserEducation.field.certificate'), toggled : true,
							filterable : true
						}, {
							field : 'language', label : res('UIUserEducation.field.language'), toggled : true, filterable : true
						}
					], actions : [
						{
							icon : "delete", label : "Xóa", onClick : function(thisTable, row) {
								thisTable.removeItemOnCurrentPage(row);
							}
						}, {
							icon : "edit", label : "Sửa", onClick : function(thisTable, row) {
								thisTable.onEditBean(row);
							}
						}
					]
				}
			}, init : function(account, isPopup) {
				this.account = account;
				this.setBeans(account.profiles.userEducations, isPopup);
				return this;
			}
		});

		var UIUserWork = UITable
			.extend({
				label : res('UIUserWork.label'),
				config : {
					toolbar : {
						dflt : {
							actions : [
								{
									action : "onNew", icon : "plus", label : res('UIUserWork.action.onNew'),
									onClick : function(thisTable) {
										thisTable.onAddBean();
									}
								}
							]
						},
						filter : {
							fields : [
								{
									field : "organization", label : res('UIUserWork.field.organization'), type : 'string',
									operator : 'LIKE'
								}
							], onFilter : function(thisTable, query) {
								console.log('onFilter');
							},
						}
					},

					bean : {
						label : 'Kinh nghiệm làm việc',
						fields : [
							{
								field : "organization", label : res('UIUserWork.field.organization'), toggled : true, filterable : true
							},
							{
								field : "from", label : res('UIUserWork.field.from'), toggled : true, filterable : true, datepicker : {
									getDate : function(bean) {
										if (bean.from == null) {
											bean.from = DateTime.getCurrentDate();
										}
										return DateTime.fromDateTimeToDDMMYYYY(bean.from);
									}, setDate : function(date, bean) {
										bean.from = DateTime.fromDDMMYYYYToDateTime(date);
									},
								}
							},
							{
								field : "to", label : res('UIUserWork.field.to'), toggled : true, filterable : true, datepicker : {
									getDate : function(bean) {
										if (bean.to == null) {
											bean.to = DateTime.getCurrentDate();
										}
										return DateTime.fromDateTimeToDDMMYYYY(bean.to);
									}, setDate : function(date, bean) {
										bean.to = DateTime.fromDDMMYYYYToDateTime(date);
									},
								}
							},
							{
								field : "position",
								label : res('UIUserWork.field.position'),
								toggled : true,
								filterable : true,
								custom : {
									getDisplay : function(bean) {
										if (bean.createBy == null) {
											return null;
										} else {
											var membership = service.AccountService.getMembershipByAccountAndGroup(bean.createBy, bean.code).data;
											if (membership != null) {
												bean.createBy = membership.role;
											}
											if (bean.createBy == null) {
												bean.createBy = "";
											}
											var position = service.KpiService.getPositionByCode(bean.createBy).data;
											if (position != null) {
												return position.name;
											} else {
												return null;
											}
										}
									}, set : function(bean, obj) {
										bean.createBy = obj.value;
									}, autocomplete : {
										search : function(val) {
											var positions = service.KpiService.findPositonByName(val).data;
											var result = [];
											for (var i = 0; i < positions.length; i++) {
												var position = positions[i];
												result[i] = {
													value : position.code, label : position.name
												};
											}
											return result;
										}
									}
								}
							},
							{
								field : "description", label : res('UIUserWork.field.description'), textarea : {}, toggled : true,
								filterable : true
							},
						], actions : [
							{
								icon : "delete", label : "Xóa", onClick : function(thisTable, row) {
									thisTable.removeItemOnCurrentPage(row);
								}
							}, {
								icon : "edit", label : "Sửa", onClick : function(thisTable, row) {
									thisTable.onEditBean(row);
								}
							}
						]
					}
				}, init : function(account, isPopup) {
					this.account = account;
					this.setBeans(account.profiles.userWorks, isPopup);
					return this;
				}
			});

		var UIContact = UITable.extend({
			label : res('UIContact.label'),
			config : {
				toolbar : {
					dflt : {
						actions : [
							{
								action : "onNew", icon : "plus", label : res('UIContact.action.onNew'), onClick : function(thisTable) {
									thisTable.onAddBean();
								}
							}
						]
					}, filter : {
						fields : [
							{
								field : "addressNumber", label : "Address #", type : 'string', operator : 'LIKE'
							}
						], onFilter : function(thisTable, query) {
							console.log('onFilter');
						},
					}
				},

				bean : {
					label : 'Địa chỉ liên lạc',
					fields : [
						{
							field : "addressNumber", label : res('UIContact.field.addressNumber'), toggled : true, filterable : true
						},
						{
							field : "street", label : res('UIContact.field.street'), toggled : true, filterable : true
						},
						{
							field : "country", label : res('UIContact.field.country'), toggled : true, filterable : true, custom : {
								getDisplay : function(bean) {
									if (bean.nameCountry == null) {
										return null;
									} else {
										var country = service.KpiService.getCountryByCode(bean.country).data;
										if (country == null) {
											return null;
										} else {
											return country.name;
										}
									}
								}, set : function(bean, obj) {
									bean.nameCountry = obj.label;
									bean.country = obj.value;
								}, autocomplete : {
									search : function(val) {
										var result = [];
										var countries = service.KpiService.findCountryByName(val).data;
										for (var i = 0; i < countries.length; i++) {
											var country = countries[i];
											result[i] = {
												value : country.code, label : country.name
											};
										}
										return result;
									}
								}
							}
						},
						{
							field : "city", label : res('UIContact.field.city'), toggled : true, filterable : true, custom : {
								getDisplay : function(bean) {
									if (bean.nameCity == null) {
										return null;
									} else {
										var city = service.KpiService.getCityByCode(bean.city).data;
										if (city == null) {
											return null;
										} else {
											return city.name;
										}
									}
								}, set : function(bean, obj) {
									bean.nameCity = obj.label;
									bean.city = obj.value;
								}, autocomplete : {
									search : function(val, bean) {
										var result = [];
										var cities = service.KpiService.findCityByNameAndCodeCountry(val, bean.country).data;
										for (var i = 0; i < cities.length; i++) {
											var city = cities[i];
											result[i] = {
												value : city.code, label : city.name
											};
										}
										return result;
									}
								}
							}
						},
						{
							field : "phone", label : res('UIContact.field.phone'), multiple : true, toggled : true, filterable : true
						},
						{
							field : "mobile", label : res('UIContact.field.mobile'), multiple : true, toggled : true,
							filterable : true
						},
						{
							field : "fax", label : res('UIContact.field.fax'), multiple : true, toggled : true, filterable : true
						},
						{
							field : "email", label : res('UIContact.field.email'), multiple : true, toggled : true, filterable : true
						},
						{
							field : "website", label : res('UIContact.field.website'), multiple : true, toggled : true,
							filterable : true
						}
					], actions : [
						{
							icon : "delete", label : "Xóa", onClick : function(thisTable, row) {
								thisTable.removeItemOnCurrentPage(row);
							}
						}, {
							icon : "edit", label : "Sửa", onClick : function(thisTable, row) {
								thisTable.onEditBean(row);
							}
						}
					]
				}
			}, init : function(account, isPopup) {
				this.account = account;
				this.setBeans(account.contacts, isPopup);
				return this;
			}
		});

		var UIAccountDetail = UICollapsible.extend({
			label : res('UIAccountDetail.label'),
			config : {
				actions : [
					{
						action : "back", label : res('UIAccountDetail.action.back'), onClick : function(thisUI) {
							if (thisUI.isPopup == true)
								UIPopup.closePopup();
							else
								thisUI.UIParent.viewStack.back();
							// if(thisUI.UIParent.back) thisUI.UIParent.back(false) ; 
						}
					},
					{
						action : "edit", label : res('UIUserEducation.action.edit'), onClick : function(thisUI) {
							var accountConfig = thisUI.UIAccount.getBeanConfig('account');
							var basicConfig = thisUI.UIUserBasic.getBeanConfig('basic');
							for (var i = 0; i < accountConfig.beanConfig.fields.length; i++) {
								if (accountConfig.beanConfig.fields[i].field == 'loginId') {
									accountConfig.disableField(accountConfig.beanConfig.fields[i].field, true);
								} else {
									accountConfig.disableField(accountConfig.beanConfig.fields[i].field, false);
								}
							}
							for (var i = 0; i < basicConfig.beanConfig.fields.length; i++) {
								basicConfig.disableField(basicConfig.beanConfig.fields[i].field, false);
							}
							thisUI.UIAccount.render();
							thisUI.UIUserBasic.render();
						}
					},
					{
						action : "save",
						label : res('UIAccountDetail.action.save'),
						onClick : function(thisUI) {
							thisUI.commitChange();
							var account = thisUI.account;
							account.birthday = account.profiles.basic.birthday;
							account = service.AccountService.saveAccount(account).data;

							for (var i = 0; i < thisUI.accountGroups.length; i++) {
								var accountGroup = thisUI.accountGroups[i];
								var membership = service.AccountService.getMembershipByAccountAndGroup(account.loginId,
									accountGroup.code).data;
								if (membership == null) {
									membership = service.AccountService.getMembershipByAccountAndGroup(account.loginId,
										accountGroup.pathOld).data;
									if (membership == null) {
										membership = {
											loginId : account.loginId, groupPath : accountGroup.code, role : accountGroup.createBy,
											nameEmployee : account.profiles.basic.firstName
										};
									} else {
										membership.role = accountGroup.createBy;
										membership.nameEmployee = account.createBy;
										membership.groupPath = accountGroup.code;
									}

								} else {
									membership.role = accountGroup.createBy;
									membership.nameEmployee = account.name;
								}
								service.AccountService.saveAccountMembership(membership);
							}
							for (var i = 0; i < thisUI.accountGroupDeletes.length; i++) {
								var accountGroup = thisUI.accountGroupDeletes[i];
								var membership = service.AccountService.getMembershipByAccountAndGroup(account.loginId,
									accountGroup.code).data;
								service.AccountService.deleteMembership(membership);
							}
							thisUI.UIParent.onRefresh();
							// thisUI.UIParent.viewStack.back() ;
							if (thisUI.UIParent.back) {
								thisUI.UIParent.back(false);
							}
							//            thisUI.UIParent.onAddBean();

						}
					}
				]
			},

			init : function(UIParent, account, isNew, isPopup) {
				this.clear();
				this.UIParent = UIParent;
				this.account = account;
				this.isPopup = isPopup;
				if (isPopup == true) {
					this.disableButton('edit', true);
					this.disableButton('save', true);
				} else {
					this.disableButton('edit', false);
					this.disableButton('save', false);
				}
				if (account.profiles == null)
					account.profiles = {};
				if (account.contacts == null)
					account.contacts = [];
				this.UIAccount = new UIAccount().init(this, account, isNew);
				this.add(this.UIAccount);

				if (account.profiles.basic == null)
					account.profiles.basic = {};
				if (account.profiles.userRelationships == null)
					account.profiles.userRelationships = [];
				if (account.profiles.userEducations == null)
					account.profiles.userEducations = [];
				if (account.profiles.userWorks == null)
					account.profiles.userWorks = [];
				this.UIUserBasic = new UIUserBasic().init(account.profiles.basic, isNew);
				this.add(this.UIUserBasic);
				this.accountGroups = service.AccountService.getByLoginIds(account.loginId).data;
				this.accountGroupDeletes = [];
				for (var i = 0; i < this.accountGroups.length; i++) {
					this.accountGroups[i].createBy = account.loginId;
				}
				this.UIAccountGroup = new UIAccountGroup().init(this.accountGroups, this.accountGroupDeletes, isPopup);
				this.add(this.UIAccountGroup, true);
				this.UIUserEducation = new UIUserEducation().init(account, isPopup);
				this.add(this.UIUserEducation, true);
				this.UIUserWork = new UIUserWork().init(account, isPopup);
				this.add(this.UIUserWork, true);
				this.UIUserRelationship = new UIUserRelationship().init(account, isPopup);
				this.add(this.UIUserRelationship, true);
				this.commitChange = function() {
					this.UIAccountGroup.commitChange();
					this.UIUserEducation.commitChange();
					this.UIUserWork.commitChange();
					this.UIUserRelationship.commitChange();
					this.UIContact.commitChange();
				};

				this.UIContact = new UIContact().init(account, isPopup);
				this.add(this.UIContact, true);
				return this;
			},
		});

		var Account = {
			UIAccountDetail : UIAccountDetail, UIUserBasic : UIUserBasic, UIAccountGroup : UIAccountGroup,
			UIUserEducation : UIUserEducation, UIContact : UIContact, UIUserRelationship : UIUserRelationship,
			UIUserWork : UIUserWork, UIAccount : UIAccount
		};

		return Account;
	});
