var textAccess 			= $.import("sap.hana.xs.i18n","text");
var utils 				= $.import("MitsuiCitasPrd.Utils","Utils");
var bundle 				= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var vehiculoCnBusiness 	= $.import("MitsuiCitasPrd.Business.Vehiculo","VehiculoCnBusiness");

var oBodyJson;
var oAuditoriaRequest;
var oDataRequest;
var sIdTransaccion;

function validarParamConsultarVehiculo(){
	var oResponse = {};
	
	if (oDataRequest.iIdCliente === undefined || oDataRequest.iIdCliente === null ||  oDataRequest.iIdCliente === "") {
		oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
		oResponse.sMessage = bundle.getText("msj.idf10",["Falta el Campo Id Cliente"]);
		return oResponse;
	}
	
	oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
	oResponse.sMessage = bundle.getText("msj.idf1");
	return oResponse;
}

function validarParamConsultaUltKm(){
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

function consultarVehiculo(){
	var oParam = {};
	var Accion = $.request.parameters.get('Accion');
	try{
		oBodyJson = JSON.parse($.request.body.asString());
		oAuditoriaRequest = utils.datosAuditoria($.request.headers);
		sIdTransaccion = oAuditoriaRequest.sIdTransaccion;
		oDataRequest = oBodyJson.oResults;
		var buscarVehiculosxFiltroResponse;
		var buscarUltimoKmAutoResponse;
		switch(Accion) {
			case 'ConsultarVehiculo':
				var validarParamConsultarVehiculoResponse = validarParamConsultarVehiculo();
				if(validarParamConsultarVehiculoResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					buscarVehiculosxFiltroResponse = vehiculoCnBusiness.buscarVehiculosxFiltro(oParam);
					if(buscarVehiculosxFiltroResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								buscarVehiculosxFiltroResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								buscarVehiculosxFiltroResponse.iCode, 
								buscarVehiculosxFiltroResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamConsultarVehiculoResponse.iCode, 
							validarParamConsultarVehiculoResponse.sMessage
							);
				}
				break;
				
			case 'UltimoKmVehiculo':
				var validarParamConsultaUltKmResponse = validarParamConsultaUltKm();
				if(validarParamConsultaUltKmResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oParam.oAuditRequest = oAuditoriaRequest;
					oParam.oData = oDataRequest;
					buscarUltimoKmAutoResponse = vehiculoCnBusiness.buscarUltimoKmAuto(oParam);
					if(buscarUltimoKmAutoResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
						utils.sendResponse(
								sIdTransaccion,
								parseInt(bundle.getText("code.idf1"), 10), 
								bundle.getText("msj.idf1"), 
								buscarUltimoKmAutoResponse.oData );
					}else{
						utils.sendResponseError(
								sIdTransaccion,
								buscarUltimoKmAutoResponse.iCode, 
								buscarUltimoKmAutoResponse.sMessage 
								);
					}
				}else{
					utils.sendResponseError(
							sIdTransaccion,
							validarParamConsultaUltKmResponse.iCode, 
							validarParamConsultaUltKmResponse.sMessage
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
	        	consultarVehiculo();
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