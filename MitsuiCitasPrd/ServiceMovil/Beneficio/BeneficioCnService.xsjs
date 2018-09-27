var textAccess 			= $.import("sap.hana.xs.i18n","text");
var utils 				= $.import("MitsuiCitasPrd.Utils","Utils");
var bundle 				= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var beneficioCnBusiness 	= $.import("MitsuiCitasPrd.Business.Beneficio","BeneficioCnBusiness");

var oBodyJson;
var oAuditoriaRequest;
var oDataRequest;
var sIdTransaccion;

function validarParamConsultarBeneficios(){
	var oResponse = {};

		
	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function consultarBeneficio(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var buscarBeneficiosxFiltroResponse;

		switch(Accion) {
			case 'ConsultarBeneficio':
				var validarParamConsultarBeneficiosResponse = validarParamConsultarBeneficios();
				if(validarParamConsultarBeneficiosResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					buscarBeneficiosxFiltroResponse = beneficioCnBusiness.buscarBeneficiosxFiltro(oParam);
					if(buscarBeneficiosxFiltroResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								buscarBeneficiosxFiltroResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								buscarBeneficiosxFiltroResponse.iCode, 
								buscarBeneficiosxFiltroResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamConsultarBeneficiosResponse.iCode, 
							validarParamConsultarBeneficiosResponse.sMessage
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
	        	consultarBeneficio();
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