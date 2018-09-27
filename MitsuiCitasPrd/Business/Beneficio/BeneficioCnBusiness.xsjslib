/* tslint:disable:no-empty */
var textAccess 				= $.import("sap.hana.xs.i18n","text");
var config 					= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 					= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 					= $.import("MitsuiCitasPrd.Utils","Utils");
var beneficioCnDao 			= $.import("MitsuiCitasPrd.Dao.Beneficio","BeneficioCnDao");

var oResponse				= {};

/**
 * @description Función que permite buscar beneficios segun filtros
 * @creation Roy Lazaro 23/08/2018
 * @update
 */
function buscarBeneficiosxFiltro(oParam){
	var oFiltro = {};
	try {
		oFiltro.iIdEstado 		= parseInt(config.getText("id.estado.activo"), 10);
		//1. Buscamos los beneficios segun filtro
		var consultarBeneficioxFiltroResponse = beneficioCnDao.consultarBeneficioxFiltro(oFiltro);
		
		if(consultarBeneficioxFiltroResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarBeneficioxFiltroResponse.sMessage,'',consultarBeneficioxFiltroResponse.iCode);
		}
		
		oResponse.oData = consultarBeneficioxFiltroResponse.oData;
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
