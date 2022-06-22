sap.ui.define([] , function () {
	"use strict";

	return {
		dateToAbap: function(sValue){
			let oDateFormatted = "";

			if(sValue != ""){
				let oDate = sValue.split("/");

				oDateFormatted = `${oDate[2]}${oDate[1]}${oDate[0]}`;
			}

			return oDateFormatted;
		}
        
	};

});