var textAccess 			= $.import("sap.hana.xs.i18n","text");
var utils 				= $.import("MitsuiCitasPrd.Utils","Utils");
var bundle 				= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var usuarioTxBusiness 	= $.import("MitsuiCitasPrd.Business.Usuario","UsuarioTxBusiness");

var oBodyJson;
var oAuditoriaRequest;
var oDataRequest;
var sIdTransaccion;

function validarParamRegistrarUsuarioPortal(){
	var oResponse = {};
	if (oDataRequest.sEmail === undefined || oDataRequest.sEmail === null ||  oDataRequest.sEmail === "") {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo Email"]);
		return oResponse;
	}

	oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage 	= bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamRegistrarUsuarioMovil(){
	var oResponse = {};
	if (oDataRequest.sUsuario === undefined || oDataRequest.sUsuario === null ||  oDataRequest.sUsuario === "") {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo Usuario"]);
		return oResponse;
	}

	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamActualizarUsuario(){
	var oResponse = {};
	if ($.request.parameters.get('Id') === undefined || $.request.parameters.get('Id') === null ||  $.request.parameters.get('Id') === 0) {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo Id Usuario"]);
		return oResponse;
	}

	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamEliminarUsuario(){
	var oResponse = {};
	if (oDataRequest.aItems === undefined || oDataRequest.aItems === null ||  oDataRequest.aItems.length === 0) {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo Id Usuario"]);
		return oResponse;
	}

	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}


function registrarUsuario(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var registrarUsuarioResponse;
		switch(Accion) {
			case 'UsuarioPortal':
				var validarParamRegistrarUsuarioResponse = validarParamRegistrarUsuarioPortal();
				if(validarParamRegistrarUsuarioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					registrarUsuarioResponse = usuarioTxBusiness.registrarUsuarioPortal(oParam);
					if(registrarUsuarioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								registrarUsuarioResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								registrarUsuarioResponse.iCode, 
								registrarUsuarioResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamRegistrarUsuarioResponse.iCode, 
							validarParamRegistrarUsuarioResponse.sMessage
							);
				}
			break;
			
			case 'UsuarioMovil':
				var validarParamRegistrarUsuarioMovilResponse = validarParamRegistrarUsuarioMovil();
				if(validarParamRegistrarUsuarioMovilResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					registrarUsuarioResponse = usuarioTxBusiness.registrarUsuarioMovil(oParam);
					if(registrarUsuarioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								registrarUsuarioResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								registrarUsuarioResponse.iCode, 
								registrarUsuarioResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamRegistrarUsuarioMovilResponse.iCode, 
							validarParamRegistrarUsuarioMovilResponse.sMessage
							);
				}
			break;
			
			default:
				utils.sendResponseError(
						sIdTransaccion,
						parseInt(bundle.getText("code.idf9"), 10), 
						bundle.getText("msj.idf9") 
						);
		    break;
	    
		}
	}catch(e){
		utils.sendResponseError(
				sIdTransaccion,
				parseInt(bundle.getText("code.idt3"), 10), 
				bundle.getText("msj.idt3" , [e.toString()])
				);
	}
}

function actualizarUsuario(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var actualizarUsuarioResponse;
		switch(Accion) {
			case 'ActualizarUsuario':
				var validarParamActualizarUsuarioResponse = validarParamActualizarUsuario();
				if(validarParamActualizarUsuarioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					oParam.oData.iId = $.request.parameters.get('Id');
					actualizarUsuarioResponse = usuarioTxBusiness.actualizarUsuario(oParam);
					if(actualizarUsuarioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								actualizarUsuarioResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								actualizarUsuarioResponse.iCode, 
								actualizarUsuarioResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamActualizarUsuarioResponse.iCode, 
							validarParamActualizarUsuarioResponse.sMessage
							);
				}
			break;
			default:
				utils.sendResponseError(
						sIdTransaccion,
						parseInt(bundle.getText("code.idf9"), 10), 
						bundle.getText("msj.idf9") 
						);
		    break;
	    
		}
	}catch(e){
		utils.sendResponseError(
				sIdTransaccion,
				parseInt(bundle.getText("code.idt3"), 10), 
				bundle.getText("msj.idt3" , [e.toString()])
				);
	}
}

function eliminarUsuario(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var eliminarUsuarioResponse;
		switch(Accion) {
			case 'EliminarUsuario':
				var validarParamEliminarUsuarioResponse = validarParamEliminarUsuario();
				if(validarParamEliminarUsuarioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					eliminarUsuarioResponse = usuarioTxBusiness.eliminarUsuario(oParam);
					if(eliminarUsuarioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								eliminarUsuarioResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								eliminarUsuarioResponse.iCode, 
								eliminarUsuarioResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamEliminarUsuarioResponse.iCode, 
							validarParamEliminarUsuarioResponse.sMessage
							);
				}
			break;
			default:
				utils.sendResponseError(
						sIdTransaccion,
						parseInt(bundle.getText("code.idf9"), 10), 
						$.request.parameters.get('Accion') 
						);
		    break;
	    
		}
	}catch(e){
		utils.sendResponseError(
				sIdTransaccion,
				parseInt(bundle.getText("code.idt3"), 10), 
				bundle.getText("msj.idt3" , [e.toString()])
				);
	}
}

function processRequest(){
	try {
		var validarAudit  = utils.validarPostRequest($.request.contentType, $.request.body, $.request.headers);
		if(validarAudit.iCode === parseInt(bundle.getText("code.idf1"), 10)){
			switch ( $.request.method ) {
	        case $.net.http.POST:
	        	registrarUsuario();
	        	break;
	        case $.net.http.PUT:
	        	actualizarUsuario();
	        	break;
	        case $.net.http.DEL:
	        	eliminarUsuario();
	        	break;
	        default:
	        	utils.sendResponseError(
	        			sIdTransaccion,
	    				parseInt(bundle.getText("code.idt5"), 10), 
	    				bundle.getText("msj.idt5")
	    				);		        
	            break;
			}    
		}else{
			utils.sendResponseError(
					sIdTransaccion,
					validarAudit.iCode, 
					validarAudit.sMessage
					);
		}
		
	} catch (e) {
		utils.sendResponseError(
				sIdTransaccion,
				parseInt(bundle.getText("code.idt3"), 10), 
				bundle.getText("msj.idt3" , [e.toString()])
				);
	}
}
processRequest();