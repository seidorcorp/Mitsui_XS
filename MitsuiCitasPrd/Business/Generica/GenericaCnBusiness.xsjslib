/* tslint:disable:no-empty */
var textAccess 				= $.import("sap.hana.xs.i18n","text");
var config 					= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 					= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 					= $.import("MitsuiCitasPrd.Utils","Utils");
var genericaCampoCnDao 		= $.import("MitsuiCitasPrd.Dao.Generica","GenericaCampoCnDao");

var oResponse				= {};

/**
 * @description Función que permite buscar campos por tabla
 * @creation David Villanueva 30/08/2018
 * @update
 */
function buscarCamposxTabla(oParam){
	var oFiltro = {};
	try {
		oFiltro.iIdEstado 		= parseInt(config.getText("id.estado.activo"), 10);
		oFiltro.sCodigoTabla	= oParam.oData.sCodigoTabla;
		oFiltro.iIdPadre		= oParam.oData.iIdPadre;
		//1. Buscamos los campos segun filtro
		var consultarCampoxTablaResponse = genericaCampoCnDao.consultarCampoxTabla(oFiltro);
		
		if(consultarCampoxTablaResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarCampoxTablaResponse.sMessage,'',consultarCampoxTablaResponse.iCode);
		}
		
		oResponse.oData = consultarCampoxTablaResponse.oData;
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
