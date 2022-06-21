sap.ui.define([] , function () {
	"use strict";

	return {
		dateToAbap: function(sValue){
			let oDate = sValue.split("/");

			return `${oDate[2]}${oDate[1]}${oDate[0]}`;
		}
        
	};

});