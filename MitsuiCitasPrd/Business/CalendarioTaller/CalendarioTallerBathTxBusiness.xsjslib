/* tslint:disable:no-empty */
var textAccess 					= $.import("sap.hana.xs.i18n","text");
var config 						= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var tallerCnDao 				= $.import("MitsuiCitasPrd.Dao.Taller","TallerCnDao");
var calendarioTallerCnBusiness2 = $.import("MitsuiCitasPrd.Business.CalendarioTaller","CalendarioTallerCnBusiness2");
var oResponse					= {};

/**
 * @description Función que permite buscar taller segun filtros
 * @creation David Villanueva 28/08/2018
 * @update
 */
function generarCalendarioxFiltro(oParam){
	var tiempo			= 0;
	try {
		tiempo = new Date().getTime();
		// 1. Consultamos los talleres
		var oParamTaller 		= {};
		oParamTaller.iIdEstado	= 23;
		var consultarTallerxFiltroResponse  = tallerCnDao.consultarTallerxFiltro(oParamTaller);
		if(consultarTallerxFiltroResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarTallerxFiltroResponse.sMessage,'',parseInt(consultarTallerxFiltroResponse.iCode,10));			
		}
		
		var FechaInicio   = new Date();
		FechaInicio.setHours(FechaInicio.getHours() - 5);
		var sFechaInicio = utils.formatDate(FechaInicio, "yyyy-mm-dd");
		var FechaFinal =  new Date();
		FechaFinal.setMonth(FechaFinal.getMonth() + 1);
		var sFechaFinal = utils.formatDate(FechaFinal, "yyyy-mm-dd");
		for (var i = 0; i < consultarTallerxFiltroResponse.oData.length; i++) {
			var oParamCitas = {};
			oParamCitas.sCodigoTaller 	= consultarTallerxFiltroResponse.oData[i].sCentroSap;
			oParamCitas.dFechaInicio 	= sFechaInicio;
			oParamCitas.dFechaFin 		= sFechaFinal;
			var generarCalendarioxFiltroResponse =  calendarioTallerCnBusiness2.generarCalendarioxFiltro(oParamCitas);
			
			
		}
		
		
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


