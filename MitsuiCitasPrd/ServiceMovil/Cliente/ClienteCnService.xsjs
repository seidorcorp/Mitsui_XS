var textAccess 							= $.import("sap.hana.xs.i18n","text");
var utils 								= $.import("MitsuiCitasPrd.Utils","Utils");
var bundle 								= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var clientePuntosCnBusiness 			= $.import("MitsuiCitasPrd.Business.Cliente","ClientePuntosCnBusiness");
var clienteHistorialCitasCnBusiness 	= $.import("MitsuiCitasPrd.Business.Cliente","ClienteHistorialCitasCnBusiness");

var oBodyJson;
var oAuditoriaRequest;
var oDataRequest;
var sIdTransaccion;

function validarParamConsultarPuntos(sNumIdentificacion){
	var oResponse = {};
	if (sNumIdentificacion === undefined || sNumIdentificacion === null ||  sNumIdentificacion === "") {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo RUC/DNI"]);
		return oResponse;
	}
		
	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamConsultarHistorial(){
	var oResponse = {};
	if (oDataRequest.sPlaca === undefined || oDataRequest.sPlaca === null ||  oDataRequest.sPlaca === "") {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo Placa"]);
		return oResponse;
	}
		
	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function consultarInformacionCliente(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = {};
		var consultarPuntosClienteResponse;

		switch(Accion) {
			case 'ConsultarPuntosCliente':
				var validarParamConsultarPuntosResponse = validarParamConsultarPuntos($.request.parameters.get('Id'));
				if(validarParamConsultarPuntosResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					oParam.oData.sNumIdentificacion = $.request.parameters.get('Id');
					consultarPuntosClienteResponse = clientePuntosCnBusiness.consultarPuntosCliente(oParam);
					if(consultarPuntosClienteResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								consultarPuntosClienteResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								consultarPuntosClienteResponse.iCode, 
								consultarPuntosClienteResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamConsultarPuntosResponse.iCode, 
							validarParamConsultarPuntosResponse.sMessage
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

function consultarHistoricoCliente(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var consultarHistoricoCitasResponse;
		switch(Accion) {
			case 'ConsultarHistorialCitas':
				var validarParamConsultarHistorialResponse = validarParamConsultarHistorial();
				if(validarParamConsultarHistorialResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					consultarHistoricoCitasResponse = clienteHistorialCitasCnBusiness.consultarHistoricoCitas(oParam);
					if(consultarHistoricoCitasResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								consultarHistoricoCitasResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								consultarHistoricoCitasResponse.iCode, 
								consultarHistoricoCitasResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamConsultarHistorialResponse.iCode, 
							validarParamConsultarHistorialResponse.sMessage
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
		var validarAudit  = utils.validarGetRequest($.request.contentType, $.request.headers);
		if(validarAudit.iCode === parseInt(bundle.getText("code.idf1"), 10)){
			switch ( $.request.method ) {
	        case $.net.http.GET:
	        	consultarInformacionCliente();
	        	break;
	        case $.net.http.POST:
	        	consultarHistoricoCliente();
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