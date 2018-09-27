/* tslint:disable:no-empty */
var textAccess 				= $.import("sap.hana.xs.i18n","text");
var config 					= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 					= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 					= $.import("MitsuiCitasPrd.Utils","Utils");
var tallerCnDao 			= $.import("MitsuiCitasPrd.Dao.Taller","TallerCnDao");

var oResponse				= {};

/**
 * @description Función que permite buscar taller segun filtros
 * @creation David Villanueva 28/08/2018
 * @update
 */
function buscarTallerxFiltro(oParam){
	var oFiltro = {};
	try {
		oFiltro.iIdEstado 		= parseInt(config.getText("id.estado.activo"), 10);
		oFiltro.sMarca			= oParam.oData.sMarca;
		//1. Buscamos los accesorios segun filtro
		var consultarTallerxFiltroResponse = tallerCnDao.consultarTallerxFiltro(oFiltro);
		
		if(consultarTallerxFiltroResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarTallerxFiltroResponse.sMessage,'',consultarTallerxFiltroResponse.iCode);
		}
		
		
		//2. Funcionalidad para poder ver si un local esta abierto o cerrado segun el horario configurado
		for (var i = 0; i < consultarTallerxFiltroResponse.oData.length; i++) {
			var FechaActual = new Date();
			FechaActual.setHours(FechaActual.getHours() -5);
			var horarioActual = '';
			var diaCita = FechaActual.getDay();
			if(diaCita === 6){
				horarioActual = consultarTallerxFiltroResponse.oData[i].sHorario2;
			}else{
				horarioActual = consultarTallerxFiltroResponse.oData[i].sHorario1;
			}
			var HoraActual = ("00"+FechaActual.getHours()).substr(-2,2) + ":" + ("00"+FechaActual.getMinutes()).substr(-2,2) ;
			consultarTallerxFiltroResponse.oData[i].iDisponible = (utils.validarHora(horarioActual, HoraActual) ===true) ? 1:0;
		}
		
		oResponse.oData = consultarTallerxFiltroResponse.oData;
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

