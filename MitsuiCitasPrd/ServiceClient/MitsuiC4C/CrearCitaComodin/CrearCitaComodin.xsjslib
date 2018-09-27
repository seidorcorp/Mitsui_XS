var textAccess 			= $.import("sap.hana.xs.i18n","text");
var bundle 				= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 				= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var destination_package = config.getText("package.project")+".ServiceClient.MitsuiC4C.CrearCitaComodin";
var utils 				= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.CrearCitaComodin","Utils");
var destination_name 	= "Conexion";
var oResponse			= {};

/**
 * @description Servicio que permite crear cita comodin en C4C
 * @creation David Villanueva 11/09/2018
 * @update
 */
function crearCitaComodinC4c(oParam){
		var responseClient;
		var oRequest = {};
		oRequest.oData = {};
		var bodyJson ='';
		var requestGenerica = '';
		try{
			var dest = $.net.http.readDestination(destination_package, destination_name);
			var client = new $.net.http.Client();
			var req = new $.net.http.Request($.net.http.POST, "/sap/bc/srt/scs/sap/yy6saj0kgy_wscitas?sap-vhost=my317791.crm.ondemand.com");
			 requestGenerica = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:glob="http://sap.com/xi/SAPGlobal20/Global">'+
				   '<soap:Header/>' +
			   			'<soap:Body>' +
					   		  '<glob:ActivityBOVNCitasCreacionCitaRequest_sync>' +
						            '<Activity>' +
							            '<TypeCode listID="" listVersionID="" listAgencyID="">12</TypeCode>'+
							            '<ProcessingTypeCode>0001</ProcessingTypeCode>'+
							            '<ScheduledStartDateTime timeZoneCode="UTC-5">'+oParam.dFechaInicio+'</ScheduledStartDateTime>'+
							            '<ScheduledEndDateTime timeZoneCode="UTC-5">'+oParam.dFechaFin+'</ScheduledEndDateTime>'+
							            '<FullDayIndicator>false</FullDayIndicator>'+
							            '<zIDCentro>'+oParam.sCodTaller+'</zIDCentro>'+
							            '<zEstadoCita listID="" listVersionID="" listAgencyID="">1</zEstadoCita>'+
							            '<zPlaca>'+oParam.sPlaca+'</zPlaca>'+
							            '<zClienteComodin>'+oParam.sNombreCliente+'</zClienteComodin>'+
							            '<MainActivityParty>'+
							               '<PartyName>CLIENTE COMODÍN NATURAL</PartyName>'+
							               '<RoleCode>34</RoleCode>'+
							               '<MainIndicator>true</MainIndicator>'+
							            '</MainActivityParty>'+
							            '<TextCollection TextListCompleteTransmissionIndicator="" ActionCode="01">'+
							               '<Text ActionCode="01">'+
							                  '<TypeCode listID="" listVersionID="" listAgencyID="" listAgencySchemeID="" listAgencySchemeAgencyID="">10002</TypeCode>'+
							                  '<LanguageCode>ES</LanguageCode>'+
							                  '<TextContent ActionCode="01">'+
							                     '<Text languageCode="ES">'+oParam.sObservacion+'</Text>'+
							                  '</TextContent>'+
							               '</Text>'+
							            '</TextCollection>'+
							         '</Activity>' +
						      '</glob:ActivityBOVNCitasCreacionCitaRequest_sync>'+
		      			'</soap:Body>'+
		   			'</soap:Envelope>';
			req.headers.set("Content-Type", "application/soap+xml");
			req.headers.set("Authorization","Basic "+config.getText("clave.ws.c4c"));
			req.setBody(requestGenerica);
			client.request(req, dest);
			responseClient = client.getResponse();
			bodyJson = responseClient.body.asString();
			var usuarioSap = utils.xml2toJsonCrearCita(bodyJson);
		
			if(usuarioSap.Activity !== undefined 
					&& usuarioSap.Activity.UUID  !== null 
						&& usuarioSap.Activity.UUID  !== ''){
				
				oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
				oResponse.sMessage 	= bundle.getText("msj.crear.cita.ok");
				oResponse.oData 	= usuarioSap;
				
			} else {
				
				oResponse.iCode 	= parseInt(bundle.getText("code.idf2"), 10);
				oResponse.sMessage 	= bundle.getText("msj.crear.cita.error",[usuarioSap.Log.Item[0].Note]);
			}
			
			return oResponse;
			
		}catch(e){
			oResponse.iCode 	= parseInt(bundle.getText("code.idt10"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt10",["crearCitaComodinC4c",e.toString() + " : " +requestGenerica]);
		}
		return oResponse;
}
