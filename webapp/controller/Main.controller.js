sap.ui.define([
    "./BaseController",
    "../model/orders",
    "../model/filters",
    "../model/formatter",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
],
    function (BaseController, Orders, Filters, Formatter, Sorter, Filter, FilterOperator, JSONModel, Fragment) {
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
                this._oNavContainer.to(this._oEditLeadTimePage);

                Fragment.load({
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

            onPressStartReport: function(oEvent){
                this.setAppBusy(true);

                let oModel = this.getModel("filters").getData();

                let oDateOrder = Formatter.dateToAbap(oModel.selectionDate),
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

                                if(sItem.Shipping === ""){
                                    oDateToday = sap.ui.core.format.DateFormat.getDateTimeInstance({
                                        pattern: "dd/MM/yyyy HH:mm:ss",
                                        UTC: true
                                    }).format(new Date());
                                }
                                
                                let oObject = sItem;

                                oObject.SalesOrderFormatted = this._converter_date_to_daysAndHours(sItem.Saleorder, oDateToday);


                                oItems.push(oObject);
                            });
                        }

                        this.getModel("orders").getData().items = oItems;

                        this.setAppBusy(false);
                    }.bind(this),
                    error: function(oError){
                        console.log(oError);

                        this.setAppBusy(false);
                    }.bind(this)
                });
            },

            onValidatedFieldsRequired: function(oEvent){
                let oModel      = this.getModel("filters").getData(),
                    aFieldClass = ["selectionDate", "selectionCompany", "selectionSetorAt", 
                                   "selectionCanalDist", "selectionClient", "selectionTypeOV", "selectionLocalExp"],
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

                /*if(bValid){
                    oModel.buttonStartEnabled = true;
                }else{
                    oModel.buttonStartEnabled = false;
                }*/

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


                let d1   = "01/06/2022 14:00:00";
                let d2   = "20/06/2022 14:31:00";
                let diff = moment(d2,"DD/MM/YYYY HH:mm:ss").diff(moment(d1,"DD/MM/YYYY HH:mm:ss"));
                let dias = moment.duration(diff);
                console.log(`${dias._data.days} dias ${dias._data.hours} Horas ${dias._data.minutes} Minutos e ${dias._data.seconds} Segundos`);

                this.setAppBusy(false);
            },

            _resetFilterToAbap: function(sListValues){
                let oValueString = "";

                sListValues.map(sValue => {
                    if(sListValues.length > 1){
                        oValueString += sValue + ",";
                    }else{
                        oValueString += sValue;
                    }
                });

                return oValueString;
            },

            _converter_date_to_daysAndHours: function(sDateOne, sDateTwo){
                let oDiff = moment(sDateTwo,"DD/MM/YYYY HH:mm:ss").diff(moment(sDateOne,"DD/MM/YYYY HH:mm:ss")),
                    oDate = moment.duration(oDiff);

                return `${oDate._data.days} dias ${oDate._data.hours} Horas ${oDate._data.minutes} Minutos e ${oDate._data.seconds} Segundos`;

            }
        });
    });
