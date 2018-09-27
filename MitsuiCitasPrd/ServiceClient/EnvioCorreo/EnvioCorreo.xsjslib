var textAccess 				= $.import("sap.hana.xs.i18n","text");
var bundle 					= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 					= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var destination_package 	= config.getText("package.project")+".ServiceClient.EnvioCorreo";
var destination_name 		= "Conexion";
var oResponse={};

/**
 * @description Servicio que permite enviar correos
 * @creation David Villanueva 12/09/2018
 * @update
 */
function enviarCorreo(oParam){
		var responseClient;
		var oRequest = {};
		try{
			oRequest.correoDestino 		= oParam.sCorreoDestino;
			oRequest.taller			 	= oParam.sTaller;
			oRequest.nombre		 		= oParam.sNombre;
			oRequest.placa		 		= oParam.sPlaca;
			oRequest.fecha				= oParam.sFecha;
			oRequest.hora			 	= oParam.sHora;
			oRequest.tipoServicio		= oParam.sTipoServicio;
			oRequest.servicioRealizar	= oParam.sServicioRealizar;
			oRequest.observacion		= oParam.sObservacion;
			oRequest.telefono			= oParam.sTelefono;
			oRequest.codCita			= oParam.sCodCita;
			
			var dest 		= $.net.http.readDestination(destination_package, destination_name);
			var client 		= new $.net.http.Client();
			var req 		= new $.net.http.Request($.net.http.POST, "");
			req.headers.set("Content-Type","application/json");
//			req.headers.set("Authorization","Basic "+config.getText("clave.servicio.auditoria"));
			req.setBody(JSON.stringify(oRequest));
			client.request(req, dest);
			responseClient 	= client.getResponse();
			var bodyJson 	= JSON.parse(responseClient.body.asString());
			if(bodyJson.code === parseInt(bundle.getText("code.idf1"), 10)){
				oResponse.iCode 		= parseInt(bundle.getText("code.idf1"), 10);
				oResponse.sMessage 		= bundle.getText("msj.idf1");
			}else{
				oResponse.iCode 		= bodyJson.code;
				oResponse.sMessage 		= bodyJson.msj;
			}
		}catch(e){
			oResponse.iCode 		= parseInt(bundle.getText("code.idt6"), 10);
			oResponse.sMessage 		= bundle.getText("msj.idt6",[e.toString()]);
		}
		return oResponse;
}
