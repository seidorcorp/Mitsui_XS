var textAccess 			= $.import("sap.hana.xs.i18n","text");
var bundle 				= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 				= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var destination_package = config.getText("package.project")+".ServiceClient.MitsuiC4C.CrearCita";
var utils 				= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.CrearCita","Utils");
var destination_name 	= "Conexion";
var oResponse			= {};

/**
 * @description Servicio que permite crear cita en C4C
 * @creation David Villanueva 02/09/2018
 * @update
 */
function crearCitaC4c(oParam){
		var responseClient;
		var oRequest 			= {};
		oRequest.oData 			= {};
		var bodyJson 			='';
		var requestGenerica 	= '';
		var tramaComodin 		= '';
		var tramaCitaReferencia = '';
		var tramaObservacion	='';
		try{
			var dest = $.net.http.readDestination(destination_package, destination_name);
			var client = new $.net.http.Client();
			var req = new $.net.http.Request($.net.http.POST, "/sap/bc/srt/scs/sap/manageappointmentactivityin1?sap-vhost=my330968.crm.ondemand.com");
			
			
			if(oParam.bClienteComodin!== undefined 
					&& oParam.bClienteComodin!== null 
						&& oParam.bClienteComodin !== '' 
							&& oParam.bClienteComodin === true){
				tramaComodin = '<yax:zClienteComodin>'+ oParam.sNomClienteComodin+'</yax:zClienteComodin>';
			}
			if(oParam.bActualizarCita!== undefined 
					&& oParam.bActualizarCita!== null 
						&& oParam.bActualizarCita !== '' 
							&& oParam.bActualizarCita === true){
				tramaCitaReferencia = '<BusinessTransactionDocumentReference actionCode="01">'+
										  '<UUID schemeID="" schemeAgencyID="">'+oParam.sIdCitaC4c+'</UUID>'+
										  '<TypeCode listID="" listVersionID="" listAgencyID="">12</TypeCode>'+
										  '<RoleCode>1</RoleCode>'+
										 '</BusinessTransactionDocumentReference>';
			}
			
			if(oParam.sObservacion!== undefined 
					&& oParam.sObservacion!== null 
						&& oParam.sObservacion !== ''){
				tramaObservacion = '<Text actionCode="01">' +
						               '<TextTypeCode listID="" listVersionID="" listAgencyID="" listAgencySchemeID="" listAgencySchemeAgencyID="">10002</TextTypeCode>' +
						               '<ContentText>'+oParam.sObservacion+'</ContentText>' +
						            '</Text>';
			}
			
			requestGenerica = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:glob="http://sap.com/xi/SAPGlobal20/Global" xmlns:yax="http://0002961282-one-off.sap.com/YAXZZOWOY_">'+
				   '<soap:Header/>' +
			   			'<soap:Body>' +
					   		  '<glob:AppointmentActivityBundleMaintainRequest_sync_V1>' +
						            '<AppointmentActivity actionCode="04" AttendeePartyListCompleteTransimissionIndicator="" referencePartyListCompleteTransimissionIndicator="" businessTransactionDocumentReferenceListCompleteTransmissionIndicator="" textListCompleteTransimissionIndicator="" ContactPartyListCompleteTransmissionIndicator="">' +
						            '<DocumentTypeCode>0001</DocumentTypeCode>' +
						            '<LifeCycleStatusCode>1</LifeCycleStatusCode>' +
						            '<MainActivityParty>' +
						               '<BusinessPartnerInternalID>'+oParam.iIdClienteC4c+'</BusinessPartnerInternalID>' +
						            '</MainActivityParty>' +
						            '<AttendeeParty>' +
						               '<EmployeeID>'+oParam.iIdParticipante+'</EmployeeID>' +
						            '</AttendeeParty>' + tramaCitaReferencia +
						            '<StartDateTime timeZoneCode="UTC-5">'+oParam.dFechaInicio+'</StartDateTime>' +
						            '<EndDateTime timeZoneCode="UTC-5">'+oParam.dFechaFin+'</EndDateTime>' +
						            tramaObservacion +
						            tramaComodin +
						            '<yax:zFechaHoraProbSalida>'+oParam.sFechaSalida+'</yax:zFechaHoraProbSalida>' +
						            '<yax:zHoraProbSalida>'+oParam.sHoraSalida+'</yax:zHoraProbSalida>' +
						            '<yax:zIDCentro>'+oParam.sCodTaller+'</yax:zIDCentro>' +
						            '<yax:zPlaca>'+oParam.sPlaca+'</yax:zPlaca>' +
						            '<yax:zEstadoCita listID="" listVersionID="" listAgencyID="">1</yax:zEstadoCita>' +
						            '<yax:zVieneHCP>X</yax:zVieneHCP>' +
						            '<yax:zExpress>'+oParam.bExpress+'</yax:zExpress>' +
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
//				usuarioSap.sTramaEnvia 	= requestGenerica;
//				usuarioSap.sTramaRecibe	= bodyJson;
				oResponse.iCode 		= parseInt(bundle.getText("code.idf1"), 10);
				oResponse.sMessage 		= bundle.getText("msj.crear.cita.ok");
				oResponse.oData 		= usuarioSap;
				
			} else {
				oResponse.iCode = parseInt(bundle.getText("code.idf2"), 10);
				var mensaje = usuarioSap.Log.Item[0].Note;
				if(mensaje.indexOf("intervalo") !== -1){
					oResponse.iCode = parseInt(bundle.getText("code.crear.cita.error.1"), 10);
					mensaje = bundle.getText("msj.crear.cita.error.1");
				}else{
					mensaje = bundle.getText("msj.crear.cita.error.2");
				}
				oResponse.sMessage 	= mensaje;
			}
			
			return oResponse;
			
		}catch(e){
			oResponse.iCode 	= parseInt(bundle.getText("code.idt10"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt10",["crearCitaC4c",e.toString() + " :  TRAMA ENVIADA ->> " +requestGenerica + "TRAMA RECIBIDA ->> " + bodyJson]);
		}
		return oResponse;
}
