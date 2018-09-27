var textAccess 			= $.import("sap.hana.xs.i18n","text");
var bundle 				= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 				= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var destination_package = config.getText("package.project")+".ServiceClient.MitsuiC4C.ActualizarCita";
var utils 				= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.ActualizarCita","Utils");
var destination_name 	= "Conexion";
var oResponse			= {};

/**
 * @description Servicio que permite actualizar el estado de la cita en C4C
 * @creation David Villanueva 02/09/2018
 * @update
 */
function actualizarEstadoCitaC4c(oParam){
		var responseClient;
		var oRequest = {};
		oRequest.oData = {};
		var bodyJson ='';
		try{
			var dest = $.net.http.readDestination(destination_package, destination_name);
			var client = new $.net.http.Client();
			var req = new $.net.http.Request($.net.http.POST, "/sap/bc/srt/scs/sap/manageappointmentactivityin1?sap-vhost=my330968.crm.ondemand.com");
			var requestGenerica = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:glob="http://sap.com/xi/SAPGlobal20/Global" xmlns:yax="http://0002961282-one-off.sap.com/YAXZZOWOY_">'+
				   '<soap:Header/>'+
						   '<soap:Body>'+
						      '<glob:AppointmentActivityBundleMaintainRequest_sync_V1>'+
						         '<AppointmentActivity actionCode="04" AttendeePartyListCompleteTransimissionIndicator="" referencePartyListCompleteTransimissionIndicator="" businessTransactionDocumentReferenceListCompleteTransmissionIndicator="" textListCompleteTransimissionIndicator="" ContactPartyListCompleteTransmissionIndicator="">'+
								 '<UUID schemeID="" schemeAgencyID="">'+oParam.sIdCita+'</UUID>'+
								 '<LifeCycleStatusCode>4</LifeCycleStatusCode>'+
								 '<yax:zEstadoCita listID="" listVersionID="" listAgencyID="">'+oParam.iIdEstadoCita+'</yax:zEstadoCita>'+
								 '<yax:zVieneHCP>X</yax:zVieneHCP>'+
								'</AppointmentActivity>'+
						      '</glob:AppointmentActivityBundleMaintainRequest_sync_V1>'+
					  '</soap:Body>'+
		   			'</soap:Envelope>';
			req.headers.set("Content-Type", "application/soap+xml");
			req.headers.set("Authorization","Basic "+config.getText("clave.ws.c4c"));
			req.setBody(requestGenerica);
			client.request(req, dest);
			responseClient = client.getResponse();
			bodyJson = responseClient.body.asString();
			var cita = utils.xml2toJsonActualizarEstadoCita(bodyJson);
		
			if(cita.AppointmentActivity !== undefined 
					&& cita.AppointmentActivity.UUID !== undefined){
				oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
				oResponse.sMessage 	= bundle.getText("msj.idf1");
				oResponse.oData 	= cita;
				
			} else {
				oResponse.iCode 	= parseInt(bundle.getText("code.idf2"), 10);
				oResponse.sMessage 	= bundle.getText("msj.cita.update.error",[""]);
				oResponse.oData 	= bodyJson;
			}
			
			return oResponse;
			
		}catch(e){
			oResponse.iCode = parseInt(bundle.getText("code.idt10"), 10);
			oResponse.sMessage = bundle.getText("msj.idt10",["actualizarEstadoCitaC4c",e.toString() + " : " +bodyJson]);
		}
		return oResponse;
}
