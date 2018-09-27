/* tslint:disable:no-empty */
var textAccess 				= $.import("sap.hana.xs.i18n","text");
var config 					= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 					= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 					= $.import("MitsuiCitasPrd.Utils","Utils");
var usuarioCnDao 			= $.import("MitsuiCitasPrd.Dao.NoticiaInterna","NoticiaInternaCnDao");

var oResponse				= {};

/**
 * @description Función que permite buscar usuarios segun filtros
 * @creation David Villanueva 03/02/2018
 * @update
 */
function buscarNoticiaInternaxFiltro(oParam){
	var oFiltro = {};
	try {
		oFiltro.sUsuario 		 		= oParam.oData.sUsuario;
		oFiltro.sUsuarioSap		 		= oParam.oData.sUsuarioSap;
		oFiltro.sNumIdentificacion	 	= oParam.oData.sNumIdentificacion;
		oFiltro.sNombre 		 		= oParam.oData.sNombre;
		oFiltro.sApellido 		 		= oParam.oData.sApellido;
		oFiltro.sEmail 		 			= oParam.oData.sEmail;
		oFiltro.iIdTipoUsuario 			= oParam.oData.iIdTipoUsuario;
		//1. Buscamos los usuarios segun filtro
		var consultarUsuarioResponse = usuarioCnDao.consultarUsuarioxFiltro(oFiltro);
		
		if(consultarUsuarioResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarUsuarioResponse.sMessage,'',consultarUsuarioResponse.iCode);
		}
		
		oResponse.oData = consultarUsuarioResponse.oData;
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
