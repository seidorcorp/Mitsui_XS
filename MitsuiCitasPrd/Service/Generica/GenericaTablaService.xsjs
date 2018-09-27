var textAccess 				= $.import("sap.hana.xs.i18n","text");
var utils 					= $.import("MitsuiCitasPrd.Utils","Utils");
var bundle 					= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var genericaTablaTxBusiness = $.import("MitsuiCitasPrd.Business.Generica","GenericaTablaTxBusiness");
var oBodyJson;
var oAuditoriaRequest;
var oDataRequest;
var sIdTransaccion;


function validarParamCrearTabla(){
	var oResponse = {};
	if (oDataRequest.sCodigoTabla === undefined || oDataRequest.sCodigoTabla === null ||  oDataRequest.sCodigoTabla === "") {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo CodigoTabla"]);
		return oResponse;
	}
	
	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamActualizarTabla(){
	var oResponse = {};
	if (oDataRequest.iId === undefined || oDataRequest.iId === null ||  oDataRequest.iId === 0) {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo IdTabla"]);
		return oResponse;
	}
	if (oDataRequest.sCodigoTabla === undefined || oDataRequest.sCodigoTabla === null ||  oDataRequest.sCodigoTabla === "") {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo CodigoTabla"]);
		return oResponse;
	}
	
	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamEliminarTabla(){
	var oResponse = {};
	if (oDataRequest.sCodigoTabla === undefined || oDataRequest.sCodigoTabla === null ||  oDataRequest.sCodigoTabla === "") {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo CodigoTabla"]);
		return oResponse;
	}
		
	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function crearTabla(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var genericaTablaTxBusinessResponse;
		switch(Accion) {
			case 'CrearTabla':
				var validarParamCrearTablaResponse = validarParamCrearTabla();
				if(validarParamCrearTablaResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					genericaTablaTxBusinessResponse = genericaTablaTxBusiness.registrarTablaGenerica(oParam);
					if(genericaTablaTxBusinessResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								null );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								genericaTablaTxBusinessResponse.iCode, 
								genericaTablaTxBusinessResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamCrearTablaResponse.iCode, 
							validarParamCrearTablaResponse.sMessage
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

function actualizarTabla(){
	
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var genericaTablaTxBusinessResponse;
		switch(Accion) {
			case 'ActualizarTabla':
				var validarParamActualizarTablaResponse = validarParamActualizarTabla();
				if(validarParamActualizarTablaResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					genericaTablaTxBusinessResponse = genericaTablaTxBusiness.actualizarTablaGenerica(oParam);
					if(genericaTablaTxBusinessResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								null );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								genericaTablaTxBusinessResponse.iCode, 
								genericaTablaTxBusinessResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamActualizarTablaResponse.iCode, 
							validarParamActualizarTablaResponse.sMessage
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

function eliminarTabla(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var genericaTablaTxBusinessResponse;
		switch(Accion) {
			case 'EliminarTabla':
				var validarParamEliminarTablaResponse = validarParamEliminarTabla();
				if(validarParamEliminarTablaResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					genericaTablaTxBusinessResponse = genericaTablaTxBusiness.eliminarTablaGenerica(oParam);
					if(genericaTablaTxBusinessResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								null );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								genericaTablaTxBusinessResponse.iCode, 
								genericaTablaTxBusinessResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamEliminarTablaResponse.iCode, 
							validarParamEliminarTablaResponse.sMessage
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
	        	crearTabla();
	        	break;
	        case $.net.http.PUT:
	        	actualizarTabla();
	        	break;
	        case $.net.http.DEL:
	        	eliminarTabla();
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