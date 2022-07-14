sap.ui.define([
    "./BaseController",
    "../model/orders",
    "../model/filters",
    "../model/orderTexts",
    "../model/leadTime",
    "../model/formatter",
    "../model/columnsExcel",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/ui/export/Spreadsheet",
],
    function (
        BaseController, 
        Orders, 
        Filters, 
        OrderTexts, 
        LeadTime, 
        Formatter,
        ColumnsExcel,
        Sorter, 
        Filter, 
        FilterOperator, 
        JSONModel, 
        Fragment,
        MessageBox,
        Spreadsheet
    ) {
        "use strict";

        return BaseController.extend("com.thera.ajinomoto.salesorders.controller.Main", {
            /* =========================================================== */
            /* lifecycle methods                                           */
            /* =========================================================== */
            onInit: function(){
                this.getRouter().getRoute("main").attachPatternMatched(this._onObjectMatched.bind(this), this);
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
                let oName  = this.getResourceBundle().getText("mainTableHeaderTitle"),
                    oModel = this.getModel("filters").getData(),
                    oItems = this.getModel("orders").getData().items;


                new sap.ui.export.Spreadsheet({
                    workbook: { 
                        columns: ColumnsExcel.initModel()
                    },
                    sheetName: `${oName} - ${oModel.selectionDateIn} Até ${oModel.selectionDateUpUntil}`,
                    metaSheetName: `${oName} - ${oModel.selectionDateIn} Até ${oModel.selectionDateUpUntil}`,
                    dataSource: oItems,//oTable.getBinding("items"),
                    fileName: `${oName} - ${oModel.selectionDateIn}_${oModel.selectionDateUpUntil}.xlsx`,
                    worker: false
                }).build();
            },

            onPressEditLead: function(oEvent){
                this.setAppBusy(true);

                let oSpart = oEvent.getSource().getDependents()[0].getProperty("text");

                this._oNavContainer.to(this._oEditLeadTimePage, "slide");

                let oLeadTimeEntity = this.getModel().createKey("/LeadTimeSet", {
                    Spart: oSpart,
                    Mandt: '400'
                });

                this.getModel().read(oLeadTimeEntity, {
                    success: function(oData){
                        //console.log(oData);
                        let oModel = this.getModel("leadTime").getData();

                        oModel.leadTime.Spart              = oData.Spart;
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

                        let oModelFilters = this.getModel("filters").getData();

                        //if(oData.SaleorderDays != "") oModelFilters.buttonUpdateVisible = true; 
                        //else oModelFilters.buttonStartVisible = true;

                        this.getModel("filters").refresh(true);

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

            onPressUpdateLeadTime: function(oEvent){
                this.setAppBusy(true);

                let oModelLeadTime = this.getModel("leadTime").getData(),
                    oSpart         = oModelLeadTime.leadTime.Spart;
                    
                let oLeadTimeEntity = this.getModel().createKey("/LeadTimeSet", {
                    Spart: oSpart,
                    Mandt: '400'
                });

                this.getModel().update(oLeadTimeEntity, oModelLeadTime.leadTime, {
                    urlParameters: {
                        Spart: oSpart
                    },
                    success: function(oData){
                        let oModel = this.getModel("orders").getData();
                        
                        let oSaleOrder = this._calculateTheDifferenceDays(oModel.averageSalesOrderDateHours, 
                            {
                                days: oData.SaleorderDays,
                                hours: oData.SaleorderHours,
                                minutes: oData.SaleorderMin,
                                seconds: oData.SaleorderSec
                            }
                        );

                        let oShipping = this._calculateTheDifferenceDays(oModel.averageShippingDateHours, 
                            {
                                days: oData.ShippingDays,
                                hours: oData.ShippingHours,
                                minutes: oData.ShippingMin,
                                seconds: oData.ShippingSec
                            }
                        );

                        let oCredit = this._calculateTheDifferenceDays(oModel.averageCreditDateHours, 
                            {
                                days: oData.CreditDays,
                                hours: oData.CreditHours,
                                minutes: oData.CreditMin,
                                seconds: oData.CreditSec
                            }
                        );

                        let oTransport = this._calculateTheDifferenceDays(oModel.averageTransportDateHours, 
                            {
                                days: oData.TransportDays,
                                hours: oData.TransportHours,
                                minutes: oData.TransportMin,
                                seconds: oData.TransportSec
                            }
                        );

                        let oInvoicing = this._calculateTheDifferenceDays(oModel.averageInvoicingDateHours, 
                            {
                                days: oData.InvoicingDays,
                                hours: oData.InvoicingHours,
                                minutes: oData.InvoicingMin,
                                seconds: oData.InvoicingSec
                            }
                        );

                        let oTotal = this._calculateTheDifferenceDays(oModel.averageTotalDateHours, 
                            {
                                days: oData.TotalDays,
                                hours: oData.TotalHours,
                                minutes: oData.TotalMin,
                                seconds: oData.TotalSec
                            }
                        );

                        oModel.averageSalesOrderDiff = oSaleOrder.dateHourFormatted;
                        oModel.State.averageSalesOrder.ValueState = oSaleOrder.state;
                        oModel.State.averageSalesOrder.color      = oSaleOrder.color;
                        this.byId("saleOrder").addStyleClass(oSaleOrder.class);

                        oModel.averageShippingDiff   = oShipping.dateHourFormatted;
                        oModel.State.averageShipping.ValueState = oShipping.state;
                        oModel.State.averageShipping.color      = oShipping.color;
                        this.byId("shipping").addStyleClass(oShipping.class);

                        oModel.averageCreditDiff     = oCredit.dateHourFormatted;
                        oModel.State.averageCredit.ValueState = oCredit.state;
                        oModel.State.averageCredit.color      = oCredit.color;
                        this.byId("credit").addStyleClass(oCredit.class);

                        oModel.averageTransportDiff  = oTransport.dateHourFormatted;
                        oModel.State.averageTransport.ValueState = oTransport.state;
                        oModel.State.averageTransport.color      = oTransport.color;
                        this.byId("transport").addStyleClass(oTransport.class);

                        oModel.averageInvoicingDiff  = oInvoicing.dateHourFormatted;
                        oModel.State.averageInvoicing.ValueState = oInvoicing.state;
                        oModel.State.averageInvoicing.color      = oInvoicing.color;
                        this.byId("invoicing").addStyleClass(oInvoicing.class);

                        oModel.averageTotalDiff      = oTotal.dateHourFormatted;
                        oModel.State.averageTotal.ValueState = oTotal.state;
                        oModel.State.averageTotal.color      = oTotal.color;
                        this.byId("totalTime").addStyleClass(oTotal.class);

                        oModel.averageCreditSLA     = `${oData.CreditDays} dias ${oData.CreditHours} Horas ${oData.CreditMin} Min e ${oData.CreditSec} Seg`;
                        oModel.averageInvoicingSLA  = `${oData.InvoicingDays} dias ${oData.InvoicingHours} Horas ${oData.InvoicingMin} Min e ${oData.InvoicingSec} Seg`;
                        oModel.averageSalesOrderSLA = `${oData.SaleorderDays} dias ${oData.SaleorderHours} Horas ${oData.SaleorderMin} Min e ${oData.SaleorderSec} Seg`;
                        oModel.averageShippingSLA   = `${oData.ShippingDays} dias ${oData.ShippingHours} Horas ${oData.ShippingMin} Min e ${oData.ShippingSec} Seg`;
                        oModel.averageTotalSLA      = `${oData.TotalDays} dias ${oData.TotalHours} Horas ${oData.TotalMin} Min e ${oData.TotalSec} Seg`;
                        oModel.averageTransportSLA  = `${oData.TransportDays} dias ${oData.TransportHours} Horas ${oData.TransportMin} Min e ${oData.TransportSec} Seg`;

                        this._calculateTotalTimeAndAverage(oModel);

                        this.getModel("orders").refresh(true);

                        
                        let oModelFilters = this.getModel("filters").getData();

                        oModelFilters.buttonUpdateVisible = false; 
                        oModelFilters.buttonStartVisible  = false;

                        this.getModel("filters").refresh(true);

                        MessageBox.success(this.getResourceBundle().getText("messageSuccessUpdateLeadTime"), {
                            actions: [MessageBox.Action.CLOSE],
                            onClose: function(sAction){
                                this._oNavContainer.back();
                            }.bind(this)
                        });

                        this.setAppBusy(false);
                    }.bind(this),
                    error: function(oError){
                        MessageBox.error(this.getResourceBundle().getText("messageErrorUpdateLeadTime"));

                        this.setAppBusy(false);
                    }.bind(this)
                });
            },

            onPressSaveLeadTime: function(oEvent){
                this.setAppBusy(true);

                let oModelLeadTime = this.getModel("leadTime").getData();

                this.getModel().create("/LeadTimeSet", oModelLeadTime.leadTime, {
                    success: function(oData){
                        let oModel = this.getModel("orders").getData();
                        
                        let oSaleOrder = this._calculateTheDifferenceDays(oModel.averageSalesOrderDateHours, 
                            {
                                days: oData.SaleorderDays,
                                hours: oData.SaleorderHours,
                                minutes: oData.SaleorderMin,
                                seconds: oData.SaleorderSec
                            }
                        );

                        let oShipping = this._calculateTheDifferenceDays(oModel.averageShippingDateHours, 
                            {
                                days: oData.ShippingDays,
                                hours: oData.ShippingHours,
                                minutes: oData.ShippingMin,
                                seconds: oData.ShippingSec
                            }
                        );

                        let oCredit = this._calculateTheDifferenceDays(oModel.averageCreditDateHours, 
                            {
                                days: oData.CreditDays,
                                hours: oData.CreditHours,
                                minutes: oData.CreditMin,
                                seconds: oData.CreditSec
                            }
                        );

                        let oTransport = this._calculateTheDifferenceDays(oModel.averageTransportDateHours, 
                            {
                                days: oData.TransportDays,
                                hours: oData.TransportHours,
                                minutes: oData.TransportMin,
                                seconds: oData.TransportSec
                            }
                        );

                        let oInvoicing = this._calculateTheDifferenceDays(oModel.averageInvoicingDateHours, 
                            {
                                days: oData.InvoicingDays,
                                hours: oData.InvoicingHours,
                                minutes: oData.InvoicingMin,
                                seconds: oData.InvoicingSec
                            }
                        );

                        let oTotal = this._calculateTheDifferenceDays(oModel.averageTotalDateHours, 
                            {
                                days: oData.TotalDays,
                                hours: oData.TotalHours,
                                minutes: oData.TotalMin,
                                seconds: oData.TotalSec
                            }
                        );

                        oModel.averageSalesOrderDiff = oSaleOrder.dateHourFormatted;
                        oModel.State.averageSalesOrder.ValueState = oSaleOrder.state;
                        oModel.State.averageSalesOrder.color      = oSaleOrder.color;
                        this.byId("saleOrder").addStyleClass(oSaleOrder.class);

                        oModel.averageShippingDiff   = oShipping.dateHourFormatted;
                        oModel.State.averageShipping.ValueState = oShipping.state;
                        oModel.State.averageShipping.color      = oShipping.color;
                        this.byId("shipping").addStyleClass(oShipping.class);

                        oModel.averageCreditDiff     = oCredit.dateHourFormatted;
                        oModel.State.averageCredit.ValueState = oCredit.state;
                        oModel.State.averageCredit.color      = oCredit.color;
                        this.byId("credit").addStyleClass(oCredit.class);

                        oModel.averageTransportDiff  = oTransport.dateHourFormatted;
                        oModel.State.averageTransport.ValueState = oTransport.state;
                        oModel.State.averageTransport.color      = oTransport.color;
                        this.byId("transport").addStyleClass(oTransport.class);

                        oModel.averageInvoicingDiff  = oInvoicing.dateHourFormatted;
                        oModel.State.averageInvoicing.ValueState = oInvoicing.state;
                        oModel.State.averageInvoicing.color      = oInvoicing.color;
                        this.byId("invoicing").addStyleClass(oInvoicing.class);

                        oModel.averageTotalDiff      = oTotal.dateHourFormatted;
                        oModel.State.averageTotal.ValueState = oTotal.state;
                        oModel.State.averageTotal.color      = oTotal.color;
                        this.byId("totalTime").addStyleClass(oTotal.class);

                        oModel.averageCreditSLA     = `${oData.CreditDays} dias ${oData.CreditHours} Horas ${oData.CreditMin} Min e ${oData.CreditSec} Seg`;
                        oModel.averageInvoicingSLA  = `${oData.InvoicingDays} dias ${oData.InvoicingHours} Horas ${oData.InvoicingMin} Min e ${oData.InvoicingSec} Seg`;
                        oModel.averageSalesOrderSLA = `${oData.SaleorderDays} dias ${oData.SaleorderHours} Horas ${oData.SaleorderMin} Min e ${oData.SaleorderSec} Seg`;
                        oModel.averageShippingSLA   = `${oData.ShippingDays} dias ${oData.ShippingHours} Horas ${oData.ShippingMin} Min e ${oData.ShippingSec} Seg`;
                        oModel.averageTotalSLA      = `${oData.TotalDays} dias ${oData.TotalHours} Horas ${oData.TotalMin} Min e ${oData.TotalSec} Seg`;
                        oModel.averageTransportSLA  = `${oData.TransportDays} dias ${oData.TransportHours} Horas ${oData.TransportMin} Min e ${oData.TransportSec} Seg`;

                        this._calculateTotalTimeAndAverage(oModel);

                        this.getModel("orders").refresh(true);

                        let oModelFilters = this.getModel("filters").getData();

                        oModelFilters.buttonUpdateVisible = false; 
                        oModelFilters.buttonStartVisible  = false;

                        this.getModel("filters").refresh(true);

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
                let oModel      = this.getModel("leadTime").getData(),
                    aFieldClassDays  = ["CreditDays", "InvoicingDays", "SaleorderDays", "ShippingDays", "TransportDays"],
                    aFieldClassHours = ["CreditHours", "InvoicingHours", "SaleorderHours", "ShippingHours", "TransportHours"],
                    aFieldClassMin   = ["CreditMin", "InvoicingMin", "SaleorderMin", "ShippingMin", "TransportMin"],
                    aFieldClassSec   = ["CreditSec", "InvoicingSec", "SaleorderSec", "ShippingSec", "TransportSec"],
                    oCountDays       = 0,
                    oCountHours      = 0,
                    oCountMin        = 0,
                    oCountSec        = 0,
                    bValid           = true;

                aFieldClassDays.forEach(sField => {
                    oCountDays += Number(oModel.leadTime[sField]);

                    if(oModel.leadTime[sField] === ""){
                        oModel.State[sField].ValueState 	 = sap.ui.core.ValueState.Error;
                        oModel.State[sField].ValueStateText = this.getResourceBundle().getText("validationFieldRequired");
                        bValid = false;
                    }else{
                        oModel.State[sField].ValueState     = sap.ui.core.ValueState.None;
                        oModel.State[sField].ValueStateText = "";
                    }
                });

                aFieldClassHours.forEach(sField => {
                    oCountHours += Number(oModel.leadTime[sField]);

                    if(oModel.leadTime[sField] === ""){
                        oModel.State[sField].ValueState 	 = sap.ui.core.ValueState.Error;
                        oModel.State[sField].ValueStateText = this.getResourceBundle().getText("validationFieldRequired");
                        bValid = false;
                    }else{
                        oModel.State[sField].ValueState     = sap.ui.core.ValueState.None;
                        oModel.State[sField].ValueStateText = "";
                    }
                });

                aFieldClassMin.forEach(sField => {
                    oCountMin += Number(oModel.leadTime[sField]);

                    if(oModel.leadTime[sField] === ""){
                        oModel.State[sField].ValueState 	 = sap.ui.core.ValueState.Error;
                        oModel.State[sField].ValueStateText = this.getResourceBundle().getText("validationFieldRequired");
                        bValid = false;
                    }else{
                        oModel.State[sField].ValueState     = sap.ui.core.ValueState.None;
                        oModel.State[sField].ValueStateText = "";
                    }
                });

                aFieldClassSec.forEach(sField => {
                    oCountSec += Number(oModel.leadTime[sField]);

                    if(oModel.leadTime[sField] === ""){
                        oModel.State[sField].ValueState 	 = sap.ui.core.ValueState.Error;
                        oModel.State[sField].ValueStateText = this.getResourceBundle().getText("validationFieldRequired");
                        bValid = false;
                    }else{
                        oModel.State[sField].ValueState     = sap.ui.core.ValueState.None;
                        oModel.State[sField].ValueStateText = "";
                    }
                });

                oModel.leadTime.TotalDays  = String(oCountDays);
                oModel.leadTime.TotalHours = String(oCountHours);
                oModel.leadTime.TotalMin   = String(oCountMin);
                oModel.leadTime.TotalSec   = String(oCountSec);

                let oObjectTime = this._validTheTime(oCountDays, oCountHours, oCountMin, oCountSec);

                oModel.TotalFormatted = `${oObjectTime.dateHours.days} dias ${oObjectTime.dateHours.hours} Horas ${oObjectTime.dateHours.minutes} Min e ${oObjectTime.dateHours.seconds} Seg`;

                this.getModel("leadTime").refresh(true);

                this.getModel("filters").getData().buttonStartVisible = bValid
                this.getModel("filters").refresh(true);

                
            },

            onPressStartReport: function(oEvent){
                this.setAppBusy(true);

                let oModel = this.getModel("filters").getData();

                let oDateOrder = `${Formatter.dateToAbap(oModel.selectionDateIn)},${Formatter.dateToAbap(oModel.selectionDateUpUntil)}`,
                    oTypeOV    = this._resetFilterToAbap(oModel.selectionTypeOV),
                    oCodClient = this._resetFilterToAbap(oModel.selectionClient),
                    oCNLDist   = this._resetFilterToAbap(oModel.selectionCanalDist),
                    oSetorAt   = oModel.selectionSetorAt;

                this.getModel().callFunction("/ListSalesOrderTime", {
                    urlParameters: {
                        IV_SETORAT: oSetorAt,
                        IV_CNLDIST: oCNLDist,
                        IV_DATEORDER: oDateOrder,
                        IV_TYPEOV: oTypeOV,
                        IV_CODCLIENT: oCodClient
					},
                    success: function(oData){
                        console.log(oData.results);
                        let oModel = this.getModel("orders").getData(),
                            oItems = [];

                        if(oData.results.length != 0){
                            //Números de etapas que começaram
                            let oCountSaleOrderIsNotEmpty = 0,
                                oCountShippingIsNotEmpty  = 0,
                                oCountCreditIsNotEmpty    = 0,
                                oCountTransportIsNotEmpty = 0,
                                oCountInvoicingIsNotEmpty = 0,
                                oCountTotalIsNotEmpty     = 0;

                            //Dias                        
                            let oCountDaysSaleOrder = 0,
                                oCountDaysShipping  = 0,
                                oCountDaysCredit    = 0,
                                oCountDaysTransport = 0,
                                oCountDaysInvoicing = 0,
                                oCountDaysTotal     = 0;

                            //Horas
                            let oCountHoursSaleOrder = 0,
                                oCountHoursShipping  = 0,
                                oCountHoursCredit    = 0,
                                oCountHoursTransport = 0,
                                oCountHoursInvoicing = 0,
                                oCountHoursTotal     = 0;

                            //Minitos
                            let oCountMinSaleOrder = 0,
                                oCountMinShipping  = 0,
                                oCountMinCredit    = 0,
                                oCountMinTransport = 0,
                                oCountMinInvoicing = 0,
                                oCountMinTotal     = 0;

                            //Segundos
                            let oCountSecSaleOrder = 0,
                                oCountSecShipping  = 0,
                                oCountSecCredit    = 0,
                                oCountSecTransport = 0,
                                oCountSecInvoicing = 0, 
                                oCountSecTotal     = 0;


                            oData.results.map(sItem => {
                                let oObject         = sItem,
                                    oCountTotalDay  = 0,
                                    oCountTotalHour = 0,
                                    oCountTotalMin  = 0,
                                    oCountTotalSec  = 0;

                                //Ordem de venda
                                if(sItem.Saleorder != ""){
                                    let oDateHour = this._converter_date_to_daysAndHours(sItem.Saleorder, sItem.SaleorderFinish);
                                    
                                    oObject.SaleorderFormatted  = oDateHour.dateHourFormatted;
                                    oObject.dateHour            = oDateHour.dateHour;
                                    oObject.SaleorderValueState = "Success";
                                    oObject.SaleorderColor      = "#008000"

                                    oCountTotalDay  += oDateHour.dateHour.days;
                                    oCountTotalHour += oDateHour.dateHour.hours;
                                    oCountTotalMin  += oDateHour.dateHour.minutes;
                                    oCountTotalSec  += oDateHour.dateHour.seconds;

                                    //Contagem para saber a media
                                    oCountDaysSaleOrder  += oDateHour.dateHour.days;
                                    oCountHoursSaleOrder += oDateHour.dateHour.hours;
                                    oCountMinSaleOrder   += oDateHour.dateHour.minutes;
                                    oCountSecSaleOrder   += oDateHour.dateHour.seconds;

                                    oCountSaleOrderIsNotEmpty++;

                                }else{
                                    oObject.SaleorderFormatted  = this.getResourceBundle().getText("mainLeadTimeCycleNotStarted");
                                    oObject.SaleorderColor      = "#FFA500"
                                    oObject.SaleorderValueState = "Warning";
                                }

                                //Remessa
                                if(sItem.Shipping != ""){
                                    let oDateHour = this._converter_date_to_daysAndHours(sItem.Shipping, sItem.ShippingFinish);
                                    
                                    oObject.ShippingFormatted  = oDateHour.dateHourFormatted;
                                    oObject.dateHour           = oDateHour.dateHour;
                                    oObject.ShippingColor      = "#008000"
                                    oObject.ShippingValueState = "Success";

                                    oCountTotalDay  += oDateHour.dateHour.days;
                                    oCountTotalHour += oDateHour.dateHour.hours;
                                    oCountTotalMin  += oDateHour.dateHour.minutes;
                                    oCountTotalSec  += oDateHour.dateHour.seconds;

                                    //Contagem para saber a media
                                    oCountDaysShipping  += oDateHour.dateHour.days;
                                    oCountHoursShipping += oDateHour.dateHour.hours;
                                    oCountMinShipping   += oDateHour.dateHour.minutes;
                                    oCountSecShipping   += oDateHour.dateHour.seconds;

                                    oCountShippingIsNotEmpty++;

                                }else{
                                    oObject.ShippingFormatted  = this.getResourceBundle().getText("mainLeadTimeCycleNotStarted");
                                    oObject.ShippingColor      = "#FFA500"
                                    oObject.ShippingValueState = "Warning";

                                }

                                //Crédito
                                if(sItem.Credit != ""){
                                    let oDateHour = this._converter_date_to_daysAndHours(sItem.Credit, sItem.CreditFinish);
                                    
                                    oObject.CreditFormatted  = oDateHour.dateHourFormatted;
                                    oObject.dateHour         = oDateHour.dateHour;
                                    oObject.CreditValueState = "Success";
                                    oObject.CreditColor      = "#008000"

                                    oCountTotalDay  += oDateHour.dateHour.days;
                                    oCountTotalHour += oDateHour.dateHour.hours;
                                    oCountTotalMin  += oDateHour.dateHour.minutes;
                                    oCountTotalSec  += oDateHour.dateHour.seconds;

                                    //Contagem para saber a media
                                    oCountDaysCredit  += oDateHour.dateHour.days;
                                    oCountHoursCredit += oDateHour.dateHour.hours;
                                    oCountMinCredit   += oDateHour.dateHour.minutes;
                                    oCountSecCredit   += oDateHour.dateHour.seconds;

                                    oCountCreditIsNotEmpty++;
                                }else{
                                    oObject.CreditFormatted  = this.getResourceBundle().getText("mainLeadTimeCycleNotStarted");
                                    oObject.CreditColor      = "#FFA500"
                                    oObject.CreditValueState = "Warning";
                                }

                                //Transporte
                                if(sItem.Transport != ""){
                                    let oDateHour = this._converter_date_to_daysAndHours(sItem.Transport, sItem.TransportFinish);
                                    oObject.TransportFormatted  = oDateHour.dateHourFormatted;
                                    oObject.dateHour            = oDateHour.dateHour;
                                    oObject.TransportValueState = "Success";
                                    oObject.TransportColor      = "#008000"

                                    oCountTotalDay  += oDateHour.dateHour.days;
                                    oCountTotalHour += oDateHour.dateHour.hours;
                                    oCountTotalMin  += oDateHour.dateHour.minutes;
                                    oCountTotalSec  += oDateHour.dateHour.seconds;

                                    //Contagem para saber a media
                                    oCountDaysTransport  += oDateHour.dateHour.days;
                                    oCountHoursTransport += oDateHour.dateHour.hours;
                                    oCountMinTransport   += oDateHour.dateHour.minutes;
                                    oCountSecTransport   += oDateHour.dateHour.seconds;

                                    oCountTransportIsNotEmpty++;

                                }else{
                                    oObject.TransportFormatted  = this.getResourceBundle().getText("mainLeadTimeCycleNotStarted");
                                    oObject.TransportColor      = "#FFA500"
                                    oObject.TransportValueState = "Warning";
                                }

                                //Faturamento
                                if(sItem.Invoicing != ""){
                                    let oDateHour = this._converter_date_to_daysAndHours(sItem.Invoicing, sItem.InvoicingFinish);
                                    oObject.InvoicingFormatted  = oDateHour.dateHourFormatted;
                                    oObject.dateHour            = oDateHour.dateHour;
                                    oObject.InvoicingValueState = "Success";
                                    oObject.InvoicingColor      = "#008000"

                                    oCountTotalDay  += oDateHour.dateHour.days;
                                    oCountTotalHour += oDateHour.dateHour.hours;
                                    oCountTotalMin  += oDateHour.dateHour.minutes;
                                    oCountTotalSec  += oDateHour.dateHour.seconds;

                                    //Contagem para saber a media
                                    oCountDaysInvoicing  += oDateHour.dateHour.days;
                                    oCountHoursInvoicing += oDateHour.dateHour.hours;
                                    oCountMinInvoicing   += oDateHour.dateHour.minutes;
                                    oCountSecInvoicing   += oDateHour.dateHour.seconds;

                                    oCountInvoicingIsNotEmpty++;

                                }else{
                                    oObject.InvoicingFormatted  = this.getResourceBundle().getText("mainLeadTimeCycleNotStarted");
                                    oObject.InvoicingColor      = "#FFA500"
                                    oObject.InvoicingValueState = "Warning";
                                }

                                let oObjectTime = this._validTheTime(oCountTotalDay, oCountTotalHour, oCountTotalMin, oCountTotalSec);

                                oObject.TotalFormatted  = `${oObjectTime.dateHours.days} dias ${oObjectTime.dateHours.hours} Horas ${oObjectTime.dateHours.minutes} Min e ${oObjectTime.dateHours.seconds} Seg`;
                                oObject.TotalValueState = "Success";
                                //Contagem para saber a media
                                oCountDaysTotal  += oObjectTime.dateHours.days;
                                oCountHoursTotal += oObjectTime.dateHours.hours;
                                oCountMinTotal   += oObjectTime.dateHours.minutes;
                                oCountSecTotal   += oObjectTime.dateHours.seconds;
                                
                                oItems.push(oObject);
                            });

                            let oDivisor = oData.results.length;


                            let oAverageSalesOrder = this._validTheTime(this._calculateTheAverage(oCountDaysSaleOrder, oCountSaleOrderIsNotEmpty), this._calculateTheAverage(oCountHoursSaleOrder, oCountSaleOrderIsNotEmpty), this._calculateTheAverage(oCountMinSaleOrder, oCountSaleOrderIsNotEmpty), this._calculateTheAverage(oCountSecSaleOrder, oCountSaleOrderIsNotEmpty)),
                                oAverageShipping   = this._validTheTime(this._calculateTheAverage(oCountDaysShipping, oCountShippingIsNotEmpty), this._calculateTheAverage(oCountHoursShipping, oCountShippingIsNotEmpty), this._calculateTheAverage(oCountMinShipping, oCountShippingIsNotEmpty), this._calculateTheAverage(oCountSecShipping, oCountShippingIsNotEmpty)),
                                oAverageCredit     = this._validTheTime(this._calculateTheAverage(oCountDaysCredit, oCountCreditIsNotEmpty), this._calculateTheAverage(oCountHoursCredit, oCountCreditIsNotEmpty), this._calculateTheAverage(oCountMinCredit, oCountCreditIsNotEmpty), this._calculateTheAverage(oCountSecCredit, oCountCreditIsNotEmpty)),
                                oAverageTransport  = this._validTheTime(this._calculateTheAverage(oCountDaysTransport, oCountTransportIsNotEmpty), this._calculateTheAverage(oCountHoursTransport, oCountTransportIsNotEmpty), this._calculateTheAverage(oCountMinTransport, oCountTransportIsNotEmpty), this._calculateTheAverage(oCountSecTransport, oCountTransportIsNotEmpty)),
                                oAverageInvoicing  = this._validTheTime(this._calculateTheAverage(oCountDaysInvoicing, oCountInvoicingIsNotEmpty), this._calculateTheAverage(oCountHoursInvoicing, oCountInvoicingIsNotEmpty), this._calculateTheAverage(oCountMinInvoicing, oCountInvoicingIsNotEmpty), this._calculateTheAverage(oCountSecInvoicing, oCountInvoicingIsNotEmpty)),
                                oAverageTotal      = this._validTheTime(this._calculateTheAverage(oCountDaysTotal, oDivisor), this._calculateTheAverage(oCountHoursTotal, oDivisor), this._calculateTheAverage(oCountMinTotal, oDivisor), this._calculateTheAverage(oCountSecTotal, oDivisor));

                            //Preenche os campos de média de cada ciclo
                            oModel.averageSalesOrder = oAverageSalesOrder.dateHoursFormatted;
                            oModel.averageShipping   = oAverageShipping.dateHoursFormatted;
                            oModel.averageCredit     = oAverageCredit.dateHoursFormatted;
                            oModel.averageTransport  = oAverageTransport.dateHoursFormatted;
                            oModel.averageInvoicing  = oAverageInvoicing.dateHoursFormatted;
                            oModel.averageTotal      = oAverageTotal.dateHoursFormatted;

                            oModel.averageSalesOrderDateHours = oAverageSalesOrder.dateHours;
                            oModel.averageShippingDateHours   = oAverageShipping.dateHours;
                            oModel.averageCreditDateHours     = oAverageCredit.dateHours;
                            oModel.averageTransportDateHours  = oAverageTransport.dateHours;
                            oModel.averageInvoicingDateHours  = oAverageInvoicing.dateHours;
                            oModel.averageTotalDateHours      = oAverageTotal.dateHours;


                            let oSaleOrder = this._calculateTheDifferenceDays(oModel.averageSalesOrderDateHours, 
                                {
                                    days: Number(oData.results[0].SaleorderDays),
                                    hours: Number(oData.results[0].SaleorderHours),
                                    minutes: Number(oData.results[0].SaleorderMin),
                                    seconds: Number(oData.results[0].SaleorderSec)
                                }
                            );
    
                            let oShipping = this._calculateTheDifferenceDays(oModel.averageShippingDateHours, 
                                {
                                    days: Number(oData.results[0].ShippingDays),
                                    hours: Number(oData.results[0].ShippingHours),
                                    minutes: Number(oData.results[0].ShippingMin),
                                    seconds: Number(oData.results[0].ShippingSec)
                                }
                            );
    
                            let oCredit = this._calculateTheDifferenceDays(oModel.averageCreditDateHours, 
                                {
                                    days: Number(oData.results[0].CreditDays),
                                    hours: Number(oData.results[0].CreditHours),
                                    minutes: Number(oData.results[0].CreditMin),
                                    seconds: Number(oData.results[0].CreditSec)
                                }
                            );
    
                            let oTransport = this._calculateTheDifferenceDays(oModel.averageTransportDateHours, 
                                {
                                    days: Number(oData.results[0].TransportDays),
                                    hours: Number(oData.results[0].TransportHours),
                                    minutes: Number(oData.results[0].TransportMin),
                                    seconds: Number(oData.results[0].TransportSec)
                                }
                            );
    
                            let oInvoicing = this._calculateTheDifferenceDays(oModel.averageInvoicingDateHours, 
                                {
                                    days: Number(oData.results[0].InvoicingDays),
                                    hours: Number(oData.results[0].InvoicingHours),
                                    minutes: Number(oData.results[0].InvoicingMin),
                                    seconds: Number(oData.results[0].InvoicingSec)
                                }
                            );
    
                            let oTotal = this._calculateTheDifferenceDays(oModel.averageTotalDateHours, 
                                {
                                    days: Number(oData.results[0].TotalDays),
                                    hours: Number(oData.results[0].TotalHours),
                                    minutes: Number(oData.results[0].TotalMin),
                                    seconds: Number(oData.results[0].TotalSec)
                                }
                            );
    
                            oModel.averageSalesOrderDiff = oSaleOrder.dateHourFormatted;
                            oModel.State.averageSalesOrder.ValueState = oSaleOrder.state;
                            oModel.State.averageSalesOrder.color      = oSaleOrder.color;
                            this.byId("saleOrder").addStyleClass(oSaleOrder.class);
    
                            oModel.averageShippingDiff   = oShipping.dateHourFormatted;
                            oModel.State.averageShipping.ValueState = oShipping.state;
                            oModel.State.averageShipping.color      = oShipping.color;
                            this.byId("shipping").addStyleClass(oShipping.class);
    
                            oModel.averageCreditDiff     = oCredit.dateHourFormatted;
                            oModel.State.averageCredit.ValueState = oCredit.state;
                            oModel.State.averageCredit.color      = oCredit.color;
                            this.byId("credit").addStyleClass(oCredit.class);
    
                            oModel.averageTransportDiff  = oTransport.dateHourFormatted;
                            oModel.State.averageTransport.ValueState = oTransport.state;
                            oModel.State.averageTransport.color      = oTransport.color;
                            this.byId("transport").addStyleClass(oTransport.class);
    
                            oModel.averageInvoicingDiff  = oInvoicing.dateHourFormatted;
                            oModel.State.averageInvoicing.ValueState = oInvoicing.state;
                            oModel.State.averageInvoicing.color      = oInvoicing.color;
                            this.byId("invoicing").addStyleClass(oInvoicing.class);
    
                            oModel.averageTotalDiff      = oTotal.dateHourFormatted;
                            oModel.State.averageTotal.ValueState = oTotal.state;
                            oModel.State.averageTotal.color      = oTotal.color;
                            this.byId("totalTime").addStyleClass(oTotal.class);

                            //SLA cadastrado pelo usuário
                            oModel.averageCreditSLA     = `${oData.results[0].CreditDays} dias ${oData.results[0].CreditHours} Horas ${oData.results[0].CreditMin} Min e ${oData.results[0].CreditSec} Seg`;
                            oModel.averageInvoicingSLA  = `${oData.results[0].InvoicingDays} dias ${oData.results[0].InvoicingHours} Horas ${oData.results[0].InvoicingMin} Min e ${oData.results[0].InvoicingSec} Seg`;
                            oModel.averageSalesOrderSLA = `${oData.results[0].SaleorderDays} dias ${oData.results[0].SaleorderHours} Horas ${oData.results[0].SaleorderMin} Min e ${oData.results[0].SaleorderSec} Seg`;
                            oModel.averageShippingSLA   = `${oData.results[0].ShippingDays} dias ${oData.results[0].ShippingHours} Horas ${oData.results[0].ShippingMin} Min e ${oData.results[0].ShippingSec} Seg`;
                            oModel.averageTotalSLA      = `${oData.results[0].TotalDays} dias ${oData.results[0].TotalHours} Horas ${oData.results[0].TotalMin} Min e ${oData.results[0].TotalSec} Seg`;
                            oModel.averageTransportSLA  = `${oData.results[0].TransportDays} dias ${oData.results[0].TransportHours} Horas ${oData.results[0].TransportMin} Min e ${oData.results[0].TransportSec} Seg`;

                        }

                        oModel.items = oItems;
                        this.getModel("orders").refresh(true);

                        this.getModel("orderTexts").setProperty("/headerTextTitle", this.getResourceBundle().getText("mainPanelHeaderTextLength", [oItems.length]));

                        this.byId("averageMediaSalesOrders").setVisible(true);

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
                    oId         = oEvent.getParameter("id"),
                    oPosition   = oId.indexOf("Setor"),
                    bValid      = false,
                    bValidSetor = false;

                if(oModel.selectionSetorAt === "") {
                    oModel.State.selectionSetorAt.ValueState     = sap.ui.core.ValueState.Error;
                    oModel.State.selectionSetorAt.ValueStateText = this.getResourceBundle().getText("validationFieldRequired");
                }else{
                    oModel.State.selectionSetorAt.ValueState     = sap.ui.core.ValueState.None;
                    oModel.State.selectionSetorAt.ValueStateText = "";

                    bValidSetor = true;
                }
               
                aFieldClass.forEach(sField => {
                    if(oModel[sField].length === 0 || oModel[sField] === "") {
                        oModel.State[sField].ValueState     = sap.ui.core.ValueState.Error;
                        oModel.State[sField].ValueStateText = this.getResourceBundle().getText("validationFieldRequired");
                    } else {
                        oModel.State[sField].ValueState     = sap.ui.core.ValueState.None;
                        oModel.State[sField].ValueStateText = "";

                        bValid = true;
                    }
                });

                /*if(oPosition != -1){
                    if(oValueSetor === ""){
                        oModel.State.selectionSetorAt.ValueState     = sap.ui.core.ValueState.Error;
                        oModel.State.selectionSetorAt.ValueStateText = this.getResourceBundle().getText("validationFieldRequired");
                    }else{
                        oModel.State.selectionSetorAt.ValueState     = sap.ui.core.ValueState.None;
                        oModel.State.selectionSetorAt.ValueStateText = "";

                        bValidSetor = true;
                    }
                }*/

                if(bValid && bValidSetor){
                    oModel.buttonStartVisible = true;
                }else{
                    oModel.buttonStartVisible = false;
                }

                this.getModel("filters").refresh(true);
            },

            onPressMicro: function(oEvent){
                this.byId("averageMediaSalesOrders").setVisible(false);

                this.byId("panelTableSalesOrders").setVisible(true);
            },
            
            onPressMacro: function(oEvent){
                this.byId("panelTableSalesOrders").setVisible(false);

                this.byId("averageMediaSalesOrders").setVisible(true);
            },
            /* =========================================================== */
            /* internal methods                                            */
            /* =========================================================== */
            _onObjectMatched: async function(oEvent){
                this.setAppBusy(true);

                this.byId("panelTableSalesOrders").setVisible(false);

                this.byId("averageMediaSalesOrders").setVisible(false);

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

            _calculateTotalTimeAndAverage(sModel){
                /*sModel.items(sOrder => {
                    sOrder.ateHour
                });*/
            },

            _calculateTheAverage: function(sValue, sDivisor){
                let oResultValue = 0;

                if(sDivisor != 0){
                    oResultValue = `${sValue / sDivisor}`;

                    let oPosition = oResultValue.indexOf(".");

                    if(oPosition != -1) oResultValue = oResultValue.substring(0, oPosition);
                }

                return oResultValue;
            },

            _calculateTheDifferenceDays: function(sModel, sModelSLA){
                if(sModel.days    != 0 &&
                   sModel.hours   != 0 &&
                   sModel.minutes != 0 &&
                   sModel.seconds != 0 )
                {

                    let { oResultDays, oResultHours, oResultMin, oResultSec } = this._calculateTheTime(sModel, sModelSLA);

                    if(oResultDays < 0){
                        return {
                            dateHours: {
                                days: oResultDays,
                                hours: oResultHours,
                                minutes: oResultMin,
                                seconds: oResultSec
                            },
                            state: sap.ui.core.ValueState.Error,
                            color: "#FF0000",
                            class: "colorError",
                            dateHourFormatted: `${oResultDays} dias ${oResultHours} Horas ${oResultMin} Min e ${oResultSec} Seg`
                        };
                    }else{
                        if(oResultHours < 0){
                            return {
                                dateHours: {
                                    days: oResultDays,
                                    hours: oResultHours,
                                    minutes: oResultMin,
                                    seconds: oResultSec
                                },
                                state: sap.ui.core.ValueState.Error,
                                color: "#FF0000",
                                class: "colorError",
                                dateHourFormatted: `${oResultDays} dias ${oResultHours} Horas ${oResultMin} Min e ${oResultSec} Seg`
                            };  
                        }else{
                            if(oResultMin < 0){
                                return {
                                    dateHours: {
                                        days: oResultDays,
                                        hours: oResultHours,
                                        minutes: oResultMin,
                                        seconds: oResultSec
                                    },
                                    state: sap.ui.core.ValueState.Error,
                                    color: "#FF0000",
                                    class: "colorError",
                                    dateHourFormatted: `${oResultDays} dias ${oResultHours} Horas ${oResultMin} Min e ${oResultSec} Seg`
                                };  
                            }else{
                                if(oResultSec < 0){
                                    return {
                                        dateHours: {
                                            days: oResultDays,
                                            hours: oResultHours,
                                            minutes: oResultMin,
                                            seconds: oResultSec
                                        },
                                        state: sap.ui.core.ValueState.Error,
                                        color: "#FF0000",
                                        class: "colorError",
                                        dateHourFormatted: `${oResultDays} dias ${oResultHours} Horas ${oResultMin} Min e ${oResultSec} Seg`
                                    };  
                                }

                                return {
                                    dateHours: {
                                        days: oResultDays,
                                        hours: oResultHours,
                                        minutes: oResultMin,
                                        seconds: oResultSec
                                    },
                                    state: sap.ui.core.ValueState.Success,
                                    color: "#008000",
                                    class: "colorSuccess",
                                    dateHourFormatted: `${oResultDays} dias ${oResultHours} Horas ${oResultMin} Min e ${oResultSec} Seg`
                                };  

                            }
                        }
                    }
                }else{
                    return {
                        dateHours: {
                            days: sModelSLA.days,
                            hours: sModelSLA.hours,
                            minutes: sModelSLA.minutes,
                            seconds: sModelSLA.seconds
                        },
                        state: sap.ui.core.ValueState.Success,
                        color: "#008000",
                        class: "colorSuccess",
                        dateHourFormatted: `${sModelSLA.days} dias ${sModelSLA.hours} Horas ${sModelSLA.minutes} Min e ${sModelSLA.seconds} Seg`
                    };
                }
            },

            _calculateTheTime: function(sModel, sModelSLA){
                let oResultDays,  // sModelSLA.days    - sModel.days,
                    oResultHours, // sModelSLA.hours   - sModel.hours,
                    oResultMin,   // sModelSLA.minutes - sModel.minutes,
                    oResultSec;   // sModelSLA.seconds - sModel.seconds;

                if(sModelSLA.seconds < sModel.seconds){
                    sModelSLA.minutes = sModelSLA.minutes - 1;
                    sModelSLA.seconds = sModelSLA.seconds + 60;

                    oResultSec = sModelSLA.seconds - sModel.seconds
                }else{
                    oResultSec = sModelSLA.seconds - sModel.seconds
                }

                if(sModelSLA.minutes < sModel.minutes){
                    sModelSLA.hours   = sModelSLA.hours - 1;
                    sModelSLA.minutes = sModelSLA.minutes + 60;

                    oResultMin = sModelSLA.minutes - sModel.minutes;
                }else{
                    oResultMin = sModelSLA.minutes - sModel.minutes;
                }

                if(sModelSLA.hours < sModel.hours){
                    sModelSLA.days  = sModelSLA.days - 1;
                    sModelSLA.hours = sModelSLA.hours + 24;

                    oResultHours = sModelSLA.hours - sModel.hours;
                }else{
                    oResultHours = sModelSLA.hours - sModel.hours;
                }

                oResultDays = sModelSLA.days - sModel.days;

                return {
                    oResultDays: Number(oResultDays),
                    oResultHours: Number(oResultHours),
                    oResultMin: Number(oResultMin),
                    oResultSec: Number(oResultSec)
                }
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
                    dateHours: {
                        days: Number(sDays),
                        hours: Number(sHours),
                        minutes: Number(sMin),
                        seconds: Number(sSec)
                    },
                    dateHoursFormatted: `${sDays} dias ${sHours} Horas ${sMin} Min e ${sSec} Seg`
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
