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
                    label: "Pedido venda Inicio",
				    property: "Saleorder",
				    type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Pedido venda Final",
				    property: "SaleorderFinish",
				    type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Crédito Inicio",
				    property: "Credit",
				    type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Crédito Final",
				    property: "CreditFinish",
				    type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Remessa Inicio",
				    property: "Shipping",
				    type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Remessa Final",
				    property: "ShippingFinish",
				    type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Transporte Inicio",
				    property: "Transport",
					type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Transporte Final",
				    property: "TransportFinish",
					type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Faturamento Inicio",
				    property: "Invoicing",
					type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Faturamento Final",
				    property: "InvoicingFinish",
					type: sap.ui.export.EdmType.String,
                    width: "8rem"
                }
            ]
		}
	};
});