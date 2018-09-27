/* tslint:disable:no-empty */
var textAccess 				= $.import("sap.hana.xs.i18n","text");
var config 					= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 					= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 					= $.import("MitsuiCitasPrd.Utils","Utils");
var citaCnDao 				= $.import("MitsuiCitasPrd.Dao.Cita","CitaCnDao");
var citaTxDao 				= $.import("MitsuiCitasPrd.Dao.Cita","CitaTxDao");
var serviceClientEmail		= $.import("MitsuiCitasPrd.ServiceClient.EnvioCorreo","EnvioCorreo");

var oResponse				= {};

/**
 * @description Función que permite enviar email a las citas 
 * @creation Roy Lazaro 12/09/2018
 * @update
 */
function enviarEmail(oParam){
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
			var enviarCorreoResponse 		= serviceClientEmail.enviarCorreo(oParamCorreo);
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
