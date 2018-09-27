var textAccess 				= $.import("sap.hana.xs.i18n","text");
var utils 					= $.import("MitsuiCitasPrd.Utils","Utils");
var bundle 					= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var genericaCampoTxBusiness = $.import("MitsuiCitasPrd.Business.Generica","GenericaCampoTxBusiness");
var oBodyJson;
var oAuditoriaRequest;
var oDataRequest;
var sIdTransaccion;


function validarParamCrearCampo(){
	var oResponse = {};
	if (oDataRequest.aItems === undefined || oDataRequest.aItems === null ||  oDataRequest.aItems.length === 0) {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["No se encontraron items para procesar"]);
		return oResponse;
	}
	
	if (oDataRequest.aItems[0].sCampo === undefined || oDataRequest.aItems[0].sCampo === null ||  oDataRequest.aItems[0].sCampo === "") {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el nombre del campo"]);
		return oResponse;
	}
	
	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamActualizarCampo(){
	var oResponse = {};
	if (oDataRequest.aItems === undefined || oDataRequest.aItems === null ||  oDataRequest.aItems.length === 0) {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["No se encontraron items para procesar"]);
		return oResponse;
	}
	
	if (oDataRequest.aItems[0].iId === undefined || oDataRequest.aItems[0].iId === null ||  oDataRequest.aItems[0].iId === 0) {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el campo Id"]);
		return oResponse;
	}
	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamEliminarCampo(){
	var oResponse = {};
	if (oDataRequest.aItems === undefined || oDataRequest.aItems === null ||  oDataRequest.aItems.length === 0) {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["No se encontraron items para procesar"]);
		return oResponse;
	}
	
	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function crearCampo(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var genericaCampoTxBusinessResponse;
		switch(Accion) {
			case 'CrearCampo':
				var validarParamCrearCampoResponse = validarParamCrearCampo();
				if(validarParamCrearCampoResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					genericaCampoTxBusinessResponse = genericaCampoTxBusiness.registrarCampoGenerica(oParam);
					if(genericaCampoTxBusinessResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								null );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								genericaCampoTxBusinessResponse.iCode, 
								genericaCampoTxBusinessResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamCrearCampoResponse.iCode, 
							validarParamCrearCampoResponse.sMessage
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
function actualizarCampo(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var genericaCampoTxBusinessResponse;
		switch(Accion) {
			case 'ActualizarCampo':
				var validarParamActualizarCampoResponse = validarParamActualizarCampo();
				if(validarParamActualizarCampoResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					genericaCampoTxBusinessResponse = genericaCampoTxBusiness.actualizarCampoGenerica(oParam);
					if(genericaCampoTxBusinessResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								null );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								genericaCampoTxBusinessResponse.iCode, 
								genericaCampoTxBusinessResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamActualizarCampoResponse.iCode, 
							validarParamActualizarCampoResponse.sMessage
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
function eliminarCampo(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var genericaCampoTxBusinessResponse;
		switch(Accion) {
			case 'EliminarCampo':
				var validarParamEliminarCampoResponse = validarParamEliminarCampo();
				if(validarParamEliminarCampoResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					genericaCampoTxBusinessResponse = genericaCampoTxBusiness.eliminarCampoGenerica(oParam);
					if(genericaCampoTxBusinessResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								null );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								genericaCampoTxBusinessResponse.iCode, 
								genericaCampoTxBusinessResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamEliminarCampoResponse.iCode, 
							validarParamEliminarCampoResponse.sMessage
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
		var validarAudit  = utils.validarPostRequest($.request.contentType, $.request.body, $.request.headers);
		if(validarAudit.iCode === parseInt(bundle.getText("code.idf1"), 10)){
			switch ( $.request.method ) {
	        case $.net.http.POST:
	        	crearCampo();
	        	break;
	        case $.net.http.PUT:
	        	actualizarCampo();
	        	break;
	        case $.net.http.DEL:
	        	eliminarCampo();
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