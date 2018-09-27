/* tslint:disable:no-empty */
var textAccess 				= $.import("sap.hana.xs.i18n","text");
var config 					= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 					= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 					= $.import("MitsuiCitasPrd.Utils","Utils");
var citaCnDao 				= $.import("MitsuiCitasPrd.Dao.Cita","CitaCnDao");
var citaTxDao 				= $.import("MitsuiCitasPrd.Dao.Cita","CitaTxDao");
var serviceClientEmail		= $.import("MitsuiCitasPrd.ServiceClient.EnvioCorreoGeneral","EnvioCorreoGeneral");

var oResponse				= {};


function enviarCorreoError(oParam){
	var oRespuestaCorreo		= {};
	try{
		var tramaExpress = '';
		if(oParam.bExpress === true){
			tramaExpress = "<li><strong style=\" color: #807777;\">Express</strong></li> ";
		}
		
		var oRequest 				= {};
		oRequest.sCorreoDestino 	= oParam.sCorreoDestino;
		oRequest.sAsunto			= "[CITAS-APP] - " + oParam.sTaller;
		oRequest.sCuerpo		 	=  "<font color=\"#888181\" size=\"3\" face=\"MS Sans Serif\">"+
										"<h4><b>Cita generada para el taller: "+oParam.sTaller+"  </b></h4>"+ 
										"<i><b style=\"color: #546494\"> Información del Cliente: </b></i><br><ul>" +
										"<li><strong style=\" color: #807777;\">Nombre:</strong> "+oParam.sNombre+"</li>" +
										"<li><strong style=\" color: #807777;\">Placa:</strong> "+oParam.sPlaca+"</li></ul>" +
										"<i><b style=\"color: #546494\">Información del Servicio:</b></i><br> <ul>" +
										"<li><strong style=\" color: #807777;\">Codigo Cita:</strong> "+oParam.sCodCita+" </li>" +
										"<li><strong style=\" color: #807777;\">Fecha:</strong> "+utils.formatDate(oParam.sFecha, "dd/mm/yyyy")+" </li>" +
										"<li><strong style=\" color: #807777;\">Hora:</strong> "+oParam.sHora+" </li>" +
										"<li><strong style=\" color: #807777;\">Tipo Servicio:</strong> "+oParam.sTipoServicio+" </li>" +
										"<li><strong style=\" color: #807777;\">Servicio a realizar:</strong> "+oParam.sServicioRealizar+" </li>" +
										"<li><strong style=\" color: #807777;\">Observación:</strong> "+oParam.sObservacion+" </li>" +
										"<li><strong style=\" color: #807777;\">Telefono:</strong> "+oParam.sTelefono+" </li>" +
										"<li><strong style=\" color: #807777;\">Medio Contacto:</strong> "+oParam.sMedioContacto+" </li>" +
										tramaExpress +
										"</ul>" +
										"</font>";
		
		var enviarCorreoResponse = serviceClientEmail.enviarCorreo(oRequest);
		if(enviarCorreoResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
			oRespuestaCorreo.iCode 		= parseInt(bundle.getText("code.idf1"), 10);
			oRespuestaCorreo.sMessage 	= bundle.getText("msj.idf1");
		}else {
			oRespuestaCorreo.iCode 		= enviarCorreoResponse.iCode;
			oRespuestaCorreo.sMessage 	= enviarCorreoResponse.sMessage;
		}
		
	}catch(e){
		if (e instanceof TypeError) {
			oRespuestaCorreo.iCode 	= e.lineNumber;
			oRespuestaCorreo.sMessage 	= e.message;
		}else{
			oRespuestaCorreo.iCode 	= parseInt(bundle.getText("code.idt2"), 10);
			oRespuestaCorreo.sMessage 	= bundle.getText("msj.idt2",[e.toString()]);
		}	
	}
	
	return oRespuestaCorreo;
}


/**
 * @description Función que permite enviar email a las citas generadas
 * @creation Roy Lazaro 12/09/2018
 * @update
 */
function enviarEmailCitasGeneradas(oParam){
	try {
		//1. Buscamos los accesorios segun filtro
		var oFiltroCita = {};
		oFiltroCita.iEnvioEmail = 0;
		var consultarCitaxFiltroResponse = citaCnDao.consultarCitaxFiltro(oFiltroCita);
		if(consultarCitaxFiltroResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarCitaxFiltroResponse.sMessage,'',consultarCitaxFiltroResponse.iCode);
		}
		
		for (var i = 0; i < consultarCitaxFiltroResponse.oData.length; i++) {
			var oParamCorreo = {};
			oParamCorreo.sCodCita	    	= utils.convertEmptyToVacio(consultarCitaxFiltroResponse.oData[i].sIdCita);
			oParamCorreo.sCorreoDestino 	= utils.convertEmptyToVacio(consultarCitaxFiltroResponse.oData[i].sEmailCita);
			oParamCorreo.sTaller			= utils.convertEmptyToVacio(consultarCitaxFiltroResponse.oData[i].sTaller);
			oParamCorreo.sNombre		 	= utils.convertEmptyToVacio(consultarCitaxFiltroResponse.oData[i].sNombre) + " " + utils.convertEmptyToVacio(consultarCitaxFiltroResponse.oData[i].sApellido);
			oParamCorreo.sPlaca		 		= utils.convertEmptyToVacio(consultarCitaxFiltroResponse.oData[i].sPlaca);
			oParamCorreo.sFecha				= utils.convertEmptyToVacio(consultarCitaxFiltroResponse.oData[i].dFechaCita);
			oParamCorreo.sHora			 	= utils.convertEmptyToVacio(consultarCitaxFiltroResponse.oData[i].sHoraCita);
			oParamCorreo.sTipoServicio		= utils.convertEmptyToVacio(consultarCitaxFiltroResponse.oData[i].sTipoServicio);
			oParamCorreo.sServicioRealizar	= utils.convertEmptyToVacio(consultarCitaxFiltroResponse.oData[i].sServicioRealizar);
			oParamCorreo.sObservacion		= utils.convertEmptyToVacio(consultarCitaxFiltroResponse.oData[i].sObservacion);
			oParamCorreo.sTelefono			= utils.convertEmptyToVacio(consultarCitaxFiltroResponse.oData[i].sTelefono);
			oParamCorreo.sMedioContacto		= utils.convertEmptyToVacio(consultarCitaxFiltroResponse.oData[i].sDescMedioContacto);
			oParamCorreo.bExpress			= (utils.convertEmptyToVacio(consultarCitaxFiltroResponse.oData[i].iExpress) === 1) ? true : false;
			var enviarCorreoResponse 		= enviarCorreoError(oParamCorreo);
			if(enviarCorreoResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
				var oParamCorreo 			= {};
				oParamCorreo.iEnvioEmail 	= 1;
				oParamCorreo.iId = utils.convertEmptyToVacio(consultarCitaxFiltroResponse.oData[i].iId);
				citaTxDao.actualizarEstadoCorreo(oParamCorreo);
			}
		}
		
//		oResponse.oData = consultarCitaxFiltroResponse.oData;
		oResponse.iCode =  parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
		
	}catch(e){
		if (e instanceof TypeError) {
			oResponse.iCode = e.lineNumber;
			oResponse.sMessage = e.message;
		}else{
			oResponse.iCode =  parseInt(bundle.getText("code.idt2"), 10);
			oResponse.sMessage = bundle.getText("msj.idt2",[e.toString()]);
		}	
	}
	return oResponse;
}
