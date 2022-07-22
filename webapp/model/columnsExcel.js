sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function(JSONModel) {
	"use strict";
    return {	
		initModel: function(i18n) {
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
                    width: "15rem"
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
                    width: "20rem"
                },
                {
                    label: "Bloqueio da remessa",
				    property: "Lifsk",
				    type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Setor de Atividade",
				    property: "Spart",
				    type: sap.ui.export.EdmType.String,
                    width: "20rem"
                },
                {
                    label: "Canal de Distribuição",
				    property: "Vtweg",
				    type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Usuário",
				    property: "Ernam",
				    type: sap.ui.export.EdmType.String,
                    width: "20rem"
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
                    label: "Data de Modificação",
				    property: "Aedat",
				    type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Pedido Venda Data Inicial",
				    property: "SaleorderDateInitial",
				    type: sap.ui.export.EdmType.String,
                    width: "12rem"
                },
                {
                    label: "Pedido Venda Data Final",
				    property: "SaleorderDateFinal",
				    type: sap.ui.export.EdmType.String,
                    width: "12rem"
                },
                {
                    label: "Pedido Venda Hora Inicial",
				    property: "SaleorderHourInitial",
				    type: sap.ui.export.EdmType.String,
                    width: "12rem"
                },
                {
                    label: "Pedido Venda Hora Final",
				    property: "SaleorderHourFinal",
				    type: sap.ui.export.EdmType.String,
                    width: "12rem"
                },
                //Credito//////
                {
                    label: "Crédito Data Inicial",
				    property: "CreditDateInitial",
				    type: sap.ui.export.EdmType.String,
                    width: "12rem"
                },
                {
                    label: "Crédito Data Final",
				    property: "CreditDateFinal",
				    type: sap.ui.export.EdmType.String,
                    width: "12rem"
                },
                {
                    label: "Crédito Hora Inicial",
				    property: "CreditHourInitial",
				    type: sap.ui.export.EdmType.String,
                    width: "12rem"
                },
                {
                    label: "Crédito Hora Final",
				    property: "CreditHourFinal",
				    type: sap.ui.export.EdmType.String,
                    width: "12rem"
                },
                //Remessa//////
                {
                    label: "Remessa Data Inicial",
				    property: "ShippingDateInitial",
				    type: sap.ui.export.EdmType.String,
                    width: "12rem"
                },
                {
                    label: "Remessa Data Final",
				    property: "ShippingDateFinal",
				    type: sap.ui.export.EdmType.String,
                    width: "12rem"
                },
                {
                    label: "Remessa Hora Inicial",
				    property: "ShippingHourInitial",
				    type: sap.ui.export.EdmType.String,
                    width: "12rem"
                },
                {
                    label: "Remessa Hora Final",
				    property: "ShippingHourFinal",
				    type: sap.ui.export.EdmType.String,
                    width: "12rem"
                },
                //Transporte//////
                {
                    label: "Transporte Data Inicial",
				    property: "TransportDateInitial",
				    type: sap.ui.export.EdmType.String,
                    width: "12rem"
                },
                {
                    label: "Transporte Data Final",
				    property: "TransportDateFinal",
				    type: sap.ui.export.EdmType.String,
                    width: "12rem"
                },
                {
                    label: "Transporte Hora Inicial",
				    property: "TransportHourInitial",
				    type: sap.ui.export.EdmType.String,
                    width: "12rem"
                },
                {
                    label: "Transporte Hora Final",
				    property: "TransportHourFinal",
				    type: sap.ui.export.EdmType.String,
                    width: "12rem"
                },
                //Faturamento//////
                {
                    label: "Faturamento Data Inicial",
				    property: "InvoicingDateInitial",
				    type: sap.ui.export.EdmType.String,
                    width: "12rem"
                },
                {
                    label: "Faturamento Data Final",
				    property: "InvoicingDateFinal",
				    type: sap.ui.export.EdmType.String,
                    width: "12rem"
                },
                {
                    label: "Faturamento Hora Inicial",
				    property: "InvoicingHourInitial",
				    type: sap.ui.export.EdmType.String,
                    width: "12rem"
                },
                {
                    label: "Faturamento Hora Final",
				    property: "InvoicingHourFinal",
				    type: sap.ui.export.EdmType.String,
                    width: "12rem"
                },

                //// Item //////
                {
                    label: "Etapa",
				    property: "TypeItem",
				    type: sap.ui.export.EdmType.String,
                    width: "10rem"
                },
                {
                    label: "Item N. Documento",
				    property: "VbelnItem",
				    type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Item do documento",
				    property: "PosnrItem",
				    type: sap.ui.export.EdmType.String,
                    width: "10rem"
                },
                {
                    label: "Item Quantidade",
				    property: "Kwmeng",
				    type: sap.ui.export.EdmType.String,
                    width: "8rem"
                },
                {
                    label: "Item Material",
				    property: "Matnr",
				    type: sap.ui.export.EdmType.String,
                    width: "30rem"
                },
                {
                    label: "Item Nome do responsável",
				    property: "ErnamItem",
				    type: sap.ui.export.EdmType.String,
                    width: "25rem"
                },
                {
                    label: "Item Data de Criação",
				    property: "ErdatItem",
				    type: sap.ui.export.EdmType.String,
                    width: "10rem"
                },
                {
                    label: "Item Hora de Criação",
				    property: "ErzetItem",
				    type: sap.ui.export.EdmType.String,
                    width: "10rem"
                },
            ]
		}
	};
});