var textAccess 			= $.import("sap.hana.xs.i18n","text");
var utils 				= $.import("MitsuiCitasPrd.Utils","Utils");
var bundle 				= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var NotificacionTxBusiness 	= $.import("MitsuiCitasPrd.Business.Notificacion","NotificacionTxBusiness");

var oBodyJson;
var oAuditoriaRequest;
var oDataRequest;
var sIdTransaccion;

function validarParamRegistrarNotificacionPortal(){
	var oResponse = {};
	//if (oDataRequest.sUsuario === undefined || oDataRequest.sUsuario === null ||  oDataRequest.sUsuario === "") {
	//	oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
	//	oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo Usuario"]);
	//	return oResponse;
	//}

	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}



function validarParamActualizarNotificacion(){
	var oResponse = {};
	//if ($.request.parameters.get('Id') === undefined || $.request.parameters.get('Id') === null ||  $.request.parameters.get('Id') === 0) {
	//	oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
	//	oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo Id Usuario"]);
	//	return oResponse;
	//}

	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamEliminarNotificacion(){
	var oResponse = {};
//	if (oDataRequest.aItems === undefined || oDataRequest.aItems === null ||  oDataRequest.aItems.length === 0) {
//		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
//		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo Id Usuario"]);
//		return oResponse;
//	}

	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}


function registrarNotificacion(){
	var oParam = {};
    var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
        var registrarNotificacionResponse;
        
		switch(Accion) {
			case 'RegistrarNotificacion':
				var validarParamRegistrarNotificacionResponse = validarParamRegistrarNotificacionPortal();
				if(validarParamRegistrarNotificacionResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
                    oParam.oData = oDataRequest;
					registrarNotificacionResponse = NotificacionTxBusiness.registrarNotificacion(oParam);
					if(registrarNotificacionResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								registrarNotificacionResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								registrarNotificacionResponse.iCode, 
								registrarNotificacionResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamRegistrarNotificacionResponse.iCode, 
							validarParamRegistrarNotificacionResponse.sMessage
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

function actualizarNotificacion(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var actualizarNotificacionResponse;
		switch(Accion) {
			case 'ActualizarNotificacion':
				var validarParamActualizarNotificacionResponse = validarParamActualizarNotificacion();
				if(validarParamActualizarNotificacionResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					oParam.oData.iId = $.request.parameters.get('Id');
					actualizarNotificacionResponse = NotificacionTxBusiness.actualizarNotificacion(oParam);
					if(actualizarNotificacionResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								actualizarNotificacionResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								actualizarNotificacionResponse.iCode, 
								actualizarNotificacionResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamActualizarNotificacionResponse.iCode, 
							validarParamActualizarNotificacionResponse.sMessage
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

function eliminarNotificacion(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
    try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var eliminarNotificacionResponse;
		switch(Accion) {
			case 'EliminarNotificacion':
				var validarParamEliminarNotificacionResponse = validarParamEliminarNotificacion();
				if(validarParamEliminarNotificacionResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					eliminarNotificacionResponse = NotificacionTxBusiness.eliminarNotificacion(oParam);
					if(eliminarNotificacionResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								eliminarNotificacionResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								eliminarNotificacionResponse.iCode, 
								eliminarNotificacionResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamEliminarNotificacionResponse.iCode, 
							validarParamEliminarNotificacionResponse.sMessage
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
	        	registrarNotificacion();
	        	break;
	        case $.net.http.PUT:
	        	actualizarNotificacion();
	        	break;
	        case $.net.http.DEL:
	        	eliminarNotificacion();
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