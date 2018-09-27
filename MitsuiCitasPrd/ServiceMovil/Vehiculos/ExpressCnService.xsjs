var textAccess 			= $.import("sap.hana.xs.i18n","text");
var utils 				= $.import("MitsuiCitasPrd.Utils","Utils");
var bundle 				= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var expressCnBusiness 	= $.import("MitsuiCitasPrd.Business.Express","ExpressCnBusiness");

var oBodyJson;
var oAuditoriaRequest;
var oDataRequest;
var sIdTransaccion;

function validarParamConsultarExpress(){
	var oResponse = {};
	
	if (oDataRequest.sCodTaller === undefined || oDataRequest.sCodTaller === null ||  oDataRequest.sCodTaller === "") {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo CodigoTaller"]);
		return oResponse;
	}
	
	if (oDataRequest.sFechaCita === undefined || oDataRequest.sFechaCita === null ||  oDataRequest.sFechaCita === "") {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo FechaCita"]);
		return oResponse;
	}
	
	if (oDataRequest.sHoraCita === undefined || oDataRequest.sHoraCita === null ||  oDataRequest.sHoraCita === "") {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo HoraCita"]);
		return oResponse;
	}
	
	if (oDataRequest.sCodigoModelo === undefined || oDataRequest.sCodigoModelo === null ||  oDataRequest.sCodigoModelo === "") {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo CodigoModelo"]);
		return oResponse;
	}
	
	if (oDataRequest.sCodigoMant === undefined || oDataRequest.sCodigoMant === null ||  oDataRequest.sCodigoMant === "") {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo CodigoMant"]);
		return oResponse;
	}
	
	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}


function consultarExpress(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var validarServicioExpressResponse;

		switch(Accion) {
			case 'ConsultarExpress':
				var validarParamConsultarExpressResponse = validarParamConsultarExpress();
				if(validarParamConsultarExpressResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					validarServicioExpressResponse = expressCnBusiness.validarServicioExpress(oParam);
					if(validarServicioExpressResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								validarServicioExpressResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								validarServicioExpressResponse.iCode, 
								validarServicioExpressResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamConsultarExpressResponse.iCode, 
							validarParamConsultarExpressResponse.sMessage
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
	        	consultarExpress();
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