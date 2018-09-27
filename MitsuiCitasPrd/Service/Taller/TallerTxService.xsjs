var textAccess 					= $.import("sap.hana.xs.i18n","text");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var tallerTxBusiness 			= $.import("MitsuiCitasPrd.Business.Taller","TallerTxBusiness");

var oBodyJson;
var oAuditoriaRequest;
var oDataRequest;
var sIdTransaccion;

function validarParamRegistrarTaller(){
	var oResponse = {};

	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamRegistrarTallerMasivo(){
	var oResponse = {};

	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamActualizarTaller(){
	var oResponse = {};

	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamEliminarTaller(){
	var oResponse = {};

	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}


function registrarTaller(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var registrarTallerResponse;
		var registrarTallerMasivoResponse;
		switch(Accion) {
			case 'RegistrarTaller':
				var validarParamRegistrarTallerResponse = validarParamRegistrarTaller();
				if(validarParamRegistrarTallerResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					registrarTallerResponse = tallerTxBusiness.registrarTaller(oParam);
					if(registrarTallerResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								registrarTallerResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								registrarTallerResponse.iCode, 
								registrarTallerResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamRegistrarTallerResponse.iCode, 
							validarParamRegistrarTallerResponse.sMessage
							);
				}
			break;
			
			case 'RegistrarTallerMasivo':
				var validarParamRegistrarTallerMasivoResponse = validarParamRegistrarTallerMasivo();
				if(validarParamRegistrarTallerMasivoResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					registrarTallerMasivoResponse = tallerTxBusiness.registrarTallerMasivo(oParam);
					if(registrarTallerMasivoResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								registrarTallerMasivoResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								registrarTallerMasivoResponse.iCode, 
								registrarTallerMasivoResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamRegistrarTallerMasivoResponse.iCode, 
							validarParamRegistrarTallerMasivoResponse.sMessage
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

function actualizarTaller(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var actualizarTallerResponse;
		switch(Accion) {
			case 'ActualizarTaller':
				var validarParamActualizarTallerResponse = validarParamActualizarTaller();
				if(validarParamActualizarTallerResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					oParam.oData.iId = $.request.parameters.get('Id');
					actualizarTallerResponse = tallerTxBusiness.actualizarTaller(oParam);
					if(actualizarTallerResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								actualizarTallerResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								actualizarTallerResponse.iCode, 
								actualizarTallerResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamActualizarTallerResponse.iCode, 
							validarParamActualizarTallerResponse.sMessage
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

function eliminarTaller(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var eliminarTallerResponse;
		switch(Accion) {
			case 'EliminarTaller':
				var validarParamEliminarTallerResponse = validarParamEliminarTaller();
				if(validarParamEliminarTallerResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					eliminarTallerResponse = tallerTxBusiness.eliminarTaller(oParam);
					if(eliminarTallerResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								eliminarTallerResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								eliminarTallerResponse.iCode, 
								eliminarTallerResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamEliminarTallerResponse.iCode, 
							validarParamEliminarTallerResponse.sMessage
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
	        	registrarTaller();
	        	break;
	        case $.net.http.PUT:
	        	actualizarTaller();
	        	break;
	        case $.net.http.DEL:
	        	eliminarTaller();
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