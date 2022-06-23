sap.ui.define([
    "./BaseController",
    "../model/orders",
    "../model/filters",
    "../model/orderTexts",
    "../model/leadTime",
    "../model/formatter",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
],
    function (
        BaseController, 
        Orders, 
        Filters, 
        OrderTexts, 
        LeadTime, 
        Formatter, 
        Sorter, 
        Filter, 
        FilterOperator, 
        JSONModel, 
        Fragment,
        MessageBox
    ) {
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

                this.byId("shipping").addStyleClass("colorSuccess");

                /*this.byId("credit").addStyleClass("colorError");

                this.byId("transport").addStyleClass("colorInformation");

                this.byId("invoicing").addStyleClass("colorInformation");

                this.byId("totalTime").addStyleClass("colorWarning");*/
            },

            /* =========================================================== */
            /* event handlers                                              */
            /* =========================================================== */
            
            onPressGridListItem: function(oEvent){
                let oPath     = oEvent.getSource().getBindingContext("orders").getPath(),
                    oPathLine = oPath.split("/").slice(-1).pop(),
                    oOrders   = this.getModel("orders").getData().items;

                this.getRouter().navTo("object", {
                    id: oOrders[oPathLine].Vbeln
                });
            },

            onPressEditLead: function(oEvent){
                this.setAppBusy(true);

                let oVbeln = oEvent.getSource().getDependents()[0].getProperty("text");

                this._oNavContainer.to(this._oEditLeadTimePage, "slide");

                let oLeadTimeEntity = this.getModel().createKey("/LeadTimeSet", {
                    Vbeln: oVbeln,
                    Mandt: '400'
                });

                this.getModel().read(oLeadTimeEntity, {
                    urlParameters: {
                        Vbeln: oVbeln
                    },
                    success: function(oData){
                        //console.log(oData);
                        let oModel = this.getModel("leadTime").getData();

                        oModel.leadTime.Vbeln              = oData.Vbeln;
                        oModel.leadTime.Saleorder          = oData.Saleorder;
                        oModel.leadTime.SaleorderFinish    = oData.SaleorderFinish;
                        oModel.leadTime.SaleorderFormatted = oData.SaleorderFormatted;
                        oModel.leadTime.Shipping           = oData.Shipping;
                        oModel.leadTime.ShippingFinish     = oData.ShippingFinish;
                        oModel.leadTime.ShippingFormatted  = oData.ShippingFormatted;
                        oModel.leadTime.Credit             = oData.Credit;
                        oModel.leadTime.CreditFinish       = oData.CreditFinish;
                        oModel.leadTime.CreditFormatted    = oData.CreditFormatted;
                        oModel.leadTime.Transport          = oData.Transport;
                        oModel.leadTime.TransportFinish    = oData.TransportFinish;
                        oModel.leadTime.TransportFormatted = oData.TransportFormatted;
                        oModel.leadTime.Invoicing          = oData.Invoicing;
                        oModel.leadTime.InvoicingFinish    = oData.InvoicingFinish;
                        oModel.leadTime.InvoicingFormatted = oData.InvoicingFormatted;
                        oModel.leadTime.Total              = oData.Total;
                        oModel.leadTime.TotalFinish        = oData.TotalFinish;
                        oModel.leadTime.TotalFormatted     = oData.TotalFormatted;

                        this.getModel("leadTime").refresh(true);

                        this.setAppBusy(false);
                    }.bind(this),
                    error: function(oError){
                        MessageBox.error(this.getResourceBundle().getText("messageErrorSearchLeadTime"));

                        this._oNavContainer.back();

                        this.setAppBusy(false);
                    }.bind(this)
                });

                
            },

            onPressSaveLeadTime: function(oEvent){
                this.setAppBusy(true);

                let oModel = this.getModel("leadTime").getData();

                this.getModel().create("/LeadTimeSet", oModel.leadTime, {
                    success: function(oData){
                        let oModel = this.getModel("orders").getData();

                        oModel.items.map(sOrder => {
                            if(sOrder.Vbeln === oData.Vbeln){    
                                sOrder.Saleorderformattedlt = oData.SaleorderFormatted;
                                sOrder.Shippingformattedlt  = oData.ShippingFormatted;
                                sOrder.Creditformattedlt    = oData.CreditFormatted;
                                sOrder.Invoicingformattedlt = oData.InvoicingFormatted;
                                sOrder.Transportformattedlt = oData.TransportFormatted;
                                sOrder.Totalformattedlt     = oData.TotalFormatted;
                            }
                        });

                        this.getModel("orders").refresh(true);

                        MessageBox.success(this.getResourceBundle().getText("messageSuccessCreateLeadTime"), {
                            actions: [MessageBox.Action.CLOSE],
                            onClose: function(sAction){
                                this._oNavContainer.back();
                            }.bind(this)
                        });

                        this.setAppBusy(false);
                    }.bind(this),
                    error: function(oError){
                        MessageBox.error(this.getResourceBundle().getText("messageErrorCreateLeadTime"));

                        this.setAppBusy(false);
                    }.bind(this)
                });
            },

            onBackEditLeadTime: function(oEvent){
                this._oNavContainer.back();
            },

            onValidatedFieldsLeadTime: function(oEvent){
                let oModel = this.getModel("leadTime").getData();

                this._formateValuesInDaysAndHours(oModel);

                this.getModel("leadTime").refresh(true);
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
                                /*Company: "4354"
                                CompanyName: "AJINOMOTO DO BRASIL"
                                Credit: ""
                                CreditColor: ""
                                CreditFinish: ""
                                CreditFormatted: ""
                                Creditformattedlt: "2 dias 0H 0 Min e 5 Seg"
                                CustomerReference: ""
                                CustomerReferenceDate: "07/06/2022"
                                Invoicing: ""
                                InvoicingColor: ""
                                InvoicingFinish: ""
                                InvoicingFormatted: ""
                                Invoicingformattedlt: "3 dias 0H 0 Min e 7 Seg"
                                Saleorder: "07/06/2022 15:25:35"
                                SaleorderColor: ""
                                SaleorderFinish: "23/06/2022 03:42:06"
                                SaleorderFormatted: "15 dias 12H 16 Min e 31 Seg"
                                Saleorderformattedlt: "1 dias 0H 0 Min e 10 Seg"
                                SalesOrganization: "1001"
                                Shipping: "07/06/2022 15:26:04"
                                ShippingColor: ""
                                ShippingFinish: "23/06/2022 03:42:06"
                                ShippingFormatted: "15 dias 12H 16 Min e 2 Seg"
                                Shippingformattedlt: "2 dias 0H 0 Min e 5 Seg"
                                Total: ""
                                TotalColor: ""
                                TotalFinish: ""
                                TotalFormatted: ""
                                Totalformattedlt: "16 dias 0H 0 Min e 51 Seg"
                                Transport: ""
                                TransportColor: ""
                                TransportFinish: ""
                                TransportFormatted: ""
                                Transportformattedlt: "6 dias 0H 0 Min e 4 Seg"
                                Vbeln: "60006153"*/


                                /*
                                this.byId("saleOrder").addStyleClass("colorSuccess");
                                this.byId("shipping").addStyleClass("colorWarning");
                                this.byId("credit").addStyleClass("colorError");
                                this.byId("transport").addStyleClass("colorInformation");
                                this.byId("invoicing").addStyleClass("colorInformation");
                                this.byId("totalTime").addStyleClass("colorWarning");
                                */

                                
                                let oObject = sItem;

                                //Ordem de venda
                                if(sItem.Saleorder != ""){
                                    let oDateHour = this._converter_date_to_daysAndHours(sItem.Saleorder, sItem.SaleorderFinish);
                                    oObject.SaleorderFormatted = oDateHour.dateHourFormatted;
                                    oObject.SaleorderColor     = "#008000"
                                }else{
                                    oObject.SaleorderFormatted = "";
                                    oObject.SaleorderColor     = "#FFA500"

                                    this.byId("saleOrder").addStyleClass("colorWarning");
                                }

                                //Remessa
                                if(sItem.Shipping != ""){
                                    let oDateHour = this._converter_date_to_daysAndHours(sItem.Shipping, sItem.ShippingFinish);
                                    oObject.ShippingFormatted = oDateHour.dateHourFormatted;
                                    oObject.ShippingColor     = "#008000"
                                }else{
                                    oObject.ShippingFormatted = "";
                                    oObject.ShippingColor     = "#FFA500"

                                    this.byId("shipping").addStyleClass("colorWarning");
                                }

                                //Crédito
                                if(sItem.Credit != ""){
                                    let oDateHour = this._converter_date_to_daysAndHours(sItem.Credit, sItem.CreditFinish);
                                    oObject.CreditFormatted = oDateHour.dateHourFormatted;
                                }else{
                                    oObject.CreditFormatted = "";
                                    oObject.CreditColor     = "#FFA500"

                                    this.byId("credit").addStyleClass("colorWarning");
                                }

                                //Transporte
                                if(sItem.Transport != ""){
                                    let oDateHour = this._converter_date_to_daysAndHours(sItem.Transport, sItem.TransportFinish);
                                    oObject.TransportFormatted = oDateHour.dateHourFormatted;
                                }else{
                                    oObject.TransportFormatted = "";
                                    oObject.TransportColor     = "#FFA500"

                                    this.byId("transport").addStyleClass("colorWarning");
                                }

                                //Faturamento
                                if(sItem.Invoicing != ""){
                                    let oDateHour = this._converter_date_to_daysAndHours(sItem.Invoicing, sItem.InvoicingFinish);
                                    oObject.InvoicingFormatted = oDateHour.dateHourFormatted;
                                }else{
                                    oObject.InvoicingFormatted = "";
                                    oObject.InvoicingColor     = "#FFA500"

                                    this.byId("invoicing").addStyleClass("colorWarning");
                                }

                                oObject.TotalFormatted = "";
                                oObject.TotalColor     = "#FFA500"
                                this.byId("totalTime").addStyleClass("colorWarning");

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

                //Campos para criação de lead time
                this.getModel("leadTime").setData(LeadTime.initModel());
                this.getModel("leadTime").refresh(true); 

                let oI18n = {
                    headerTextTitle: this.getResourceBundle().getText("mainGridListHeaderText")
                }

                this.getModel("orderTexts").setData(OrderTexts.initSelectionModel(oI18n));
                this.getModel("orderTexts").refresh(true);   

                this.setAppBusy(false);
            },

            _formateValuesInDaysAndHours: function(sModel){
                let oDatesTotal = [];

                //Ordem de venda
                if(sModel.leadTime.Saleorder != "" &&    
                   sModel.leadTime.SaleorderFinish != "")
                {
                    oDatesTotal.push(sModel.leadTime.Saleorder);
                    oDatesTotal.push(sModel.leadTime.SaleorderFinish);

                    let oDateHour = this._converter_date_to_daysAndHours(sModel.leadTime.Saleorder, sModel.leadTime.SaleorderFinish);
                    sModel.leadTime.SaleorderFormatted = oDateHour.dateHourFormatted;
                }

                //Remessa
                if(sModel.leadTime.Shipping != "" && 
                   sModel.leadTime.ShippingFinish != "")
                {
                    oDatesTotal.push(sModel.leadTime.Shipping);
                    oDatesTotal.push(sModel.leadTime.ShippingFinish);

                    let oDateHour = this._converter_date_to_daysAndHours(sModel.leadTime.Shipping, sModel.leadTime.ShippingFinish);
                    sModel.leadTime.ShippingFormatted = oDateHour.dateHourFormatted;
                }

                //Crédito
                if(sModel.leadTime.Credit != "" && 
                   sModel.leadTime.CreditFinish != "")
                {
                    oDatesTotal.push(sModel.leadTime.Credit);
                    oDatesTotal.push(sModel.leadTime.CreditFinish);

                    let oDateHour = this._converter_date_to_daysAndHours(sModel.leadTime.Credit, sModel.leadTime.CreditFinish);
                    sModel.leadTime.CreditFormatted = oDateHour.dateHourFormatted;
                }

                //Transporte
                if(sModel.leadTime.Transport != "" && 
                   sModel.leadTime.TransportFinish != "")
                {
                    oDatesTotal.push(sModel.leadTime.Transport);
                    oDatesTotal.push(sModel.leadTime.TransportFinish);

                    let oDateHour = this._converter_date_to_daysAndHours(sModel.leadTime.Transport, sModel.leadTime.TransportFinish);
                    sModel.leadTime.TransportFormatted = oDateHour.dateHourFormatted;
                }

                //Faturamento
                if(sModel.leadTime.Invoicing != "" && 
                   sModel.leadTime.InvoicingFinish != "")
                {
                    oDatesTotal.push(sModel.leadTime.Invoicing);
                    oDatesTotal.push(sModel.leadTime.InvoicingFinish);

                    let oDateHour = this._converter_date_to_daysAndHours(sModel.leadTime.Invoicing, sModel.leadTime.InvoicingFinish);
                    sModel.leadTime.InvoicingFormatted = oDateHour.dateHourFormatted;
                }

                if(sModel.leadTime.Saleorder != "" &&    
                   sModel.leadTime.SaleorderFinish != "" &&
                   sModel.leadTime.Shipping != "" &&    
                   sModel.leadTime.ShippingFinish != "" &&
                   sModel.leadTime.Credit != "" &&    
                   sModel.leadTime.CreditFinish != "" &&
                   sModel.leadTime.Transport != "" &&    
                   sModel.leadTime.TransportFinish != "" &&
                   sModel.leadTime.Invoicing != "" &&    
                   sModel.leadTime.InvoicingFinish != "")
                {
                    oDatesTotal.sort(function(sDateOne, sDateTwo){    
                        return sDateOne === sDateTwo ? 0 : sDateOne > sDateTwo ? 1 : -1
                    });

                    let oDateHour = this._converter_date_to_daysAndHours(oDatesTotal[0], oDatesTotal[oDatesTotal.length -1]);

                    sModel.leadTime.TotalFormatted = oDateHour.dateHourFormatted;
                    
                    /*
                    sModel.leadTime.Total              = oDatesTotal[0];
                    sModel.leadTime.TotalFinish        = oDatesTotal[oDatesTotal.length -1];
                    */
                }                
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
                    dateHourFormatted: `${oDate._data.days} dias ${oDate._data.hours} Horas ${oDate._data.minutes} Min e ${oDate._data.seconds} Seg`,
                    dateHour: oDate._data
                }

            },

            _clearFieldDaysAndHours: function(sValue, sSearchValue, sPositionValue){
                if(sValue != ""){
                    let oPosition = sValue.indexOf(sSearchValue);

                    if(oPosition != -1){
                        return sValue.substring(sPositionValue, oPosition)
                    }
                }
            }
        });
    });
