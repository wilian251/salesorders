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

                this.byId("credit").addStyleClass("colorSuccess");

                this.byId("transport").addStyleClass("colorSuccess");

                this.byId("invoicing").addStyleClass("colorSuccess");

                this.byId("totalTime").addStyleClass("colorSuccess");
            },

            /* =========================================================== */
            /* event handlers                                              */
            /* =========================================================== */
            
            onItemTable: function(oEvent){
                let oPath     = oEvent.getSource().getBindingContext("orders").getPath(),
                    oPathLine = oPath.split("/").slice(-1).pop(),
                    oOrders   = this.getModel("orders").getData().items;

                this.getRouter().navTo("object", {
                    id: oOrders[oPathLine].Vbeln
                });
            },

            onSearch: function(oEvent){
                let oTable   = this.byId("tableSalesOrders"),
                    oBinding = oTable.getBinding("items");

                if (oEvent.getParameters().refreshButtonPressed){
                    oBinding.refresh(true);
                } else {
                    let aTableSearchState = [];
                    let sQuery 			  = oEvent.getParameter("query");

                    if (sQuery && sQuery.length > 0) {
                        aTableSearchState = new Filter({
                            and: false,
                            filters: [
                                new Filter("Vbeln",             FilterOperator.Contains, sQuery),
                                new Filter("CompanyName",       FilterOperator.Contains, sQuery),
                                new Filter("CustomerReference", FilterOperator.Contains, sQuery),
                                new Filter("SalesOrganization", FilterOperator.Contains, sQuery)
                            ]
                        })
        
                    }
                    
                    oBinding.filter(aTableSearchState, "Application");
                }
            },

            onUpdateFinished: function(oEvent) {
                let oTitle,
                    oTable       = oEvent.getSource(),
                    iTotalItems  = oEvent.getParameter("total");

                // only update the counter if the length is final and
                // the table is not empty
                if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                    oTitle = this.getResourceBundle().getText("mainTableHeaderTitleLength", [iTotalItems]);
                    
                } else {
                    oTitle = this.getResourceBundle().getText("mainTableHeaderTitle");
                }

                this.getModel("orderTexts").setProperty("/headerTitleTable", oTitle);
            },

            onExportExcel: function(oEvent){

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
                        oModel.leadTime.CreditDays         = oData.CreditDays;
                        oModel.leadTime.CreditHours        = oData.CreditHours;
                        oModel.leadTime.CreditMin          = oData.CreditMin;
                        oModel.leadTime.CreditSec          = oData.CreditSec;
                        oModel.leadTime.InvoicingDays      = oData.InvoicingDays;
                        oModel.leadTime.InvoicingHours     = oData.InvoicingHours;
                        oModel.leadTime.InvoicingMin       = oData.InvoicingMin;
                        oModel.leadTime.InvoicingSec       = oData.InvoicingSec;
                        oModel.leadTime.SaleorderDays      = oData.SaleorderDays;
                        oModel.leadTime.SaleorderHours     = oData.SaleorderHours;
                        oModel.leadTime.SaleorderMin       = oData.SaleorderMin;
                        oModel.leadTime.SaleorderSec       = oData.SaleorderSec;
                        oModel.leadTime.ShippingDays       = oData.ShippingDays;
                        oModel.leadTime.ShippingHours      = oData.ShippingHours;
                        oModel.leadTime.ShippingMin        = oData.ShippingMin;
                        oModel.leadTime.ShippingSec        = oData.ShippingSec;
                        oModel.leadTime.TotalDays          = oData.TotalDays;
                        oModel.leadTime.TotalHours         = oData.TotalHours;
                        oModel.leadTime.TotalMin           = oData.TotalMin;
                        oModel.leadTime.TotalSec           = oData.TotalSec;
                        oModel.leadTime.TransportDays      = oData.TransportDays;
                        oModel.leadTime.TransportHours     = oData.TransportHours;
                        oModel.leadTime.TransportMin       = oData.TransportMin;
                        oModel.leadTime.TransportSec       = oData.TransportSec;

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
                        //console.log(oData.results);
                        let oModel = this.getModel("orders").getData(),
                            oItems = [];

                        if(oData.results.length != 0){
                            //Dias                        
                            let oCountDaysSaleOrder = 0, oCountDaysSaleOrderSLA = 0,
                                oCountDaysShipping  = 0, oCountDaysShippingSLA  = 0,
                                oCountDaysCredit    = 0, oCountDaysCreditSLA    = 0,
                                oCountDaysTransport = 0, oCountDaysTransportSLA = 0,
                                oCountDaysInvoicing = 0, oCountDaysInvoicingSLA = 0,
                                oCountDaysTotal     = 0, oCountDaysTotalSLA     = 0;

                            //Horas
                            let oCountHoursSaleOrder = 0, oCountHoursSaleOrderSLA = 0,
                                oCountHoursShipping  = 0, oCountHoursShippingSLA  = 0,
                                oCountHoursCredit    = 0, oCountHoursCreditSLA    = 0,
                                oCountHoursTransport = 0, oCountHoursTransportSLA = 0,
                                oCountHoursInvoicing = 0, oCountHoursInvoicingSLA = 0,
                                oCountHoursTotal     = 0, oCountHoursTotalSLA     = 0;

                            //Minitos
                            let oCountMinSaleOrder = 0, oCountMinSaleOrderSLA = 0,
                                oCountMinShipping  = 0, oCountMinShippingSLA  = 0,
                                oCountMinCredit    = 0, oCountMinCreditSLA    = 0,
                                oCountMinTransport = 0, oCountMinTransportSLA = 0,
                                oCountMinInvoicing = 0, oCountMinInvoicingSLA = 0,
                                oCountMinTotal     = 0, oCountMinTotalSLA     = 0;

                            //Segundos
                            let oCountSecSaleOrder = 0, oCountSecSaleOrderSLA = 0,
                                oCountSecShipping  = 0, oCountSecShippingSLA  = 0,
                                oCountSecCredit    = 0, oCountSecCreditSLA    = 0,
                                oCountSecTransport = 0, oCountSecTransportSLA = 0,
                                oCountSecInvoicing = 0, oCountSecInvoicingSLA = 0,
                                oCountSecTotal     = 0, oCountSecTotalSLA     = 0;


                            oData.results.map(sItem => {
                                let oObject         = sItem,
                                    oCountTotalDay  = 0,
                                    oCountTotalHour = 0,
                                    oCountTotalMin  = 0,
                                    oCountTotalSec  = 0;

                                //Ordem de venda
                                if(sItem.Saleorder != ""){
                                    let oDateHour = this._converter_date_to_daysAndHours(sItem.Saleorder, sItem.SaleorderFinish);
                                    
                                    oObject.SaleorderFormatted = oDateHour.dateHourFormatted;
                                    oObject.dateHour           = oDateHour.dateHour;

                                    oCountTotalDay  += oDateHour.dateHour.days;
                                    oCountTotalHour += oDateHour.dateHour.hours;
                                    oCountTotalMin  += oDateHour.dateHour.minutes;
                                    oCountTotalSec  += oDateHour.dateHour.seconds;

                                    oObject.SaleorderColor     = "#008000"


                                    //Contagem para saber a media
                                    oCountDaysSaleOrder  += oDateHour.dateHour.days;
                                    oCountHoursSaleOrder += oDateHour.dateHour.hours;
                                    oCountMinSaleOrder   += oDateHour.dateHour.minutes;
                                    oCountSecSaleOrder   += oDateHour.dateHour.seconds;
                                }else{
                                    oObject.SaleorderFormatted = this.getResourceBundle().getText("mainLeadTimeCycleNotStarted");
                                    //oObject.SaleorderColor     = "#FFA500"
                                }

                                //Remessa
                                if(sItem.Shipping != ""){
                                    let oDateHour = this._converter_date_to_daysAndHours(sItem.Shipping, sItem.ShippingFinish);
                                    
                                    oObject.ShippingFormatted = oDateHour.dateHourFormatted;
                                    oObject.dateHour          = oDateHour.dateHour;
                                    oObject.ShippingColor     = "#008000"

                                    oCountTotalDay  += oDateHour.dateHour.days;
                                    oCountTotalHour += oDateHour.dateHour.hours;
                                    oCountTotalMin  += oDateHour.dateHour.minutes;
                                    oCountTotalSec  += oDateHour.dateHour.seconds;


                                    //Contagem para saber a media
                                    oCountDaysShipping  += oDateHour.dateHour.days;
                                    oCountHoursShipping += oDateHour.dateHour.hours;
                                    oCountMinShipping   += oDateHour.dateHour.minutes;
                                    oCountSecShipping   += oDateHour.dateHour.seconds;

                                }else{
                                    oObject.ShippingFormatted = this.getResourceBundle().getText("mainLeadTimeCycleNotStarted");
                                    //oObject.ShippingColor     = "#FFA500"

                                }

                                //Crédito
                                if(sItem.Credit != ""){
                                    let oDateHour = this._converter_date_to_daysAndHours(sItem.Credit, sItem.CreditFinish);
                                    
                                    oObject.CreditFormatted = oDateHour.dateHourFormatted;
                                    oObject.dateHour        = oDateHour.dateHour;

                                    oCountTotalDay  += oDateHour.dateHour.days;
                                    oCountTotalHour += oDateHour.dateHour.hours;
                                    oCountTotalMin  += oDateHour.dateHour.minutes;
                                    oCountTotalSec  += oDateHour.dateHour.seconds;

                                    //Contagem para saber a media
                                    oCountDaysCredit  += oDateHour.dateHour.days;
                                    oCountHoursCredit += oDateHour.dateHour.hours;
                                    oCountMinCredit   += oDateHour.dateHour.minutes;
                                    oCountSecCredit   += oDateHour.dateHour.seconds;
                                }else{
                                    oObject.CreditFormatted = this.getResourceBundle().getText("mainLeadTimeCycleNotStarted");
                                    //oObject.CreditColor     = "#FFA500"
                                }

                                //Transporte
                                if(sItem.Transport != ""){
                                    let oDateHour = this._converter_date_to_daysAndHours(sItem.Transport, sItem.TransportFinish);
                                    oObject.TransportFormatted = oDateHour.dateHourFormatted;
                                    oObject.dateHour           = oDateHour.dateHour;

                                    oCountTotalDay  += oDateHour.dateHour.days;
                                    oCountTotalHour += oDateHour.dateHour.hours;
                                    oCountTotalMin  += oDateHour.dateHour.minutes;
                                    oCountTotalSec  += oDateHour.dateHour.seconds;

                                    //Contagem para saber a media
                                    oCountDaysTransport  += oDateHour.dateHour.days;
                                    oCountHoursTransport += oDateHour.dateHour.hours;
                                    oCountMinTransport   += oDateHour.dateHour.minutes;
                                    oCountSecTransport   += oDateHour.dateHour.seconds;

                                }else{
                                    oObject.TransportFormatted = this.getResourceBundle().getText("mainLeadTimeCycleNotStarted");
                                    //oObject.TransportColor     = "#FFA500"
                                }

                                //Faturamento
                                if(sItem.Invoicing != ""){
                                    let oDateHour = this._converter_date_to_daysAndHours(sItem.Invoicing, sItem.InvoicingFinish);
                                    oObject.InvoicingFormatted = oDateHour.dateHourFormatted;
                                    oObject.dateHour           = oDateHour.dateHour;

                                    oCountTotalDay  += oDateHour.dateHour.days;
                                    oCountTotalHour += oDateHour.dateHour.hours;
                                    oCountTotalMin  += oDateHour.dateHour.minutes;
                                    oCountTotalSec  += oDateHour.dateHour.seconds;

                                    //Contagem para saber a media
                                    oCountDaysInvoicing  += oDateHour.dateHour.days;
                                    oCountHoursInvoicing += oDateHour.dateHour.hours;
                                    oCountMinInvoicing   += oDateHour.dateHour.minutes;
                                    oCountSecInvoicing   += oDateHour.dateHour.seconds;

                                }else{
                                    oObject.InvoicingFormatted = this.getResourceBundle().getText("mainLeadTimeCycleNotStarted");
                                    //oObject.InvoicingColor     = "#FFA500"
                                }

                                let oObjectTime = this._validTheTime(oCountTotalDay, oCountTotalHour, oCountTotalMin, oCountTotalSec);

                                oObject.TotalFormatted = `${oObjectTime.days} dias ${oObjectTime.hours} Horas ${oObjectTime.minutes} Min e ${oObjectTime.seconds} Seg`;

                                //Contagem para saber a media
                                oCountDaysTotal  += oObjectTime.days;
                                oCountHoursTotal += oObjectTime.hours;
                                oCountMinTotal   += oObjectTime.minutes;
                                oCountSecTotal   += oObjectTime.seconds;

                                oItems.push(oObject);
                            });

                            let oDivisor = oData.results.length;

                            //Preenche os campos de média de cada ciclo
                            oModel.averageSalesOrder = this._validTheTime(this._calculateTheAverage(oCountDaysSaleOrder, oDivisor), this._calculateTheAverage(oCountHoursSaleOrder, oDivisor), this._calculateTheAverage(oCountMinSaleOrder, oDivisor), this._calculateTheAverage(oCountSecSaleOrder, oDivisor)).dateHoursFormatted;
                            oModel.averageShipping   = this._validTheTime(this._calculateTheAverage(oCountDaysShipping, oDivisor), this._calculateTheAverage(oCountHoursShipping, oDivisor), this._calculateTheAverage(oCountMinShipping, oDivisor), this._calculateTheAverage(oCountSecShipping, oDivisor)).dateHoursFormatted;
                            oModel.averageCredit     = this._validTheTime(this._calculateTheAverage(oCountDaysCredit, oDivisor), this._calculateTheAverage(oCountHoursCredit, oDivisor), this._calculateTheAverage(oCountMinCredit, oDivisor), this._calculateTheAverage(oCountSecCredit, oDivisor)).dateHoursFormatted;
                            oModel.averageTransport  = this._validTheTime(this._calculateTheAverage(oCountDaysTransport, oDivisor), this._calculateTheAverage(oCountHoursTransport, oDivisor), this._calculateTheAverage(oCountMinTransport, oDivisor), this._calculateTheAverage(oCountSecTransport, oDivisor)).dateHoursFormatted;
                            oModel.averageInvoicing  = this._validTheTime(this._calculateTheAverage(oCountDaysInvoicing, oDivisor), this._calculateTheAverage(oCountHoursInvoicing, oDivisor), this._calculateTheAverage(oCountMinInvoicing, oDivisor), this._calculateTheAverage(oCountSecInvoicing, oDivisor)).dateHoursFormatted;
                            oModel.averageTotal      = this._validTheTime(this._calculateTheAverage(oCountDaysTotal, oDivisor), this._calculateTheAverage(oCountHoursTotal, oDivisor), this._calculateTheAverage(oCountMinTotal, oDivisor), this._calculateTheAverage(oCountSecTotal, oDivisor)).dateHoursFormatted;

                            //SLA cadastrado pelo usuário
                            oModel.averageSalesOrderSLA = "";
                            oModel.averageShippingSLA   = "";
                            oModel.averageCreditSLA     = "";
                            oModel.averageTransportSLA  = "";
                            oModel.averageInvoicingSLA  = "";
                            oModel.averageTotalSLA      = "";

                        }

                        oModel.items = oItems;
                        this.getModel("orders").refresh(true);

                        this.getModel("orderTexts").setProperty("/headerTextTitle", this.getResourceBundle().getText("mainPanelHeaderTextLength", [oItems.length]));

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
                    headerTextTitle: this.getResourceBundle().getText("mainPanelHeaderText")
                }

                this.getModel("orderTexts").setData(OrderTexts.initSelectionModel(oI18n));
                this.getModel("orderTexts").refresh(true);   

                this.setAppBusy(false);
            },

            _calculateTheAverage: function(sValue, sDivisor){
                let oResultValue = `${sValue / sDivisor}`,
                    oPosition    = oResultValue.indexOf(".");

                if(oPosition != -1) oResultValue = oResultValue.substring(0, oPosition);

                return oResultValue;
            },

            _validTheTime: function(sDays, sHours, sMin, sSec){
                if(sSec >= 60){
                    let oCountMin = 0;

                    while(sSec >= 60){
                        sSec = sSec - 60;
                        oCountMin++;
                    }

                    sMin += oCountMin;
                }

                if(sMin >= 60){
                    let oCountHours = 0;

                    while(sMin >= 60){
                        sMin = sMin - 60;
                        oCountHours++;
                    }

                    sHours += oCountHours;
                }

                if(sHours >= 24){
                    let oCountDays = 0;

                    while(sHours >= 24){
                        sHours = sHours - 24;
                        oCountDays++;
                    }

                    sDays += oCountDays;
                }

                return {
                    days: sDays,
                    hours: sHours,
                    minutes: sMin,
                    seconds: sSec,
                    dateHoursFormatted: `${sDays} dias ${sHours} Horas ${sMin} Min e ${sSec} Seg`
                }
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

                /*if(sModel.leadTime.Saleorder != "" &&    
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
                    
                }*/           
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
