var textAccess 			= $.import("sap.hana.xs.i18n","text");
var bundle 				= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 				= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var utils 				= $.import("MitsuiCitasPrd.Utils","Utils");
var destination_package = config.getText("package.project")+".ServiceClient.Usuarios";
var destination_name 	= "Conexion";
var oResponse			= {};

/**
 * @description Servicio que permite la busqueda de usuarios por correo en el Identity provider
 * @param 
 * @returns devuelve el usuario buscado segun correo
 * @creation David Villanueva 26/02/2018
 * @update
 */
function buscarUsuario(oParam){
		var responseClient;
		try{
			var dest 	= $.net.http.readDestination(destination_package, destination_name);
			var client 	= new $.net.http.Client();
			var req 	= new $.net.http.Request($.net.http.GET, '?filter=userName%20eq%20' + '"' +oParam.sUserName +'"');
			req.headers.set("Content-Type","application/scim+json");
			req.headers.set("Authorization","Basic "+config.getText("clave.api.identity"));
			req.headers.set("accept","application/scim+json");
			client.request(req, dest);
			responseClient 	= client.getResponse();
			var bodyJson 	= JSON.parse(responseClient.body.asString());
			if(bodyJson.Resources.length > 0){
				oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
				oResponse.sMessage 	= bundle.getText("msj.idf1");
				oResponse.oData 	= bodyJson.Resources;
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
 * @description Servicio que permite registrar un usuario en el Identity provider
 * @param 
 * @returns devuelve el usuario buscado segun correo
 * @creation David Villanueva 26/02/2018
 * @update
 */
function registrarUsuario(oParam){
		var responseClient;
		var oUsuario={};
		try{
			
			oUsuario.userName=oParam.sUsuario;
			oUsuario.name ={};
			oUsuario.name.givenName = oParam.sNombre;
			oUsuario.name.familyName = oParam.sApellido;
			oUsuario.emails=[];
			oUsuario.emails.push({
				"value": oParam.sCorreo
			});
			oUsuario.displayName = oParam.sUsuario;

			
			var dest = $.net.http.readDestination(destination_package, destination_name);
			var client = new $.net.http.Client();
			var req = new $.net.http.Request($.net.http.POST, '');
			req.headers.set("Content-Type","application/scim+json");
			req.headers.set("Authorization","Basic "+config.getText("clave.api.identity"));
			req.headers.set("accept","application/scim+json");
			req.setBody(JSON.stringify(oUsuario));
			client.request(req, dest);
			responseClient = client.getResponse();
			
			if(parseInt(responseClient.status, 10) === 409){
				oResponse.iCode 	= parseInt(bundle.getText("code.idf7"), 10);
				oResponse.sMessage 	= bundle.getText("msj.idf7");
				oResponse.oData 	= responseClient.body.asString();
			}
			
			if(parseInt(responseClient.status, 10) === 201){
				oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
				oResponse.sMessage 	= bundle.getText("msj.idf1");
				oResponse.oData 	= responseClient.body.asString();
			}
			
			if(parseInt(responseClient.status, 10) !== 409 && parseInt(responseClient.status, 10) !== 201){
				oResponse.iCode 	= parseInt(responseClient.status, 10);
				oResponse.sMessage 	= responseClient.body.asString();
			}
			
		}catch(e){
			oResponse.iCode 	= parseInt(bundle.getText("code.idt1"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt1",[e.toString()]);
		}
		return oResponse;
}

/**
 * @description Servicio que permite actualizar un usuario en el Identity provider
 * @param 
 * @returns devuelve el usuario buscado segun correo
 * @creation David Villanueva 06/08/2018
 * @update
 */
function actualizarUsuario(oParam){
		var responseClient;
		try{
			var oUsuario={};
			oUsuario.id 			= oParam.iId;
			oUsuario.active 		= oParam.bEstado;
			oUsuario.name 			={};
			oUsuario.name.givenName = oParam.sNombre;
			oUsuario.name.familyName = oParam.sApellido;
			var dest = $.net.http.readDestination(destination_package, destination_name);
			var client = new $.net.http.Client();
			var req = new $.net.http.Request($.net.http.PUT, '/'+oParam.iId);
			req.headers.set("Content-Type","application/scim+json");
			req.headers.set("Authorization","Basic "+config.getText("clave.api.identity"));
			req.headers.set("accept","application/scim+json");
			req.setBody(JSON.stringify(oUsuario));
			client.request(req, dest);
			responseClient = client.getResponse();
			
			if(parseInt(responseClient.status, 10) === 400){
				oResponse.iCode 	= parseInt(bundle.getText("code.idf2"), 10);
				oResponse.sMessage 	= bundle.getText("msj.idf2");
				oResponse.oData 	= responseClient.body.asString();
			}
			
			if(parseInt(responseClient.status, 10) === 200){
				oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
				oResponse.sMessage 	= bundle.getText("msj.idf1");
				oResponse.oData 	= responseClient.body.asString();
			}
			
			if(parseInt(responseClient.status, 10) !== 400 && parseInt(responseClient.status, 10) !== 200){
				oResponse.iCode 	= parseInt(responseClient.status, 10);
				oResponse.sMessage 	= responseClient.body.asString();
			}
			
		}catch(e){
			oResponse.iCode 	= parseInt(bundle.getText("code.idt1"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt1",[e.toString()]);
		}
		return oResponse;
}

/**
 * @description Servicio que permite bloquear un usuario en el Identity provider
 * @param 
 * @returns devuelve el usuario buscado segun correo
 * @creation David Villanueva 26/02/2018
 * @update
 */
function bloquearUsuario(oParam){
		var responseClient;
		try{
			var oUsuario={};
			oUsuario.id = oParam.iId;
			oUsuario.active = oParam.bEstado;
			var dest = $.net.http.readDestination(destination_package, destination_name);
			var client = new $.net.http.Client();
			var req = new $.net.http.Request($.net.http.PUT, '/'+oParam.iId);
			req.headers.set("Content-Type","application/scim+json");
			req.headers.set("Authorization","Basic "+config.getText("clave.api.identity"));
			req.headers.set("accept","application/scim+json");
			req.setBody(JSON.stringify(oUsuario));
			client.request(req, dest);
			responseClient = client.getResponse();
			
			if(parseInt(responseClient.status, 10) === 400){
				oResponse.iCode 	= parseInt(bundle.getText("code.idf2"), 10);
				oResponse.sMessage 	= bundle.getText("msj.idf2");
				oResponse.oData 	= responseClient.body.asString();
			}
			
			if(parseInt(responseClient.status, 10) === 200){
				oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
				oResponse.sMessage 	= bundle.getText("msj.idf1");
				oResponse.oData 	= responseClient.body.asString();
			}
			
			if(parseInt(responseClient.status, 10) !== 400 && parseInt(responseClient.status, 10) !== 200){
				oResponse.iCode 	= parseInt(responseClient.status, 10);
				oResponse.sMessage 	= responseClient.body.asString();
			}
			
		}catch(e){
			oResponse.iCode 	= parseInt(bundle.getText("code.idt1"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt1",[e.toString()]);
		}
		return oResponse;
}



/**
 * @description Servicio que permite eliminar un usuario en el Identity provider
 * @param 
 * @returns devuelve el usuario buscado segun correo
 * @creation David Villanueva 26/02/2018
 * @update
 */
function eliminarUsuario(oParam){
		var responseClient;
		try{
			var dest = $.net.http.readDestination(destination_package, destination_name);
			var client = new $.net.http.Client();
			var req = new $.net.http.Request($.net.http.DEL, '/'+oParam.iId);
			req.headers.set("Content-Type","application/scim+json");
			req.headers.set("Authorization","Basic "+config.getText("clave.api.identity"));
			req.headers.set("accept","application/scim+json");
			//req.setBody(JSON.stringify(oUsuario));
			client.request(req, dest);
			responseClient = client.getResponse();
			
			if(parseInt(responseClient.status, 10) === 404){
				oResponse.iCode 	= parseInt(bundle.getText("code.idf2"), 10);
				oResponse.sMessage 	= bundle.getText("msj.idf2");
				oResponse.oData 	= responseClient.body.asString();
			}
			
			if(parseInt(responseClient.status, 10) === 204){
				oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
				oResponse.sMessage 	= bundle.getText("msj.idf1");
				oResponse.oData 	= responseClient.body.asString();
			}
			
			if(parseInt(responseClient.status, 10) !== 404 && parseInt(responseClient.status, 10) !== 204){
				oResponse.iCode 	= parseInt(responseClient.status, 10);
				oResponse.sMessage 	= responseClient.body.asString();
			}
			
		}catch(e){
			oResponse.iCode 	= parseInt(bundle.getText("code.idt1"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt1",[e.toString()]);
		}
		return oResponse;
}


