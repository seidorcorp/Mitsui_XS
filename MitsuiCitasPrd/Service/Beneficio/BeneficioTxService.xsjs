var textAccess 					= $.import("sap.hana.xs.i18n","text");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var beneficioTxBusiness 		= $.import("MitsuiCitasPrd.Business.Beneficio","BeneficiosTxBusiness");

var oBodyJson;
var oAuditoriaRequest;
var oDataRequest;
var sIdTransaccion;

function validarParamRegistrarBeneficio(){
	var oResponse = {};

	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamActualizarBeneficio(){
	var oResponse = {};
	if ($.request.parameters.get('Id') === undefined || $.request.parameters.get('Id') === null ||  $.request.parameters.get('Id') === 0) {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo Id Beneficio"]);
		return oResponse;
	}

	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamEliminarBeneficio(){
	var oResponse = {};

	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}


function registrarBeneficio(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var registrarBeneficioResponse;
		switch(Accion) {
			case 'RegistrarBeneficio':
				var validarParamRegistrarBeneficioResponse = validarParamRegistrarBeneficio();
				if(validarParamRegistrarBeneficioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					registrarBeneficioResponse = beneficioTxBusiness.registrarBeneficio(oParam);
					if(registrarBeneficioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								registrarBeneficioResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								registrarBeneficioResponse.iCode, 
								registrarBeneficioResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamRegistrarBeneficioResponse.iCode, 
							validarParamRegistrarBeneficioResponse.sMessage
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

function actualizarBeneficio(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var actualizarBeneficioResponse;
		switch(Accion) {
			case 'ActualizarBeneficio':
				var validarParamActualizarBeneficioResponse = validarParamActualizarBeneficio();
				if(validarParamActualizarBeneficioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					oParam.oData.iId = $.request.parameters.get('Id');
					actualizarBeneficioResponse = beneficioTxBusiness.actualizarBeneficio(oParam);
					if(actualizarBeneficioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								actualizarBeneficioResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								actualizarBeneficioResponse.iCode, 
								actualizarBeneficioResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamActualizarBeneficioResponse.iCode, 
							validarParamActualizarBeneficioResponse.sMessage
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

function eliminarBeneficio(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var eliminarBeneficioResponse;
		switch(Accion) {
			case 'EliminarBeneficio':
				var validarParamEliminarBeneficioResponse = validarParamEliminarBeneficio();
				if(validarParamEliminarBeneficioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					oParam.oData.iId = $.request.parameters.get('Id');
					eliminarBeneficioResponse = beneficioTxBusiness.eliminarBeneficio(oParam);
					if(eliminarBeneficioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								eliminarBeneficioResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								eliminarBeneficioResponse.iCode, 
								eliminarBeneficioResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamEliminarBeneficioResponse.iCode, 
							validarParamEliminarBeneficioResponse.sMessage
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
	        	registrarBeneficio();
	        	break;
	        case $.net.http.PUT:
	        	actualizarBeneficio();
	        	break;
	        case $.net.http.DEL:
	        	eliminarBeneficio();
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