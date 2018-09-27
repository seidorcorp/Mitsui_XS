var textAccess 			= $.import("sap.hana.xs.i18n","text");
var bundle 				= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 				= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var destination_package = config.getText("package.project")+".ServiceClient.MitsuiC4C.CrearOferta";
var utils 				= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.CrearOferta","Utils");
var destination_name 	= "Conexion";
var oResponse			= {};

/**
 * @description Servicio que permite crear una oferta en C4C
 * @creation David Villanueva 10/09/2018
 * @update
 */
function crearOfertaC4c(oParam){
		var responseClient;
		var oRequest = {};
		oRequest.oData = {};
		var bodyJson ='';
		var requestGenerica = '';
		try{
			var dest = $.net.http.readDestination(destination_package, destination_name);
			var client = new $.net.http.Client();
			var req = new $.net.http.Request($.net.http.POST, "/sap/bc/srt/scs/sap/customerquoteprocessingmanagec?sap-vhost=my330968.crm.ondemand.com");
			var sTramaObservacion = '';

			var aItems = '';
			var tramaExpress = '';
			if(oParam.bExpress === true){
				tramaExpress = '<Item actionCode="01" itemBTDReferenceListCompleteTransmissionIndicator="" textListCompleteTransimissionIndicator="">'+
						   '<ProcessingTypeCode>AGN</ProcessingTypeCode>'+
						   '<ItemProduct>'+
						    '<ProductID schemeID="" schemeAgencyID="" schemeAgencySchemeID="" schemeAgencySchemeAgencyID="">'+oParam.sProducCodExpress+'</ProductID>'+
						    '<ProductInternalID schemeID="" schemeAgencyID="">'+oParam.sProducCodInternoExpress+'</ProductInternalID>'+
						   '</ItemProduct>'+
						   '<ItemRequestedScheduleLine>'+
						    '<Quantity unitCode="EA">1</Quantity>'+
						   '</ItemRequestedScheduleLine>'+
						   '<yax:zOVPosIDTipoPosicion listID="?" listVersionID="?" listAgencyID="?">P009</yax:zOVPosIDTipoPosicion>' +
					    '</Item>';
			}
			for (var i = 0; i < oParam.aItems.length; i++) {
				aItems = aItems +  '<Item actionCode="01" itemBTDReferenceListCompleteTransmissionIndicator="" textListCompleteTransimissionIndicator="">' +
//						               '<ID>'+oParam.aItems[i].iId+'</ID>' +
						               '<ProcessingTypeCode>AGN</ProcessingTypeCode>' +
						               '<ItemProduct>' +
						                  '<ProductID schemeID="" schemeAgencyID="" schemeAgencySchemeID="" schemeAgencySchemeAgencyID="">'+oParam.aItems[i].sCodProducto+'</ProductID>' +
						                  '<ProductInternalID schemeID="" schemeAgencyID="">'+oParam.aItems[i].sCodProductoInterno+'</ProductInternalID>' +
						               '</ItemProduct>' +
						               '<ItemRequestedScheduleLine>' +
						                  '<Quantity unitCode="'+oParam.aItems[i].sUnidadMedida+'">'+oParam.aItems[i].Quantity+'</Quantity>' +
						               '</ItemRequestedScheduleLine>' +
						               '<yax:zOVPosIDTipoPosicion listID="?" listVersionID="?" listAgencyID="?">'+oParam.aItems[i].sIDTipoPosicion+'</yax:zOVPosIDTipoPosicion>' +
						               '<yax:zOVPosTipServ listID="" listVersionID="" listAgencyID="">P</yax:zOVPosTipServ>' +
						               '<yax:zOVPosCantTrab>'+oParam.aItems[i].sPosCantTrab+'</yax:zOVPosCantTrab>' +
						               '<yax:zID_PAQUETE>'+oParam.aItems[i].sCodPaquete+'</yax:zID_PAQUETE>' +
						               '<yax:zTIPO_PAQUETE>'+oParam.aItems[i].sTipoPaquete+'</yax:zTIPO_PAQUETE>' +
						               '<yax:zOVPosTiempoTeorico>'+oParam.aItems[i].sPosTiempoTeorico+'</yax:zOVPosTiempoTeorico>' +
						            '</Item>';
			}
			if(oParam.sMaterial !== undefined 
					&& oParam.sMaterial !== null 
						&& oParam.sMaterial !== ''){
					aItems = '<Item actionCode="" itemBTDReferenceListCompleteTransmissionIndicator="" textListCompleteTransimissionIndicator="">'+
//				               '<ID>10</ID>'+
				               '<ProcessingTypeCode>AGN</ProcessingTypeCode>'+
				               '<ItemProduct>'+
				                  '<ProductID schemeID="" schemeAgencyID="" schemeAgencySchemeID="" schemeAgencySchemeAgencyID="">'+oParam.sMaterial+'</ProductID>'+
				                  '<ProductInternalID schemeID="" schemeAgencyID="">'+oParam.sMaterial+'</ProductInternalID>'+
				               '</ItemProduct>'+
				               '<ItemRequestedScheduleLine>'+
				                  '<Quantity unitCode="EA">1</Quantity>'+
				               '</ItemRequestedScheduleLine>'+
				               '<yax:zOVPosIDTipoPosicion listID="?" listVersionID="?" listAgencyID="?">P010</yax:zOVPosIDTipoPosicion>' +
				            '</Item>';
			}
			if(oParam.sObservacion !== undefined 
					&& oParam.sObservacion !== null 
						&& oParam.sObservacion !== ''){
				sTramaObservacion = '<Text actionCode="01">'+
	               '<TextTypeCode listID="" listVersionID="" listAgencyID="" listAgencySchemeID="" listAgencySchemeAgencyID="">10024</TextTypeCode>'+
	               '<ContentText>'+oParam.sObservacion+'</ContentText>'+
	            '</Text>';
				
			}
			
			requestGenerica = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:glob="http://sap.com/xi/SAPGlobal20/Global" xmlns:yax="http://0002961282-one-off.sap.com/YAXZZOWOY_">'+
				   '<soap:Header/>' +
			   			'<soap:Body>' +
					   		  '<glob:CustomerQuoteBundleMaintainRequest_sync_V1>' +
						            '<CustomerQuote actionCode="01" ViewObjectIndicator="" businessTransactionDocumentReferenceListCompleteTransmissionIndicator="" salesEmployeePartyListCompleteTransmissionIndicator="" otherPartyListCompleteTransmissionIndicator="" competitorPartyListCompleteTransmissionIndicator="" salesPartnerListCompleteTransmissionIndicator="" itemListCompleteTransmissionIndicator="" textListCompleteTransimissionIndicator="" approverPartyListCompleteTransmissionIndicator="">' +
						            '<ProcessingTypeCode>Z300</ProcessingTypeCode>' +
						            '<BuyerID schemeID="" schemeAgencyID="" schemeAgencySchemeAgencyID=""/>' +
						            '<Name languageCode="ES">OFERTA</Name>' +
						            '<DocumentLanguageCode>ES</DocumentLanguageCode>' +
						            '<BuyerParty contactPartyListCompleteTransmissionIndicator="">' +
						               '<BusinessPartnerInternalID>'+oParam.iIdCliente+'</BusinessPartnerInternalID>' +
						            '</BuyerParty>' +
						            '<EmployeeResponsibleParty>' +
						               '<EmployeeID>8000000010</EmployeeID>' +
						            '</EmployeeResponsibleParty>' +
						            '<SellerParty>' +
						               '<OrganisationalCentreID>GMIT</OrganisationalCentreID>' +
						            '</SellerParty>' +
						            '<SalesUnitParty>' +
						               '<OrganisationalCentreID>'+oParam.sIdOrganizacion+'</OrganisationalCentreID>' +
						            '</SalesUnitParty>' +
						            '<SalesAndServiceBusinessArea>' +
						               '<SalesOrganisationID>'+oParam.sIdOrganizacion+'</SalesOrganisationID>' +
						               '<SalesOfficeID>'+oParam.sIdOficina+'</SalesOfficeID>' +
						               '<SalesGroupID>'+oParam.sIdGrupo+'</SalesGroupID>' +
						               '<DistributionChannelCode listID="" listVersionID="" listAgencyID="" listAgencySchemeID="" listAgencySchemeAgencyID="">'+oParam.sIdCanal+'</DistributionChannelCode>' +
						               '<DivisionCode listID="" listVersionID="" listAgencyID="" listAgencySchemeID="" listAgencySchemeAgencyID="">'+oParam.sIdDivision+'</DivisionCode>' +
						            '</SalesAndServiceBusinessArea>'+ tramaExpress + aItems +
						            '<BusinessTransactionDocumentReference actionCode="01">' +
						               '<UUID schemeID="" schemeAgencyID="">'+oParam.sIdCitaC4C+'</UUID>' +
						               '<TypeCode listID="" listVersionID="" listAgencyID="">12</TypeCode>' +
						               '<RoleCode>1</RoleCode>' +
						            '</BusinessTransactionDocumentReference>' +
						            sTramaObservacion + 
						            '<yax:zOVGrupoVendedores>'+oParam.sIdGrupo+'</yax:zOVGrupoVendedores>' +
						            '<yax:zOVIDCentro>'+oParam.sCodTaller+'</yax:zOVIDCentro>' +
						            '<yax:zOVIDCita/>' +
						            '<yax:zOVPlaca>'+oParam.sPlaca+'</yax:zOVPlaca>' +
						            '<yax:zOVVieneDeHCI>X</yax:zOVVieneDeHCI>'+
						            '<yax:zOVServExpress>'+oParam.bExpress+'</yax:zOVServExpress>'+
						         '</CustomerQuote>' +
						      '</glob:CustomerQuoteBundleMaintainRequest_sync_V1>'+
		      			'</soap:Body>'+
		   			'</soap:Envelope>';
			req.headers.set("Content-Type", "application/soap+xml");
			req.headers.set("Authorization","Basic "+config.getText("clave.ws.c4c"));
			req.setBody(requestGenerica);
			client.request(req, dest);
			responseClient = client.getResponse();
			bodyJson = responseClient.body.asString();
			var usuarioSap = utils.xml2toJsonCrearCita(bodyJson);
			
			if(usuarioSap.CustomerQuote !== undefined 
					&& usuarioSap.CustomerQuote.UUID  !== null 
						&& usuarioSap.CustomerQuote.UUID  !== ''){
				usuarioSap.sTramaEnvia 	= requestGenerica;
				usuarioSap.sTramaRecibe	= bodyJson;
				oResponse.iCode 		= parseInt(bundle.getText("code.idf1"), 10);
				oResponse.sMessage 		= bundle.getText("msj.crear.oferta.ok");
				oResponse.oData 		= usuarioSap;
			} else {
				oResponse.iCode 	= parseInt(bundle.getText("code.idf2"), 10);
				oResponse.sMessage 	= bundle.getText("msj.crear.oferta.error",[usuarioSap.Log.Item[0].Note + " --- Trama Enviada: " + requestGenerica + "---Trama Respuesta: " + bodyJson]);
				//oResponse.sMessage  = requestGenerica
			}
			
			return oResponse;
			
		}catch(e){
			oResponse.iCode 	= parseInt(bundle.getText("code.idt10"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt10",["crearOfertaC4c",e.toString() + " --- Trama Enviada: " + requestGenerica + "---Trama Respuesta: " + bodyJson]);
		}
		return oResponse;
}
