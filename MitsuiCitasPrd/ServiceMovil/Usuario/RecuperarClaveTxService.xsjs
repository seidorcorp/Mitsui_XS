var textAccess 				= $.import("sap.hana.xs.i18n","text");
var utils 					= $.import("MitsuiCitasPrd.Utils","Utils");
var bundle 					= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var recuperarClaveService 	= $.import("MitsuiCitasPrd.ServiceClient.RecuperarClave","RecuperarClave");

var oBodyJson;
var oAuditoriaRequest;
var oDataRequest;
var sIdTransaccion;


function validarParamRecuperarClaveMovil(){
	var oResponse = {};
	if (oDataRequest.sUsuario === undefined || oDataRequest.sUsuario === null ||  oDataRequest.sUsuario === "") {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo Email"]);
		return oResponse;
	}

	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}
function recuperarClave(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var recuperarClaveResponse;
		switch(Accion) {
			case 'RecuperarClave':
				var validarParamRecuperarClaveMovilResponse = validarParamRecuperarClaveMovil();
				if(validarParamRecuperarClaveMovilResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					recuperarClaveResponse = recuperarClaveService.recuperarClave(oParam);
					if(recuperarClaveResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								recuperarClaveResponse.sMessage, 
								recuperarClaveResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								recuperarClaveResponse.iCode, 
								recuperarClaveResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamRecuperarClaveMovilResponse.iCode, 
							validarParamRecuperarClaveMovilResponse.sMessage
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
	        	recuperarClave();
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