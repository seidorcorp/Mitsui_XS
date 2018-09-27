var textAccess = $.import("sap.hana.xs.i18n","text");
var bundle = textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config = textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var destination_package = config.getText("package.project")+".ServiceClient.MitsuiSap.ClienteHistorialCitas";
var utils = $.import("MitsuiCitasPrd.ServiceClient.MitsuiSap.ClienteHistorialCitas","Utils");
var destination_name = "Conexion";
var oResponse={};

/**
 * @description Servicio que permite consultar el historial de citas del cliente
 * @creation David Villanueva 17/08/2018
 * @update
 */
function consultarClienteHistorialCitasSap(oParam){
		var responseClient;
		var oRequest = {};
		oRequest.oData = {};
		var bodyJson ='';
		try{
			
			var dest = $.net.http.readDestination(destination_package, destination_name);
			var client = new $.net.http.Client();
			var req = new $.net.http.Request($.net.http.POST, "/sap/bc/srt/rfc/sap/zwsdbm_interfaces/400/zwsdbm_interfaces/zwsdbm_interfaces");
			var requestGenerica = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style">'+
				   '<soap:Header/>' +
			   			'<soap:Body>' +
		      				'<urn:ZFmDbmConsultaOrdVlc>' +
		         				'<IvPlaca>'+ oParam.sPlaca +'</IvPlaca>' +
		         			'</urn:ZFmDbmConsultaOrdVlc>'+
		      			'</soap:Body>'+
		   			'</soap:Envelope>';
			req.headers.set("Content-Type", "application/soap+xml");
			req.headers.set("Authorization","Basic "+config.getText("clave.ws.sap"));
			req.headers.set("SAP-Connectivity-SCC-Location_ID", "CITAS");
			req.headers.set("CloudConnectorLocationId", "CITAS");
			//client.setTimeout(10000); 
			req.setBody(requestGenerica);
			client.request(req, dest);
			responseClient = client.getResponse();
			bodyJson = responseClient.body.asString();
			var usuarioSap = utils.xml2ObjectHistorial(bodyJson);
		
			if(usuarioSap.EtOrdVlc === undefined || usuarioSap.EtOrdVlc.item === undefined ){
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
			oResponse.sMessage = bundle.getText("msj.idt10",["consultarClienteHistorialCitasSap",e.toString() + " : " +bodyJson]);
		}
		return oResponse;
}
