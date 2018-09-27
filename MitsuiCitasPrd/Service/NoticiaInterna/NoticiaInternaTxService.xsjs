var textAccess 					= $.import("sap.hana.xs.i18n","text");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var noticiaInternaTxBusiness 	= $.import("MitsuiCitasPrd.Business.NoticiaInterna","NoticiaInternaTxBusiness");

var oBodyJson;
var oAuditoriaRequest;
var oDataRequest;
var sIdTransaccion;

function validarParamRegistrarNoticiaInterna(){
	var oResponse = {};

	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamActualizarNoticiaInterna(){
	var oResponse = {};
	if ($.request.parameters.get('Id') === undefined || $.request.parameters.get('Id') === null ||  $.request.parameters.get('Id') === 0) {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo Id NoticiaInterna"]);
		return oResponse;
	}

	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamEliminarNoticiaInterna(){
	var oResponse = {};

	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}


function registrarNoticiaInterna(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var registrarNoticiaInternaResponse;
		switch(Accion) {
			case 'RegistrarNoticiaInterna':
				var validarParamRegistrarNoticiaInternaResponse = validarParamRegistrarNoticiaInterna();
				if(validarParamRegistrarNoticiaInternaResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					registrarNoticiaInternaResponse = noticiaInternaTxBusiness.registrarNoticiaInterna(oParam);
					if(registrarNoticiaInternaResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								registrarNoticiaInternaResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								registrarNoticiaInternaResponse.iCode, 
								registrarNoticiaInternaResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamRegistrarNoticiaInternaResponse.iCode, 
							validarParamRegistrarNoticiaInternaResponse.sMessage
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

function actualizarNoticiaInterna(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var actualizarNoticiaInternaResponse;
		switch(Accion) {
			case 'ActualizarNoticiaInterna':
				var validarParamActualizarNoticiaInternaResponse = validarParamActualizarNoticiaInterna();
				if(validarParamActualizarNoticiaInternaResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					oParam.oData.iId = $.request.parameters.get('Id');
					actualizarNoticiaInternaResponse = noticiaInternaTxBusiness.actualizarNoticiaInterna(oParam);
					if(actualizarNoticiaInternaResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								actualizarNoticiaInternaResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								actualizarNoticiaInternaResponse.iCode, 
								actualizarNoticiaInternaResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamActualizarNoticiaInternaResponse.iCode, 
							validarParamActualizarNoticiaInternaResponse.sMessage
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

function eliminarNoticiaInterna(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var eliminarNoticiaInternaResponse;
		switch(Accion) {
			case 'EliminarNoticiaInterna':
				var validarParamEliminarNoticiaInternaResponse = validarParamEliminarNoticiaInterna();
				if(validarParamEliminarNoticiaInternaResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					eliminarNoticiaInternaResponse = noticiaInternaTxBusiness.eliminarNoticiaInterna(oParam);
					if(eliminarNoticiaInternaResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								eliminarNoticiaInternaResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								eliminarNoticiaInternaResponse.iCode, 
								eliminarNoticiaInternaResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamEliminarNoticiaInternaResponse.iCode, 
							validarParamEliminarNoticiaInternaResponse.sMessage
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
	        	registrarNoticiaInterna();
	        	break;
	        case $.net.http.PUT:
	        	actualizarNoticiaInterna();
	        	break;
	        case $.net.http.DEL:
	        	eliminarNoticiaInterna();
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