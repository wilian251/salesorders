sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function(JSONModel) {
	"use strict";
    return {	
		initModel: function() {
			return {
				leadTime:{
                    Vbeln: "",
                    CreditDays: "",
                    CreditHours: "",
                    CreditMin: "",
                    CreditSec: "",
                    InvoicingDays: "",
                    InvoicingHours: "",
                    InvoicingMin: "",
                    InvoicingSec: "",
                    SaleorderDays: "",
                    SaleorderHours: "",
                    SaleorderMin: "",
                    SaleorderSec: "",
                    ShippingDays: "",
                    ShippingHours: "",
                    ShippingMin: "",
                    ShippingSec: "",
                    TotalDays: "",
                    TotalHours: "",
                    TotalMin: "",
                    TotalSec: "",
                    TransportDays: "",
                    TransportHours: "",
                    TransportMin: "",
                    TransportSec: "",
                },
				State: {
                    CreditDays: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    CreditHours: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    CreditMin: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    CreditSec: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    InvoicingDays: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    InvoicingHours: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    InvoicingMin: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    InvoicingSec: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    SaleorderDays: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    SaleorderHours: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    SaleorderMin: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    SaleorderSec: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    ShippingDays: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    ShippingHours: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    ShippingMin: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    ShippingSec: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    TotalDays: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    TotalHours: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    TotalMin: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    TotalSec: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    TransportDays: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    TransportHours: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    TransportMin: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    TransportSec: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    }
				}
			};
		}
	};
});