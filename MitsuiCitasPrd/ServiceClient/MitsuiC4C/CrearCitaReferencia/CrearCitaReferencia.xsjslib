var textAccess 			= $.import("sap.hana.xs.i18n","text");
var bundle 				= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 				= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var destination_package = config.getText("package.project")+".ServiceClient.MitsuiC4C.CrearCitaReferencia";
var utils 				= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.CrearCitaReferencia","Utils");
var destination_name 	= "Conexion";
var oResponse			= {};

/**
 * @description Servicio que permite crear cita con referencia en C4C
 * @creation David Villanueva 11/09/2018
 * @update
 */
function crearCitaReferenciaC4c(oParam){
		var responseClient;
		var oRequest = {};
		oRequest.oData = {};
		var bodyJson ='';
		var requestGenerica = '';
		try{
			var dest = $.net.http.readDestination(destination_package, destination_name);
			var client = new $.net.http.Client();
			var req = new $.net.http.Request($.net.http.POST, "/sap/bc/srt/scs/sap/manageappointmentactivityin1?sap-vhost=my317791.crm.ondemand.com");
			 requestGenerica = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:glob="http://sap.com/xi/SAPGlobal20/Global" xmlns:y6s="http://0002961282-one-off.sap.com/Y6SAJ0KGY_">'+
				   '<soap:Header/>' +
			   			'<soap:Body>' +
					   		  '<glob:AppointmentActivityBundleMaintainRequest_sync_V1>' +
						            '<AppointmentActivity actionCode="04" AttendeePartyListCompleteTransimissionIndicator="" referencePartyListCompleteTransimissionIndicator="" businessTransactionDocumentReferenceListCompleteTransmissionIndicator="" textListCompleteTransimissionIndicator="" ContactPartyListCompleteTransmissionIndicator="">' +
						            '<DocumentTypeCode>0001</DocumentTypeCode>' +
						            '<LifeCycleStatusCode>1</LifeCycleStatusCode>' +
						            '<StartDateTime timeZoneCode="UTC-5">'+oParam.dFechaInicio+'</StartDateTime>' +
						            '<EndDateTime timeZoneCode="UTC-5">'+oParam.dFechaFin+'</EndDateTime>' +
						            '<FullDayIndicator>false</FullDayIndicator>' +
						            '<Text actionCode="01">' +
						               '<TextTypeCode listID="" listVersionID="" listAgencyID="" listAgencySchemeID="" listAgencySchemeAgencyID="">10002</TextTypeCode>' +
						               '<ContentText>CITA ACTUALIZADA DESDE MOVIL</ContentText>' +
						            '</Text>' +
						            '<BusinessTransactionDocumentReference actionCode="01">' +
						               '<UUID schemeID="" schemeAgencyID="">'+oParam.sIdCitaC4c+'</UUID>' +
						               '<TypeCode listID="" listVersionID="" listAgencyID="">12</TypeCode>' +
						               '<RoleCode>1</RoleCode>' +
						            '</BusinessTransactionDocumentReference>' +
						            '<y6s:zIDCentro>'+oParam.sCodTaller+'</y6s:zIDCentro>' +
						            '<y6s:zPlaca>'+oParam.sPlaca+'</y6s:zPlaca>' +
						            '<y6s:zEstadoCita listID="" listVersionID="" listAgencyID="">1</y6s:zEstadoCita>' +
						          '</AppointmentActivity>' +
						      '</glob:AppointmentActivityBundleMaintainRequest_sync_V1>'+
		      			'</soap:Body>'+
		   			'</soap:Envelope>';
			req.headers.set("Content-Type", "application/soap+xml");
			req.headers.set("Authorization","Basic "+config.getText("clave.ws.c4c"));
			req.setBody(requestGenerica);
			client.request(req, dest);
			responseClient = client.getResponse();
			bodyJson = responseClient.body.asString();
			var usuarioSap = utils.xml2toJsonCrearCita(bodyJson);
		
			if(usuarioSap.AppointmentActivity !== undefined 
					&& usuarioSap.AppointmentActivity.UUID  !== null 
						&& usuarioSap.AppointmentActivity.UUID  !== ''){
				oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
				oResponse.sMessage 	= bundle.getText("msj.cita.update.ok");
				oResponse.oData 	= usuarioSap;
			} else {
				oResponse.iCode 	= parseInt(bundle.getText("code.idf2"), 10);
				oResponse.sMessage 	= bundle.getText("msj.cita.update.error",[usuarioSap.Log.Item[0].Note]);
			}
			
			return oResponse;
			
		}catch(e){
			oResponse.iCode 	= parseInt(bundle.getText("code.idt10"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt10",["crearCitaReferenciaC4c",e.toString() + " --- Trama Enviada: " + requestGenerica + "---Trama Respuesta: " + bodyJson]);
		}
		return oResponse;
}
