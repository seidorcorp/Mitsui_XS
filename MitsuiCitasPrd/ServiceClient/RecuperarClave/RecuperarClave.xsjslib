var textAccess 			= $.import("sap.hana.xs.i18n","text");
var bundle 				= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 				= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var utils 				= $.import("MitsuiCitasPrd.Utils","Utils");
var destination_package = config.getText("package.project")+".ServiceClient.RecuperarClave";
var destination_name 	= "Conexion";
var oResponse			= {};

/**
 * @description Servicio que permite recuperar clave
 * @param 
 * @creation David Villanueva 24/08/2018
 * @update
 */
function recuperarClave(oParam){
		var responseClient;
		try{
			var user = {};
			user.identifier = oParam.oData.sUsuario;
			var dest = $.net.http.readDestination(destination_package, destination_name);
			var client = new $.net.http.Client();
			var req = new $.net.http.Request($.net.http.POST, '');
			req.headers.set("Content-Type","application/json");
			req.headers.set("Authorization","Basic "+config.getText("clave.api.identity"));
			req.headers.set("accept","application/json");
			req.setBody(JSON.stringify(user));
			client.request(req, dest);
			responseClient = client.getResponse();
			
			if(parseInt(responseClient.status, 10) === 200){
				oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
				oResponse.sMessage 	= bundle.getText("msj.recuperar.usuario.idf1");
			} else{
				oResponse.iCode 	= responseClient.status;
				oResponse.sMessage 	= bundle.getText("msj.recuperar.usuario.idf2");
			}
			
		}catch(e){
			oResponse.iCode = bundle.getText("code.idt1");
			oResponse.sMessage = bundle.getText("msj.idt1",[e.toString()]);
		}
		return oResponse;
}
