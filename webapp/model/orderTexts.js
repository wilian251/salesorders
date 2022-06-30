sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function(JSONModel) {
	"use strict";

	return {
		initSelectionModel: function(oI18n) {
			return {
				headerTextTitle: oI18n.headerTextTitle,
				State: {
					headerTextTitle: {
						Enabled: true,
						Visible: false,
                        ValueState: sap.ui.core.ValueState.None,
                        ValueStateText: ""
					}
				}
			};
		}
	};
});