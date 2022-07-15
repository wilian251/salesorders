sap.ui.define([
	"sap/ui/core/UIComponent",
    "sap/ui/core/mvc/Controller",
	"sap/m/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (UIComponent,
	Controller,
	Library,
	Filter,
	FilterOperator
){
	"use strict";
	return Controller.extend("com.thera.ajinomoto.salesorders.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter : function () {
			return UIComponent.getRouterFor(this);
		},
		/**
		 * Convenience method to define the busy State
		 * @public
		 * @param {Boolean} bBusy Busy State 
		 */
		setAppBusy: function(bBusy) {
			this.getModel("appView").setProperty("/busy", bBusy);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle : function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		}
	})
});