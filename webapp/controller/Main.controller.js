sap.ui.define([
    "./BaseController",
    "../model/orders",
    "../model/filters",
    "../model/orderTexts",
    "../model/formatter",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
],
    function (BaseController, Orders, Filters, OrderTexts, Formatter, Sorter, Filter, FilterOperator, JSONModel, Fragment) {
        "use strict";

        return BaseController.extend("com.thera.ajinomoto.salesorders.controller.Main", {
            /* =========================================================== */
            /* lifecycle methods                                           */
            /* =========================================================== */
            onInit: function(){
                this.getRouter().getRoute("main").attachPatternMatched(this._onObjectMatched.bind(this), this);
            },

            onBeforeRendering: function(){
                this.byId("saleOrder").addStyleClass("colorSuccess");

                this.byId("shipping").addStyleClass("colorWarning");

                this.byId("credit").addStyleClass("colorError");

                this.byId("transport").addStyleClass("colorInformation");

                this.byId("invoicing").addStyleClass("colorInformation");

                this.byId("totalTime").addStyleClass("colorWarning");
            },

            /* =========================================================== */
            /* event handlers                                              */
            /* =========================================================== */
            
            onPressGridListItem: function(oEvent){
                this.getRouter().navTo("object");
            },

            onPressEditLead: function(oEvent){
                this._oNavContainer.to(this._oEditLeadTimePage, "slide");

                /*Fragment.load({
					id: this.getView().getId(),
					name: "com.thera.ajinomoto.salesorders.view.fragments.EditLeadTime",
					controller: this
				}).then(function(oFragment){
                    this._oEditLeadTimePage.removeAllContent();
                    this._oEditLeadTimePage.insertContent(oFragment);
				}.bind(this));*/
            },

            onPressSaveLeadTime: function(oEvent){},

            onBackEditLeadTime: function(oEvent){
                //this._oEditLeadTimePage.removeAllContent();

                this._oNavContainer.back();

                console.log(this.byId("saleOrderInitial"));
                console.log(this.byId("saleOrderFinish"));
            },

            onPressStartReport: function(oEvent){
                this.setAppBusy(true);

                let oModel = this.getModel("filters").getData();

                let oDateOrder = `${Formatter.dateToAbap(oModel.selectionDateIn)},${Formatter.dateToAbap(oModel.selectionDateUpUntil)}`,
                    oTypeOV    = this._resetFilterToAbap(oModel.selectionTypeOV),
                    oCodClient = this._resetFilterToAbap(oModel.selectionClient),
                    oCNLDist   = this._resetFilterToAbap(oModel.selectionCanalDist),
                    oSetorAt   = this._resetFilterToAbap(oModel.selectionSetorAt),
                    oCompany   = this._resetFilterToAbap(oModel.selectionCompany),
                    oLCExp     = "";

                this.getModel().callFunction("/ListSalesOrderTime", {
                    urlParameters: {
						IV_LCEXP: oLCExp,
                        IV_COMPANY: oCompany,
                        IV_SETORAT: oSetorAt,
                        IV_CNLDIST: oCNLDist,
                        IV_DATEORDER: oDateOrder,
                        IV_TYPEOV: oTypeOV,
                        IV_CODCLIENT: oCodClient
					},
                    success: function(oData){
                        console.log(oData.results);
                        let oItems = [];

                        if(oData.results.length != 0){
                            oData.results.map(sItem => {
                                let oDateToday = "";

                                /*if(sItem.SaleorderFinish === "" ||
                                   sItem.SaleorderFinish === "" ||
                                   sItem.SaleorderFinish === "" ||
                                   sItem.SaleorderFinish === "" ){
                                    oDateToday = sap.ui.core.format.DateFormat.getDateTimeInstance({
                                        pattern: "dd/MM/yyyy HH:mm:ss",
                                        UTC: true
                                    }).format(new Date());
                                }

                                /*Company: "4354"
                                CompanyName: "AJINOMOTO DO BRASIL"
                                Credit: ""
                                CreditColor: ""
                                CreditFinish: ""
                                CustomerReference: ""
                                CustomerReferenceDate: "07/06/2022"
                                Invoicing: ""
                                InvoicingColor: ""
                                InvoicingFinish: ""
                                Saleorder: "07/06/2022 15:25:35"
                                SaleorderFinish: ""
                                SalesOrganization: "1001"
                                SeleorderColor: ""
                                Shipping: "07/06/2022 15:26:04"
                                ShippingColor: ""
                                ShippingFinish: "21/06/2022 22:50:17"
                                Total: ""
                                TotalColor: ""
                                TotalFinish: ""
                                Transport: ""
                                TransportColor: ""
                                TransportFinish: ""
                                Vbeln: "60006153"*/

                                
                                let oObject = sItem;

                                if(sItem.Saleorder != ""){
                                    let oDateHour = this._converter_date_to_daysAndHours(sItem.Saleorder, sItem.SaleorderFinish);
                                    oObject.SalesOrderFormatted = oDateHour.dateHourFormatted;
                                }

                                if(sItem.Shipping != ""){
                                    let oDateHour = this._converter_date_to_daysAndHours(sItem.Shipping, sItem.ShippingFinish);
                                    oObject.ShippingFormatted = oDateHour.dateHourFormatted;
                                }

                                oItems.push(oObject);
                            });
                        }

                        this.getModel("orders").getData().items = oItems;
                        this.getModel("orders").refresh(true);

                        this.getModel("orderTexts").setProperty("/headerTextTitle", this.getResourceBundle().getText("mainGridListHeaderTextLength", [oItems.length]));

                        this.setAppBusy(false);
                    }.bind(this),
                    error: function(oError){
                        console.log(JSON.parse(oError.responseText));

                        this.setAppBusy(false);
                    }.bind(this)
                });
            },

            onValidatedFieldsRequired: function(oEvent){
                let oModel      = this.getModel("filters").getData(),
                    aFieldClass = ["selectionDateIn", "selectionDateUpUntil"],
                    bValid      = true;

                aFieldClass.forEach(sField => {
                    if(oModel[sField].length === 0 || oModel[sField] === "") {
                        oModel.State[sField].ValueState     = sap.ui.core.ValueState.Error;
                        oModel.State[sField].ValueStateText = this.getResourceBundle().getText("validationFieldRequired");
                        bValid = false;
                    } else {
                        oModel.State[sField].ValueState     = sap.ui.core.ValueState.None;
                        oModel.State[sField].ValueStateText = "";
                    }
                });

                oModel.buttonStartEnabled = bValid;

                this.getModel("filters").refresh(true);
            },
            /* =========================================================== */
            /* internal methods                                            */
            /* =========================================================== */
            _onObjectMatched: async function(oEvent){
                this.setAppBusy(true);

                this._oNavContainer     = this.byId("navContainer");
                this._oEditLeadTimePage = this.byId("editLeadTimePage");

                this.getModel("orders").setData(Orders.initModel());
                this.getModel("orders").refresh(true);

                //filtros para seleção dos dados
                this.getModel("filters").setData(Filters.initSelectionModel());
                this.getModel("filters").refresh(true);   

                let oI18n = {
                    headerTextTitle: this.getResourceBundle().getText("mainGridListHeaderText")
                }

                this.getModel("orderTexts").setData(OrderTexts.initSelectionModel(oI18n));
                this.getModel("orderTexts").refresh(true);   

                this.setAppBusy(false);
            },

            _resetFilterToAbap: function(sListValues){
                let oValueString = "";

                if(sListValues.length != 0){
                    sListValues.map(sValue => {
                        if(sListValues.length > 1){
                            oValueString += sValue + ",";
                        }else{
                            oValueString += sValue;
                        }
                    });
                }

                return oValueString;
            },

            _converter_date_to_daysAndHours: function(sDateOne, sDateTwo){
                let oDiff = moment(sDateTwo,"DD/MM/YYYY HH:mm:ss").diff(moment(sDateOne,"DD/MM/YYYY HH:mm:ss")),
                    oDate = moment.duration(oDiff);

                return {
                    dateHourFormatted: `${oDate._data.days} dias ${oDate._data.hours}H ${oDate._data.minutes} Min e ${oDate._data.seconds} Seg`,
                    dateHour: oDate._data
                }

            }
        });
    });
