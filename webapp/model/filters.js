sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function(JSONModel) {
	"use strict";

	return {
		initSelectionModel: function() {
			return {
                selectionSalesOrg: "",
                selectionDateIn: "",
                selectionDateUpUntil: "",
                selectionCompany: [],
                selectionSetorAt: "",
                selectionCanalDist: [],
                selectionClient: [],
                selectionTypeOV: [],
                selectionLocalExp: "",
                buttonStartEnabled: false,
                buttonSaveVisible: false,
                buttonUpdateVisible: false,
                State: {
                    selectionSalesOrg: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    selectionDateIn: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    selectionDateUpUntil: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    selectionBukrs: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    selectionSetorAt: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    selectionCompany: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    selectionCanalDist: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    selectionClient: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    selectionTypeOV: {
                        Enabled: true,
						Visible: true,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
                    },
                    selectionLocalExp: {
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