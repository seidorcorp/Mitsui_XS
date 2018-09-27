/* tslint:disable:no-empty */
var textAccess 				= $.import("sap.hana.xs.i18n","text");
var config 					= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 					= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 					= $.import("MitsuiCitasPrd.Utils","Utils");
var productoCnDao 			= $.import("MitsuiCitasPrd.Dao.Producto","ProductoCnDao");

var oResponse				= {};

/**
 * @description Función que permite buscar productos segun filtros
 * @creation Roy Lazaro 23/08/2018
 * @update
 */
function buscarProductosxFiltro(oParam){
	var oFiltro = {};
	try {
		oFiltro.iIdEstado 		= parseInt(config.getText("id.estado.activo"), 10);
		oFiltro.sJerarquia 		= oParam.oData.sJerarquia;
		//1. Buscamos los productos segun filtro
		var consultarProductoxFiltroResponse = productoCnDao.consultarProductoxFiltro(oFiltro);
		
		if(consultarProductoxFiltroResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarProductoxFiltroResponse.sMessage,'',consultarProductoxFiltroResponse.iCode);
		}
		
		oResponse.oData = consultarProductoxFiltroResponse.oData;
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
