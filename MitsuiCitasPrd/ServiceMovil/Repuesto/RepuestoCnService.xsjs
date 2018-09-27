var textAccess 			= $.import("sap.hana.xs.i18n","text");
var utils 				= $.import("MitsuiCitasPrd.Utils","Utils");
var bundle 				= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var repuestoCnBusiness 	= $.import("MitsuiCitasPrd.Business.Repuesto","RepuestoCnBusiness");

var oBodyJson;
var oAuditoriaRequest;
var oDataRequest;
var sIdTransaccion;

function validarParamConsultarAccesorio(){
	var oResponse = {};
		
	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamConsultarRepuesto(){
	var oResponse = {};
		
	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function consultarProducto(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var buscarAccesoriosxFiltroResponse;
		var buscarRepuestoxFiltroResponse;

		switch(Accion) {
			case 'ConsultarAccesorio':
				var validarParamConsultarAccesorioResponse = validarParamConsultarAccesorio();
				if(validarParamConsultarAccesorioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					buscarAccesoriosxFiltroResponse = repuestoCnBusiness.buscarAccesoriosxFiltro(oParam);
					if(buscarAccesoriosxFiltroResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								buscarAccesoriosxFiltroResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								buscarAccesoriosxFiltroResponse.iCode, 
								buscarAccesoriosxFiltroResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamConsultarAccesorioResponse.iCode, 
							validarParamConsultarAccesorioResponse.sMessage
							);
				}
				break;
			
			case 'ConsultarRepuesto':
				var validarParamConsultarRepuestoResponse = validarParamConsultarRepuesto();
				if(validarParamConsultarRepuestoResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					buscarRepuestoxFiltroResponse = repuestoCnBusiness.buscarRepuestoxFiltro(oParam);
					if(buscarRepuestoxFiltroResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								buscarRepuestoxFiltroResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								buscarRepuestoxFiltroResponse.iCode, 
								buscarRepuestoxFiltroResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamConsultarRepuestoResponse.iCode, 
							validarParamConsultarRepuestoResponse.sMessage
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
	        	consultarProducto();
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