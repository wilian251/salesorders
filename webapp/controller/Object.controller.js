sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
], function(
	BaseController,
	JSONModel
) {
	"use strict";

	return BaseController.extend("com.thera.ajinomoto.salesorders.controller.Object", {
        onInit: function () {
            this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched.bind(this), this);
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

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
        _onObjectMatched: function(oEvent){
            this.setAppBusy(true);

            let oVbeln = oEvent.getParameter("arguments").id;

            let oItems = this.getModel("orders").getData().items;

            if(oItems != undefined){
                let oOrder = oItems.find(sItem => {
                    if(sItem.Vbeln === oVbeln) return sItem;
                });

                this.getModel("orders").setData(oOrder);
                this.getModel("orders").refresh(true);

                this.getView().bindElement({
                    path: "/",
                    model: "orders"
                });


                //CycleSaleOrderItems
                this.getModel().callFunction("/CycleSaleOrderItems", {
                    urlParameters: {
                        iv_vbeln: oVbeln
                    },
                    success: function(oData){
                        this.getModel("saleOrderItems").setData({ items: oData.results });
                        this.getModel("saleOrderItems").refresh(true);

                        this.setAppBusy(false);
                    }.bind(this),
                    error: function(oError){
                        console.log(JSON.parse(oError.responseText));

                        this.setAppBusy(false);
                    }.bind(this)
                });
            }else{
                this.getRouter().navTo("main");
            }
        },
	});
});