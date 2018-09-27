var textAccess 			= $.import("sap.hana.xs.i18n","text");
var bundle 				= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 				= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var utils 				= $.import("MitsuiCitasPrd.Utils","Utils");
var destination_package = config.getText("package.project")+".ServiceClient.UsuariosAutenticacion";
var destination_name 	= "Conexion";
var oResponse			= {};

/**
 * @description Servicio que permite validar un usuario en el Identity provider
 * @param 
 * @creation David Villanueva 26/02/2018
 * @update
 */
function validarUsuario(oParam){
		var responseClient;
		try{
			var dest = $.net.http.readDestination(destination_package, destination_name);
			var client = new $.net.http.Client();
			var req = new $.net.http.Request($.net.http.POST, '');
			req.headers.set("Content-Type","application/scim+json");
			req.headers.set("Authorization","Basic "+oParam.sUserPassBase64);
			req.headers.set("accept","application/scim+json");
			//req.setBody(JSON.stringify(oUsuario));
			client.request(req, dest);
			responseClient = client.getResponse();
			
			if(parseInt(responseClient.status, 10) === 200){
				oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
				oResponse.sMessage 	= bundle.getText("msj.idf1");
				oResponse.oData		= JSON.parse(responseClient.body.asString());
			}else{
				oResponse.iCode 	= responseClient.status;
				oResponse.sMessage 	=  bundle.getText("msj.validausuario.idf1");
			}
			
		}catch(e){
			oResponse.iCode = bundle.getText("code.idt1");
			oResponse.sMessage = bundle.getText("msj.idt1",[e.toString()]);
		}
		return oResponse;
}


/**
 * @description Servicio que permite validar un usuario en el Identity provider
 * @param 
 * @creation David Villanueva 26/02/2018
 * @update
 */
function validarUsuarioBase64(oParam){
		var responseClient;
		try{
			var dest = $.net.http.readDestination(destination_package, destination_name);
			var client = new $.net.http.Client();
			var req = new $.net.http.Request($.net.http.POST, '');
			req.headers.set("Content-Type","application/scim+json");
			req.headers.set("Authorization","Basic "+oParam.sUserPassBase64);
			req.headers.set("accept","application/scim+json");
			//req.setBody(JSON.stringify(oUsuario));
			client.request(req, dest);
			responseClient = client.getResponse();
			
			if(parseInt(responseClient.status, 10) === 200){
				oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
				oResponse.sMessage 	= bundle.getText("msj.idf1");
				oResponse.oData		= JSON.parse(responseClient.body.asString());
			}else{
				oResponse.iCode 	= responseClient.status;
				oResponse.sMessage 	=  bundle.getText("msj.validausuario.idf1");
			}
			
		}catch(e){
			oResponse.iCode = bundle.getText("code.idt1");
			oResponse.sMessage = bundle.getText("msj.idt1",[e.toString()]);
		}
		return oResponse;
}
