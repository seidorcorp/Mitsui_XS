var textAccess 					= $.import("sap.hana.xs.i18n","text");
var config 						= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var beneficioTxDao 				= $.import("MitsuiCitasPrd.Dao.Beneficio","BeneficioTxDao");
var serviceClientMantUsuarios 	= $.import("MitsuiCitasPrd.ServiceClient.Usuarios","MantUsuarios");
var serviceClientAuditoria 		= $.import("MitsuiCitasPrd.ServiceClient.Auditoria","Auditoria");
var oResponse					= {};

/**
 * @description Función que permite registrar un usuario para el portal
 * @creation David Moreno 31/07/2018
 * @update
 */
function registrarBeneficio(oParam){
	
	var oFiltro2 		= {};
	var tiempo			= 0;
	oFiltro2.oData 		= {};
	try {
		tiempo = new Date().getTime();

		//1. Registramos el beneficio en la BD
		oFiltro2.oAuditRequest 		= oParam.oAuditRequest;
		oFiltro2.oData 				= oParam.oData;
		
		var registrarBeneficioResponse 		= beneficioTxDao.registrarBeneficio(oFiltro2);
		if(registrarBeneficioResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(registrarBeneficioResponse.sMessage,'',registrarBeneficioResponse.iCode);			
		}
		
		oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage 	= bundle.getText("msj.idf1");
		
	}catch(e){
		if (e instanceof TypeError) {
			oResponse.iCode 	= e.lineNumber;
			oResponse.sMessage 	= e.message;
		}else{
			oResponse.iCode 	= parseInt(bundle.getText("code.idt2"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt2",[e.toString()]);
		}	
	}finally{
		try{
			var oRequest 				= {};
			oRequest.oAuditRequest 		= oParam.oAuditRequest;
			oRequest.sNombreProceso 	= "RegistrarBeneficio";
			oRequest.iProcesoPrincipal 	= 1;
			oRequest.iProcesoOrden 		= 0;
			oRequest.iTiempoProceso 	= ((new Date().getTime()) - tiempo);
			oRequest.sEntradaProceso 	= JSON.stringify(oParam.oData);
			oRequest.sRespuestaProceso 	= JSON.stringify(oResponse);
			oRequest.sMetadata 			= "";
			oRequest.sEstado 			= (oResponse.iCode === 1) ? "OK" : "ERROR";
			serviceClientAuditoria.registrarAuditoria(oRequest);
		} finally {
			
		}
	}
	return oResponse;
}


/**
 * @description Función que permite actualizar un usuario
 * @creation David Moreno 31/07/2018
 * @update
 */
function actualizarBeneficio(oParam){
	
	var tiempo	= 0;
	var oFiltro = {};
	try {
		tiempo 	= new Date().getTime();
		//1. Actualizamos el beneficio
		oFiltro.oAuditRequest  	=  oParam.oAuditRequest;
		oFiltro.oData 			= oParam.oData;
		var actualizarBeneficioResponse = beneficioTxDao.actualizarBeneficio(oFiltro);
		if(actualizarBeneficioResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(actualizarBeneficioResponse.sMessage,'',actualizarBeneficioResponse.iCode);
		}
		
		oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage 	= bundle.getText("msj.idf1");
		
	}catch(e){
		if (e instanceof TypeError) {
			oResponse.iCode 	= e.lineNumber;
			oResponse.sMessage 	= e.message;
		}else{
			oResponse.iCode 	=  parseInt(bundle.getText("code.idt2"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt2",[e.toString()]);
		}	
	} finally {
		try{
			var oRequest 				= {};
			oRequest.oAuditRequest 		= oParam.oAuditRequest;
			oRequest.sNombreProceso 	= "ActualizarBeneficio";
			oRequest.iProcesoPrincipal 	= 1;
			oRequest.iProcesoOrden 		= 0;
			oRequest.iTiempoProceso 	= ((new Date().getTime()) - tiempo);
			oRequest.sEntradaProceso 	= JSON.stringify(oParam.oData);
			oRequest.sRespuestaProceso 	= JSON.stringify(oResponse);
			oRequest.sMetadata 			= "";
			oRequest.sEstado 			= (oResponse.iCode === 1) ? "OK" : "ERROR";
			serviceClientAuditoria.registrarAuditoria(oRequest);
		} finally {
			
		}
	}
	return oResponse;
}

/**
 * @description Función que permite eliminar usuarios
 * @creation David Moreno 31/07/2018
 * @update
 */
function eliminarBeneficio(oParam){
	
	var tiempo		= 0;
	var oFiltro 	= {};
	oFiltro.oData 	= {};
	try {
		tiempo 				= new Date().getTime();
		var oParamUsuario 	= {};
		//1. Eliminamos  el benficio en la Base de datos
		oFiltro.oAuditRequest = oParam.oAuditRequest;
		oParam.oData.aItems.forEach(function(e){
			e.iIdEstado = parseInt(config.getText("id.estado.eliminado"), 10);
		});
		oFiltro.oData 						= oParam.oData;
		var eliminarBeneficioResponse 		= beneficioTxDao.eliminarBeneficio(oFiltro);
		if(eliminarBeneficioResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(eliminarBeneficioResponse.sMessage,'',eliminarBeneficioResponse.iCode);			
		}
		
		oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage 	= bundle.getText("msj.idf1");
		
	}catch(e){
		if (e instanceof TypeError) {
			oResponse.iCode 	= e.lineNumber;
			oResponse.sMessage 	= e.message;
		}else{
			oResponse.iCode 	= parseInt(bundle.getText("code.idt2"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt2",[e.toString()]);
		}	
	}finally {
		try{
			var oRequest 				= {};
			oRequest.oAuditRequest 		= oParam.oAuditRequest;
			oRequest.sNombreProceso 	= "EliminarBeneficio";
			oRequest.iProcesoPrincipal 	= 1;
			oRequest.iProcesoOrden 		= 0;
			oRequest.iTiempoProceso 	= ((new Date().getTime()) - tiempo);
			oRequest.sEntradaProceso 	= JSON.stringify(oParam.oData);
			oRequest.sRespuestaProceso 	= JSON.stringify(oResponse);
			oRequest.sMetadata 			= "";
			oRequest.sEstado 			= (oResponse.iCode === 1) ? "OK" : "ERROR";
			serviceClientAuditoria.registrarAuditoria(oRequest);
		} finally {
			
		}
	}
	return oResponse;
}
