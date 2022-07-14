sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function(JSONModel) {
	"use strict";
    return {	
		initModel: function() {
			return {
				averageSalesOrder: "",
				averageShipping: "",
				averageCredit: "",
				averageTransport: "",
				averageInvoicing: "",
				averageTotal: "",
				averageSalesOrderDiff: "",
				averageShippingDiff: "",
				averageCreditDiff: "",
				averageTransportDiff: "",
				averageInvoicingDiff: "",
				averageTotalDiff: "",
				averageSalesOrderDateHours: "",
				averageShippingDateHours: "", 
                averageCreditDateHours: "", 
                averageTransportDateHours: "",
                averageInvoicingDateHours: "", 
                averageTotalDateHours: "", 
				averageSalesOrderSLA: "",
				averageShippingSLA: "",
				averageCreditSLA: "",
				averageTransportSLA: "",
				averageInvoicingSLA: "",
				averageTotalSLA: "",
				State: {
					averageSalesOrder: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: "",
						color: ""
                    },
					averageShipping: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: "",
						color: ""
                    },
					averageCredit: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: "",
						color: ""
                    },
					averageTransport: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: "",
						color: ""
                    },
					averageInvoicing: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: "",
						color: ""
                    },
					averageTotal: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: "",
						color: ""
                    },
					averageSalesOrderSLA: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: "",
						color: ""
                    },
					averageShippingSLA: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: "",
						color: ""
                    },
					averageCreditSLA: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: "",
						color: ""
                    },
					averageTransportSLA: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: "",
						color: ""
                    },
					averageInvoicingSLA: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: "",
						color: ""
                    },
					averageTotalSLA: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: "",
						color: ""
                    }
				},
			    items: []
				/*	
				color: "#008000"
				color: "#FFA500"
				color: "#FF0000"
				color: "#0000FF"
				*/
			};
		}
	};
});