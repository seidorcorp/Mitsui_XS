var textAccess 			= $.import("sap.hana.xs.i18n","text");
var bundle 				= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 				= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var destination_package = config.getText("package.project")+".ServiceClient.MitsuiC4C.CitasPendienteTaller";
var utils 				= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.CitasPendienteTaller","Utils");
var destination_name 	= "Conexion";
var oResponse			= {};

/**
 * @description Servicio que permite consultar las citas pendientes por taller
 * @creation David Villanueva 29/08/2018
 * @update
 */
function consultarCitasTallerC4C(oParam){
		var responseClient;
		var oRequest = {};
		oRequest.oData = {};
		var bodyJson ='';
		try{
			
			var dest = $.net.http.readDestination(destination_package, destination_name);
			var client = new $.net.http.Client();
			var req = new $.net.http.Request($.net.http.POST, "/sap/bc/srt/scs/sap/yyaxzzowoy_wscitas?sap-vhost=my330968.crm.ondemand.com");
			var requestGenerica = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:glob="http://sap.com/xi/SAPGlobal20/Global">'+
				   '<soap:Header/>' +
			   			'<soap:Body>' +
					   		  '<glob:ActivityBOVNCitasQueryByElementsSimpleByRequest_sync>' +
					            '<ActivitySimpleSelectionBy>' +
					            '<SelectionByTypeCode>' +
					               '<InclusionExclusionCode>I</InclusionExclusionCode>' +
					               '<IntervalBoundaryTypeCode>1</IntervalBoundaryTypeCode>' +
					               '<LowerBoundaryTypeCode listID="" listVersionID="" listAgencyID="">12</LowerBoundaryTypeCode>' +
					               '<UpperBoundaryTypeCode listID="" listVersionID="" listAgencyID=""></UpperBoundaryTypeCode>' +
					            '</SelectionByTypeCode>' +
					            '<SelectionByProcessingTypeCode>' +
					               '<InclusionExclusionCode>I</InclusionExclusionCode>' +
					               '<IntervalBoundaryTypeCode>1</IntervalBoundaryTypeCode>' +
					               '<LowerBoundaryProcessingTypeCode>0001</LowerBoundaryProcessingTypeCode>' +
					               '<UpperBoundaryProcessingTypeCode></UpperBoundaryProcessingTypeCode>' +
					            '</SelectionByProcessingTypeCode>' +
					            '<SelectionByLifeCycleStatusCode>' +
					               '<InclusionExclusionCode>I</InclusionExclusionCode>' +
					               '<IntervalBoundaryTypeCode>3</IntervalBoundaryTypeCode>' +
					               '<LowerBoundaryLifeCycleStatusCode>1</LowerBoundaryLifeCycleStatusCode>' +
					               '<UpperBoundaryLifeCycleStatusCode>2</UpperBoundaryLifeCycleStatusCode>' +
					            '</SelectionByLifeCycleStatusCode>' +
					            '<SelectionByScheduledStartDate>' +
					               '<InclusionExclusionCode>I</InclusionExclusionCode>' +
					               '<IntervalBoundaryTypeCode>3</IntervalBoundaryTypeCode>' +
					               '<LowerBoundaryScheduledStartDate>'+oParam.dFechaInicio+'</LowerBoundaryScheduledStartDate>' +
					               '<UpperBoundaryScheduledStartDate>'+oParam.dFechaFin+'</UpperBoundaryScheduledStartDate>' +
					            '</SelectionByScheduledStartDate>' +
					            '<SelectionByzIDCentro_5PEND6QL5482763O1SFB05YP5>' +
					               '<InclusionExclusionCode>I</InclusionExclusionCode>' +
					               '<IntervalBoundaryTypeCode>1</IntervalBoundaryTypeCode>' +
					               '<LowerBoundaryzIDCentro_5PEND6QL5482763O1SFB05YP5>'+oParam.sCodigoTaller+'</LowerBoundaryzIDCentro_5PEND6QL5482763O1SFB05YP5>' +
					               '<UpperBoundaryzIDCentro_5PEND6QL5482763O1SFB05YP5></UpperBoundaryzIDCentro_5PEND6QL5482763O1SFB05YP5>' +
					            '</SelectionByzIDCentro_5PEND6QL5482763O1SFB05YP5>' +
					            '<SelectionByzEstadoCita_5PEND6QL5482763O1SFB05YP5>' +
					               '<InclusionExclusionCode>I</InclusionExclusionCode>' +
					               '<IntervalBoundaryTypeCode>3</IntervalBoundaryTypeCode>' +
					               '<LowerBoundaryzEstadoCita_5PEND6QL5482763O1SFB05YP5 listID="" listVersionID="" listAgencyID="">1</LowerBoundaryzEstadoCita_5PEND6QL5482763O1SFB05YP5>' +
					               '<UpperBoundaryzEstadoCita_5PEND6QL5482763O1SFB05YP5 listID="" listVersionID="" listAgencyID="">2</UpperBoundaryzEstadoCita_5PEND6QL5482763O1SFB05YP5>' +
					            '</SelectionByzEstadoCita_5PEND6QL5482763O1SFB05YP5>' +
					         '</ActivitySimpleSelectionBy>' +
					      '</glob:ActivityBOVNCitasQueryByElementsSimpleByRequest_sync>'+
		      			'</soap:Body>'+
		   			'</soap:Envelope>';
			req.headers.set("Content-Type", "application/soap+xml");
			req.headers.set("Authorization","Basic "+config.getText("clave.ws.c4c"));
			req.setBody(requestGenerica);
			client.request(req, dest);
			responseClient = client.getResponse();
			bodyJson = responseClient.body.asString();
			var usuarioSap = utils.xml2toJsonConsultarCitas(bodyJson);
		
			if(usuarioSap.ProcessingConditions.ReturnedQueryHitsNumberValue === undefined 
					|| usuarioSap.ProcessingConditions.ReturnedQueryHitsNumberValue === null 
						|| parseInt(usuarioSap.ProcessingConditions.ReturnedQueryHitsNumberValue,10) === 0){
				oResponse.iCode = parseInt(bundle.getText("code.idf2"), 10);
				oResponse.sMessage = bundle.getText("msj.idf2");
			} else {
				oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
				oResponse.sMessage 	= bundle.getText("msj.idf1");
				oResponse.oData 	= usuarioSap;
			}
			
			return oResponse;
			
		}catch(e){
			oResponse.iCode = parseInt(bundle.getText("code.idt10"), 10);
			oResponse.sMessage = bundle.getText("msj.idt10",["consultarCitasTallerC4C",e.toString() + " : " +bodyJson]);
		}
		return oResponse;
}
