/* tslint:disable:no-empty */
var textAccess 				= $.import("sap.hana.xs.i18n","text");
var config 					= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 					= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 					= $.import("MitsuiCitasPrd.Utils","Utils");
var repuestoCnDao 			= $.import("MitsuiCitasPrd.Dao.Repuesto","RepuestoCnDao");

var oResponse				= {};

/**
 * @description Función que permite buscar accesorios segun filtros
 * @creation David Villanueva 21/08/2018
 * @update
 */
function buscarAccesoriosxFiltro(oParam){
	var oFiltro = {};
	try {
		oFiltro.iIdEstado 	= parseInt(config.getText("id.estado.activo"), 10);
		oFiltro.sCodMarca	= oParam.oData.sCodMarca;
		oFiltro.sCodTipo	= oParam.oData.sCodTipo;
		//1. Buscamos los accesorios segun filtro
		var consultarAccesorioxFiltroResponse = repuestoCnDao.consultarAccesorioxFiltro(oFiltro);
		
		if(consultarAccesorioxFiltroResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarAccesorioxFiltroResponse.sMessage,'',consultarAccesorioxFiltroResponse.iCode);
		}
		
		oResponse.oData = consultarAccesorioxFiltroResponse.oData;
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


/**
 * @description Función que permite buscar repuestos segun filtros
 * @creation David Villanueva 22/08/2018
 * @update
 */
function buscarRepuestoxFiltro(oParam){
	var oFiltro = {};
	try {
		oFiltro.iIdEstado 		= parseInt(config.getText("id.estado.activo"), 10);
		oFiltro.sCodMarca	= oParam.oData.sCodMarca;
		oFiltro.sCodModelo	= oParam.oData.sCodModelo;
		//1. Buscamos los accesorios segun filtro
		var consultarRepuestoxFiltroResponse = repuestoCnDao.consultarRepuestoxFiltro(oFiltro);
		
		if(consultarRepuestoxFiltroResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarRepuestoxFiltroResponse.sMessage,'',consultarRepuestoxFiltroResponse.iCode);
		}
		
		oResponse.oData 	= consultarRepuestoxFiltroResponse.oData;
		oResponse.iCode 	=  parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage 	= bundle.getText("msj.idf1");
		
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
