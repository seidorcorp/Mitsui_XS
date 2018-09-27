var textAccess 			= $.import("sap.hana.xs.i18n","text");
var utils 				= $.import("MitsuiCitasPrd.Utils","Utils");
var bundle 				= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var usuarioCnBusiness 	= $.import("MitsuiCitasPrd.Business.Usuario","UsuarioCnBusiness");
var usuarioTxBusiness 	= $.import("MitsuiCitasPrd.Business.Usuario","UsuarioTxBusiness");

var oBodyJson;
var oAuditoriaRequest;
var oDataRequest;
var sIdTransaccion;

function validarParamConsultarUsuario(){
	var oResponse = {};
	if (oDataRequest.sUsuarioSap === undefined || oDataRequest.sUsuarioSap === null ||  oDataRequest.sUsuarioSap === "") {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo Codigo Usuario"]);
		return oResponse;
	}
		
	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamConsultarPermisosUsuario(){
	var oResponse = {};
	if (oDataRequest.iIdUsuario === undefined || oDataRequest.iIdUsuario === null ||  oDataRequest.iIdUsuario === "") {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo IdUsuario"]);
		return oResponse;
	}
		
	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamActivarDesactivarUsuario(){
	var oResponse = {};
	if (oDataRequest.aItems === undefined || oDataRequest.aItems === null ||  oDataRequest.aItems.length  === 0) {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo IdUsuario"]);
		return oResponse;
	}
	
	if (oDataRequest.aItems[0].iIdEstado === undefined || oDataRequest.aItems[0].iIdEstado === null ||  oDataRequest.aItems[0].iIdEstado === "") {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo iIdEstado"]);
		return oResponse;
	}
	
	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamConsultarUsuarioSinAsignar(){
	var oResponse = {};
		
	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamConsultarUsuarioxFiltro(){
	var oResponse = {};
	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamRegistrarUsuario(){
	var oResponse = {};
	if (oDataRequest.sUsuarioSap === undefined || oDataRequest.sUsuarioSap === null ||  oDataRequest.sUsuarioSap === "") {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo Codigo Usuario"]);
		return oResponse;
	}
		
	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamActualizarUsuario(){
	var oResponse = {};
	if (oDataRequest.iId === undefined || oDataRequest.iId === null ||  oDataRequest.iId === "") {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo Codigo Id"]);
		return oResponse;
	}
		
	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamEliminarTienda(){
	var oResponse = {};
		
	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function wait(ms){
	   var start = new Date().getTime();
	   var end = start;
	   while(end < start + ms) {
	     end = new Date().getTime();
	  }
	}

function consultarRegistrarUsuario(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = oBodyJson.oAuditRequest;
		oAuditoriaRequest.sTerminal = $.request.headers.get("X-FORWARDED-FOR") + ' ';
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var consultarUsuarioSapResponse;
		var registrarUsuarioResponse;
		var buscarUsuarioxFiltroResponse;
		var mostrarPermisosUsuarioResponse;

		switch(Accion) {
			case 'ConsultarUsuario':
				var validarParamConsultarUsuarioResponse = validarParamConsultarUsuario();
				if(validarParamConsultarUsuarioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					//wait(7000);
					consultarUsuarioSapResponse = usuarioCnBusiness.consultarUsuarioSap(oParam);
					if(consultarUsuarioSapResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								consultarUsuarioSapResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								consultarUsuarioSapResponse.iCode, 
								consultarUsuarioSapResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamConsultarUsuarioResponse.iCode, 
							validarParamConsultarUsuarioResponse.sMessage
							);
				}
				break;
			case 'ConsultarUsuarioSinAsignar':
				var validarParamConsultarUsuarioSinAsignarResponse = validarParamConsultarUsuarioSinAsignar();
				if(validarParamConsultarUsuarioSinAsignarResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					//wait(7000);
					consultarUsuarioSapResponse = usuarioCnBusiness.buscarUsuarioSinAsignar(oParam);
					if(consultarUsuarioSapResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								consultarUsuarioSapResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								consultarUsuarioSapResponse.iCode, 
								consultarUsuarioSapResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamConsultarUsuarioSinAsignarResponse.iCode, 
							validarParamConsultarUsuarioSinAsignarResponse.sMessage
							);
				}
				break;
			case 'ConsultarUsuarioxFiltros':
				var validarParamConsultarUsuarioxFiltroResponse = validarParamConsultarUsuarioxFiltro();
				if(validarParamConsultarUsuarioxFiltroResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					buscarUsuarioxFiltroResponse = usuarioCnBusiness.buscarUsuarioxFiltro(oParam);
					if(buscarUsuarioxFiltroResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								buscarUsuarioxFiltroResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								buscarUsuarioxFiltroResponse.iCode, 
								buscarUsuarioxFiltroResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamConsultarUsuarioxFiltroResponse.iCode, 
							validarParamConsultarUsuarioxFiltroResponse.sMessage
							);
				}
				break;
			case 'ConsultarPermisosUsuario':
				var validarParamConsultarPermisosUsuarioResponse = validarParamConsultarPermisosUsuario();
				if(validarParamConsultarPermisosUsuarioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					mostrarPermisosUsuarioResponse = usuarioCnBusiness.mostrarPermisosUsuario(oParam);
					if(mostrarPermisosUsuarioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								mostrarPermisosUsuarioResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								mostrarPermisosUsuarioResponse.iCode, 
								mostrarPermisosUsuarioResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamConsultarPermisosUsuarioResponse.iCode, 
							validarParamConsultarPermisosUsuarioResponse.sMessage
							);
				}
				break;
			case 'RegistrarUsuario':
				var validarParamRegistrarUsuarioResponse = validarParamRegistrarUsuario();
				if(validarParamRegistrarUsuarioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					registrarUsuarioResponse = usuarioTxBusiness.registrarUsuario(oParam);
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
		oAuditoriaRequest = oBodyJson.oAuditRequest;
		oAuditoriaRequest.sTerminal = $.request.headers.get("X-FORWARDED-FOR") + ' ';
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var actualizarUsuarioResponse;
		var ActivarDesactivarUsuarioResponse;
		switch(Accion) {
			case 'ActualizarUsuario':
				var validarParamActualizarUsuarioResponse = validarParamActualizarUsuario();
				if(validarParamActualizarUsuarioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					actualizarUsuarioResponse = usuarioTxBusiness.actualizarUsuario(oParam);
					if(actualizarUsuarioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								null );
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
			case 'ActivarDesactivarUsuario':
				var validarParamActivarDesactivarUsuarioResponse = validarParamActivarDesactivarUsuario();
				if(validarParamActivarDesactivarUsuarioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					ActivarDesactivarUsuarioResponse = usuarioTxBusiness.ActivarDesactivarUsuario(oParam);
					if(ActivarDesactivarUsuarioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								ActivarDesactivarUsuarioResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								ActivarDesactivarUsuarioResponse.iCode, 
								ActivarDesactivarUsuarioResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamActivarDesactivarUsuarioResponse.iCode, 
							validarParamActivarDesactivarUsuarioResponse.sMessage
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
		oAuditoriaRequest = oBodyJson.oAuditRequest;
		oAuditoriaRequest.sTerminal = $.request.headers.get("X-FORWARDED-FOR") + ' ';
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var eliminarUsuarioResponse;
		switch(Accion) {
			case 'EliminarUsuario':
				var validarParamEliminarTiendaResponse = validarParamEliminarTienda();
				if(validarParamEliminarTiendaResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					eliminarUsuarioResponse = usuarioTxBusiness.eliminarUsuario(oParam);
					if(eliminarUsuarioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								null );
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
							validarParamEliminarTiendaResponse.iCode, 
							validarParamEliminarTiendaResponse.sMessage
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

function processRequest(){
	try {
		var validarAudit  = utils.validarAuditRequest($.request.contentType, $.request.body);
		if(validarAudit.iCode === parseInt(bundle.getText("code.idf1"), 10)){
			switch ( $.request.method ) {
	        case $.net.http.GET:
	        	consultarRegistrarUsuario();
	        	break;
	        case $.net.http.POST:
	        	consultarRegistrarUsuario();
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