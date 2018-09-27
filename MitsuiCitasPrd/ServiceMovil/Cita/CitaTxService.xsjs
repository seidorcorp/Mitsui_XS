var textAccess 			= $.import("sap.hana.xs.i18n","text");
var utils 				= $.import("MitsuiCitasPrd.Utils","Utils");
var bundle 				= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var citaTxBusiness 		= $.import("MitsuiCitasPrd.Business.Cita","CitaTxBusiness");

var oBodyJson;
var oAuditoriaRequest;
var oDataRequest;
var sIdTransaccion;

function validarParamRegistrarCita(){
	var oResponse = {};
//	if (oDataRequest.sEmail === undefined || oDataRequest.sEmail === null ||  oDataRequest.sEmail === "") {
//		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
//		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo Email"]);
//		return oResponse;
//	}

	oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage 	= bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamActualizarCita(){
	var oResponse = {};
//	if ($.request.parameters.get('Id') === undefined || $.request.parameters.get('Id') === null ||  $.request.parameters.get('Id') === 0) {
//		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
//		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo Id Usuario"]);
//		return oResponse;
//	}

	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamEliminarCita(){
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


function registrarCita(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var registrarCitaResponse;
		switch(Accion) {
			case 'RegistrarCita':
				var validarParamRegistrarCitaResponse = validarParamRegistrarCita();
				if(validarParamRegistrarCitaResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					registrarCitaResponse = citaTxBusiness.registrarCita(oParam);
					if(registrarCitaResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								registrarCitaResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								registrarCitaResponse.iCode, 
								registrarCitaResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamRegistrarCitaResponse.iCode, 
							validarParamRegistrarCitaResponse.sMessage
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

function actualizarCita(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var actualizarCitaResponse;
		switch(Accion) {
			case 'ActualizarCita':
				var validarParamActualizarCitaResponse = validarParamActualizarCita();
				if(validarParamActualizarCitaResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					actualizarCitaResponse = citaTxBusiness.actualizarCita(oParam);
					if(actualizarCitaResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								actualizarCitaResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								actualizarCitaResponse.iCode, 
								actualizarCitaResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamActualizarCitaResponse.iCode, 
							validarParamActualizarCitaResponse.sMessage
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

function eliminarCita(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var eliminarCitaResponse;
		switch(Accion) {
			case 'EliminarCita':
				var validarParamEliminarCitaResponse = validarParamEliminarCita();
				if(validarParamEliminarCitaResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					eliminarCitaResponse = citaTxBusiness.eliminarCita(oParam);
					if(eliminarCitaResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								eliminarCitaResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								eliminarCitaResponse.iCode, 
								eliminarCitaResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamEliminarCitaResponse.iCode, 
							validarParamEliminarCitaResponse.sMessage
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
	        	registrarCita();
	        	break;
	        case $.net.http.PUT:
	        	actualizarCita();
	        	break;
	        case $.net.http.DEL:
	        	eliminarCita();
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