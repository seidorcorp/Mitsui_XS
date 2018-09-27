var textAccess 							= $.import("sap.hana.xs.i18n","text");
var utils 								= $.import("MitsuiCitasPrd.Utils","Utils");
var bundle 								= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var clientePuntosCnBusiness 			= $.import("MitsuiCitasPrd.Business.Cliente","ClientePuntosCnBusiness");
var clienteCitasPendientesCnBusiness 	= $.import("MitsuiCitasPrd.Business.Cliente","ClienteCitasPendientesCnBusiness");

var oBodyJson;
var oAuditoriaRequest;
var oDataRequest;
var sIdTransaccion;

function validarParamConsultarCitasPendientes(){
	var oResponse = {};
//	if (sNumIdentificacion === undefined || sNumIdentificacion === null ||  sNumIdentificacion === "") {
//		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
//		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo RUC/DNI"]);
//		return oResponse;
//	}
		
	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function consultarCitasPendientes(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var consultarCitasClienteIdResponse;

		switch(Accion) {
			case 'ConsultarCitasPendientes':
				var validarParamConsultarCitasPendientesResponse = validarParamConsultarCitasPendientes();
				if(validarParamConsultarCitasPendientesResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					consultarCitasClienteIdResponse = clienteCitasPendientesCnBusiness.consultarCitasClienteId(oParam);
					if(consultarCitasClienteIdResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								consultarCitasClienteIdResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								consultarCitasClienteIdResponse.iCode, 
								consultarCitasClienteIdResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamConsultarCitasPendientesResponse.iCode, 
							validarParamConsultarCitasPendientesResponse.sMessage
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
	        	consultarCitasPendientes();
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