var textAccess 				= $.import("sap.hana.xs.i18n","text");
var bundle 					= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 					= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var destination_package 	= config.getText("package.project")+".ServiceClient.Auditoria";
var destination_name 		= "Conexion";
var oResponse={};

/**
 * @description Servicio que permite registrar Auditoria
 * @creation David Villanueva 23/01/2017
 * @update
 */
function registrarAuditoria(oParam){
		var responseClient;
		var oRequest = {};
		oRequest.oData = {};
		try{
			oRequest.oAuditRequest 				=  oParam.oAuditRequest;
			oRequest.oData.sNombreProceso 		= oParam.sNombreProceso;
			oRequest.oData.iProcesoPrincipal 	= oParam.iProcesoPrincipal;
			oRequest.oData.iProcesoOrden 		= oParam.iProcesoOrden;
			oRequest.oData.iTiempoProceso 		= oParam.iTiempoProceso;
			oRequest.oData.sEntradaProceso		= oParam.sEntradaProceso;
			oRequest.oData.sRespuestaProceso 	= oParam.sRespuestaProceso;
			oRequest.oData.sMetadata 			= oParam.sMetadata;
			oRequest.oData.sEstado 				= oParam.sEstado;
			
			var dest 		= $.net.http.readDestination(destination_package, destination_name);
			var client 		= new $.net.http.Client();
			var req 		= new $.net.http.Request($.net.http.POST, "");
			req.headers.set("Content-Type","application/json");
			req.headers.set("Authorization","Basic "+config.getText("clave.servicio.auditoria"));
			req.setBody(JSON.stringify(oRequest));
			client.request(req, dest);
			responseClient 	= client.getResponse();
			var bodyJson 	= JSON.parse(responseClient.body.asString());
			if(bodyJson.oAuditResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
				oResponse.iCode 		= parseInt(bundle.getText("code.idf1"), 10);
				oResponse.sMessage 		= bundle.getText("msj.idf1");
			}else{
				oResponse.iCode 		= bodyJson.oAuditResponse.iCode;
				oResponse.sMessage 		= bodyJson.oAuditResponse.sMessage;
			}
		}catch(e){
			oResponse.iCode 		= parseInt(bundle.getText("code.idt6"), 10);
			oResponse.sMessage 		= bundle.getText("msj.idt6",[e.toString()]);
		}
		return oResponse;
}
