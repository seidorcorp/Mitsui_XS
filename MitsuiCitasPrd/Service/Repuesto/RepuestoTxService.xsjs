var textAccess 			= $.import("sap.hana.xs.i18n","text");
var utils 				= $.import("MitsuiCitasPrd.Utils","Utils");
var bundle 				= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var repuestoTxBusiness 	= $.import("MitsuiCitasPrd.Business.Repuesto","RepuestoTxBusiness");

var oBodyJson;
var oAuditoriaRequest;
var oDataRequest;
var sIdTransaccion;

function validarParamRegistrarRepuesto(){
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

function validarParamRegistrarAccesorio(){
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


function validarParamActualizarRepuesto(){
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

function validarParamEliminarRepuesto(){
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


function registrarRepuesto(){
	var oParam = {};
    var Accion = $.request.parameters.get('Accion');
    var Tipo = $.request.parameters.get('Tipo');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
        var registrarRepuestoMasivoResponse;
        
		switch(Accion) {
			case 'RegistrarRepuestoMasivo':
				var validarParamRegistrarRepuestoResponse = validarParamRegistrarRepuesto();
				if(validarParamRegistrarRepuestoResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
                    oParam.oData 		= oDataRequest;
                    oParam.oData.sTipo 	= Tipo;
                    registrarRepuestoMasivoResponse = repuestoTxBusiness.registrarRepuestoMasivo(oParam);
					if(registrarRepuestoMasivoResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								registrarRepuestoMasivoResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								registrarRepuestoMasivoResponse.iCode, 
								registrarRepuestoMasivoResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamRegistrarRepuestoResponse.iCode, 
							validarParamRegistrarRepuestoResponse.sMessage
							);
				}
			break;
			case 'RegistrarAccesorioMasivo':
				var validarParamRegistrarAccesorioResponse = validarParamRegistrarAccesorio();
				if(validarParamRegistrarAccesorioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
                    oParam.oData = oDataRequest;
                    oParam.oData.sTipo 	= Tipo;
                    registrarRepuestoMasivoResponse = repuestoTxBusiness.registrarAccesorioMasivo(oParam);
					if(registrarRepuestoMasivoResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								registrarRepuestoMasivoResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								registrarRepuestoMasivoResponse.iCode, 
								registrarRepuestoMasivoResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamRegistrarAccesorioResponse.iCode, 
							validarParamRegistrarAccesorioResponse.sMessage
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

function actualizarRepuesto(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
//	var Tipo = $.request.parameters.get('Tipo');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var actualizarRepuestoResponse;
		switch(Accion) {
			case 'ActualizarRepuesto':
				var validarParamActualizarRepuestoResponse = validarParamActualizarRepuesto();
				if(validarParamActualizarRepuestoResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					oParam.oData.iId = $.request.parameters.get('Id');
//					oParam.oData.sTipo 	= Tipo;
					actualizarRepuestoResponse = repuestoTxBusiness.actualizarRepuesto(oParam);
					if(actualizarRepuestoResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								actualizarRepuestoResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								actualizarRepuestoResponse.iCode, 
								actualizarRepuestoResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamActualizarRepuestoResponse.iCode, 
							validarParamActualizarRepuestoResponse.sMessage
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

function eliminarRepuesto(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	var Tipo = $.request.parameters.get('Tipo');
    try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var eliminarRepuestoResponse;
		switch(Accion) {
			case 'EliminarRepuesto':
				var validarParamEliminarRepuestoResponse = validarParamEliminarRepuesto();
				if(validarParamEliminarRepuestoResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest 	= oAuditoriaRequest;
					oParam.oData 			= oDataRequest;
					oParam.oData.sTipo 		= Tipo;
					eliminarRepuestoResponse = repuestoTxBusiness.eliminarRepuesto(oParam);
					if(eliminarRepuestoResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								eliminarRepuestoResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								eliminarRepuestoResponse.iCode, 
								eliminarRepuestoResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamEliminarRepuestoResponse.iCode, 
							validarParamEliminarRepuestoResponse.sMessage
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
	        	registrarRepuesto();
	        	break;
	        case $.net.http.PUT:
	        	actualizarRepuesto();
	        	break;
	        case $.net.http.DEL:
	        	eliminarRepuesto();
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