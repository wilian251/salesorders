sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function(JSONModel) {
	"use strict";
    return {	
		initModel: function(i18n, sModelProperty) {
			return [
                {
                    label: "Número Documento",
					property: "Vbeln",
					type: sap.ui.export.EdmType.String,
                    width: "6rem"
                },
                {
                    label: "Empresa",
					property: "Company",
					type: sap.ui.export.EdmType.String,
                    width: "10rem"
                },
                {
                    label: "Referência do Cliente",
					property: "CustomerReference",
				    type: sap.ui.export.EdmType.String,
                    width: "10rem"
                },
                {
                    label: "Data de referência do cliente",
					property: "CustomerReferenceDate",
				    type: sap.ui.export.EdmType.String,
                    width: "6rem"
                },
                {
                    label: "Organização de vendas",
					property: "SalesOrganization",
				    type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Emissor da ordem",
					property: "OrderIssuer",
				    type: sap.ui.export.EdmType.String,
                    width: "25rem"
                },
                {
                    label: "Tipo de documento de vendas",
				    property: "SalesDocumentType",
				    type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Usuário",
				    property: "Ernam",
				    type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Data Criação",
				    property: "Erdat",
				    type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Hora Criação",
				    property: "Erzet",
				    type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Ordem de Venda",
				    property: "SaleorderFormatted",
				    type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Crédito",
				    property: "CreditFormatted",
				    type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Remessa",
				    property: "ShippingFormatted",
				    type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Transporte",
				    property: "TransportFormatted",
					type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Faturamento",
				    property: "InvoicingFormatted",
					type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Total do Tempo",
				    property: "TotalFormatted",
					type: sap.ui.export.EdmType.String,
                    width: "8rem"
                }
            ]
		}
	};
});