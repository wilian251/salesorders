sap.ui.define([
	"./BaseController",
], function(
	BaseController
) {
	"use strict";

	return BaseController.extend("com.thera.ajinomoto.salesorders.controller.Object", {
        onInit: function () {
            this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched.bind(this), this);
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */
        
        onPressGridListItem: function(oEvent){},

        onPressEditLead: function(oEvent){
            this._oNavContainer.to(this._oEditLeadTimePage);

            this._oFragment = Fragment.load({
                id: this.getView().getId(),
                name: "com.thera.ajinomoto.salesorders.view.fragments.EditLeadTime",
                controller: this
            }).then(function(oFragment){
                this._oEditLeadTimePage.removeAllContent();
                this._oEditLeadTimePage.insertContent(oFragment);
            }.bind(this));
        },

        onPressSaveLeadTime: function(oEvent){},

        onBackEditLeadTime: function(oEvent){
            this._oNavContainer.back();

            this._oEditLeadTimePage.removeAllContent();
        },
        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */
        _onObjectMatched: async function(oEvent) {
        },
	});
});