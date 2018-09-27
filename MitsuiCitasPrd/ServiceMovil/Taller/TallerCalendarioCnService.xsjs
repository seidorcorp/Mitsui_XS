var textAccess 					= $.import("sap.hana.xs.i18n","text");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
//var calendarioTallerCnBusiness 	= $.import("MitsuiCitasPrd.Business.CalendarioTaller","CalendarioTallerCnBusiness2");
var calendarioTallerCnBusiness 	= $.import("MitsuiCitasPrd.ServiceClient.TallerCalendario","TallerCalendario");

var oBodyJson;
var oAuditoriaRequest;
var oDataRequest;
var sIdTransaccion;

function validarParamConsultarTallerCalendario(){
	var oResponse = {};
		
	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}


function consultarTallerCalendario(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var generarCalendarioxFiltroResponse;

		switch(Accion) {
			case 'ConsultarCalendarioTaller':
				var validarParamConsultarTallerCalendarioResponse = validarParamConsultarTallerCalendario();
				if(validarParamConsultarTallerCalendarioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					//Serivio apunta al Java
					generarCalendarioxFiltroResponse = calendarioTallerCnBusiness.consultarTallerCalendario(oParam);
					//Serivicio  
					//generarCalendarioxFiltroResponse = calendarioTallerCnBusiness.generarCalendarioxFiltro(oParam);
					if(generarCalendarioxFiltroResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								generarCalendarioxFiltroResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								generarCalendarioxFiltroResponse.iCode, 
								generarCalendarioxFiltroResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamConsultarTallerCalendarioResponse.iCode, 
							validarParamConsultarTallerCalendarioResponse.sMessage
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
	        	consultarTallerCalendario();
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