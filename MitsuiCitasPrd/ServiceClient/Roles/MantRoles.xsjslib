var textAccess 			= $.import("sap.hana.xs.i18n","text");
var bundle 				= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 				= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var utils 				= $.import("MitsuiCitasPrd.Utils","Utils");
var destination_package = config.getText("package.project")+".ServiceClient.Roles";
var destination_name 	= "Conexion";
var oResponse			= {};

/**
 * @description Servicio que permite obtener un token para el identity
 * @param 
 * @creation David Villanueva 27/02/2018
 * @update
 */
function obtenerToken(){
		var responseClient;
		try{
			var dest 	= $.net.http.readDestination(destination_package, destination_name);
			var client 	= new $.net.http.Client();
			var req 	= new $.net.http.Request($.net.http.POST, '/oauth2/apitoken/v1?grant_type=client_credentials');
			req.headers.set("Content-Type","application/json");
			req.headers.set("Authorization","Basic "+config.getText("clave.api.cliente.autorizacion"));
			req.headers.set("accept","application/json");
			client.request(req, dest);
			responseClient 	= client.getResponse();
			var bodyJson 	= JSON.parse(responseClient.body.asString());
			if(bodyJson.access_token !== null){
				oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
				oResponse.sMessage 	= bundle.getText("msj.idf1");
				oResponse.oData 	= bodyJson.token_type + " " + bodyJson.access_token;
			}else{
				oResponse.iCode 	= parseInt(bundle.getText("code.idf2"), 10);
				oResponse.sMessage 	= bundle.getText("msj.idf2");
			}
		}catch(e){
			oResponse.iCode 	= parseInt(bundle.getText("code.idt1"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt1",[e.toString()]);
		}
		return oResponse;
}


/**
 * @description Servicio que permite asignar un rol a usuario
 * @param 
 * @creation David Villanueva 27/02/2018
 * @update
 */
function asignarRol(oParam){
		var responseClient;
		try{
			var subCuenta 	= config.getText("codigo.subcuenta.scp");
			var urlQuery 	= '?providerAccount=portal&roleName='+oParam.sRol;
			var token		= obtenerToken();
			var dest 		= $.net.http.readDestination(destination_package, destination_name);
			var client 		= new $.net.http.Client();
			var req 		= new $.net.http.Request($.net.http.PUT, '/authorization/v1/accounts/'+subCuenta+'/apps/nwc/roles/users' +urlQuery);
			req.headers.set("Content-Type","application/json");
			req.headers.set("Authorization",token.oData);
			req.headers.set("accept","application/json");
			req.setBody('{"users": [ {"name" : '+ oParam.sUsuario+'}]}');
			client.request(req, dest);
			responseClient 	= client.getResponse();
			
			if(parseInt(responseClient.status, 10) === 201){
				oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
				oResponse.sMessage 	= bundle.getText("msj.idf1");
			}else{
				oResponse.iCode 	= parseInt(bundle.getText("code.crear.rol.idf2"), 10);
				oResponse.sMessage 	= bundle.getText("msj.crear.rol.idf2", [responseClient.status]);
				oResponse.oData 	= JSON.parse(responseClient.body.asString());
			}
			
		}catch(e){
			oResponse.iCode 	= parseInt(bundle.getText("code.idt1"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt1",[e.toString()]);
		}
		return oResponse;
}


/**
 * @description Servicio que permite eliminar un rol al usuario
 * @param 
 * @creation David Villanueva 28/02/2018
 * @update
 */
function eliminarRol(oParam){
		var responseClient;
		try{
			var subCuenta 	= config.getText("codigo.subcuenta.scp");
			var urlQuery 	= '?providerAccount=portal&roleName='+oParam.sRol+'&users='+oParam.sUsuario;
			var token		= obtenerToken();
			var dest 		= $.net.http.readDestination(destination_package, destination_name);
			var client 		= new $.net.http.Client();
			var req 		= new $.net.http.Request($.net.http.DEL, '/authorization/v1/accounts/'+subCuenta+'/apps/nwc/roles/users' +urlQuery);
			req.headers.set("Content-Type","application/json");
			req.headers.set("Authorization",token.oData);
			req.headers.set("accept","application/json");
			client.request(req, dest);
			responseClient 	= client.getResponse();
			
			if(parseInt(responseClient.status, 10) === 200){
				oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
				oResponse.sMessage 	= bundle.getText("msj.idf1");
				//oResponse.oData 	= JSON.parse(responseClient.body.asString());
			}else{
				oResponse.iCode 	= parseInt(bundle.getText("code.eliminar.rol.idf2"), 10);
				oResponse.sMessage 	= bundle.getText("msj.eliminar.rol.idf2", [responseClient.status]);
			}
			
		}catch(e){
			oResponse.iCode 	= parseInt(bundle.getText("code.idt1"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt1",[e.toString()]);
		}
		return oResponse;
}