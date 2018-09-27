var textAccess 					= $.import("sap.hana.xs.i18n","text");
var config 						= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var repuestoTxDao 				= $.import("MitsuiCitasPrd.Dao.Repuesto","RepuestoTxDao");
var serviceClientAuditoria 		= $.import("MitsuiCitasPrd.ServiceClient.Auditoria","Auditoria");
var oResponse					= {};

/**
 * @description Función que permite registrar una repuesto
 * @creation Cristian Floret 31/07/2018
 * @update
 */
function registrarRepuesto(oParam){
	
	var oFiltro2 		= {};
	var tiempo			= 0;
	oFiltro2.oData 		= {};
	try {
		tiempo = new Date().getTime();

		oFiltro2.oAuditRequest 		= oParam.oAuditRequest;
		oFiltro2.oData 				= oParam.oData;
        oFiltro2.oData.iIdEstado 	= parseInt(config.getText("id.estado.activo"), 10);
		
		var registrarRepuestoResponse 		= repuestoTxDao.registrarRepuesto(oFiltro2);
		if(registrarRepuestoResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(registrarRepuestoResponse.sMessage,'',registrarRepuestoResponse.iCode);			
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
			oRequest.sNombreProceso 	= (oParam.oData.sTipo === 'Accesorio') ? "RegistrarAccesorio":"RegistrarRepuesto";
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
 * @description Función que permite registrar varios repuestos 
 * @creation David Villanueva 31/07/2018
 * @update
 */
function registrarRepuestoMasivo(oParam){
	
	var oFiltro2 	= {};
	oFiltro2.oData 	= {};
	var tiempo		= 0;
	try {
		tiempo 								= new Date().getTime();
		oParam.oData.aItems.forEach(function(x){
			x.sTipoProducto = "REP";
		});
		//1. Registramos la lista de repuestos
		var registrarRepuestoMasivoResponse 		= repuestoTxDao.registrarRepuestoMasivo(oParam);
		if(registrarRepuestoMasivoResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(registrarRepuestoMasivoResponse.sMessage,'',registrarRepuestoMasivoResponse.iCode);			
		}
		
		oResponse.iCode 	=  parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage 	= bundle.getText("msj.idf1");
		
	}catch(e){
		if (e instanceof TypeError) {
			oResponse.iCode 	= e.lineNumber;
			oResponse.sMessage 	= e.message;
		}else{
			oResponse.iCode 	=  parseInt(bundle.getText("code.idt2"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt2",[e.toString()]);
		}	
	}finally{
		try{
			var oRequest 				= {};
			oRequest.oAuditRequest 		= oParam.oAuditRequest;
			oRequest.sNombreProceso 	= (oParam.oData.sTipo === 'Accesorio') ? "RegistrarAccesorioMasivo":"RegistrarRepuestoMasivo";
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
 * @description Función que permite registrar varios accesorios 
 * @creation David Villanueva 31/07/2018
 * @update
 */
function registrarAccesorioMasivo(oParam){
	
	var oFiltro2 	= {};
	oFiltro2.oData 	= {};
	var tiempo		= 0;
	try {
		tiempo 								= new Date().getTime();
		oParam.oData.aItems.forEach(function(x){
			x.sTipoProducto = "ACC";
		});
		//1. Registramos la lista de repuestos
		var registrarRepuestoMasivoResponse 		= repuestoTxDao.registrarRepuestoMasivo(oParam);
		if(registrarRepuestoMasivoResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(registrarRepuestoMasivoResponse.sMessage,'',registrarRepuestoMasivoResponse.iCode);			
		}
		
		oResponse.iCode 	=  parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage 	= bundle.getText("msj.idf1");
		
	}catch(e){
		if (e instanceof TypeError) {
			oResponse.iCode 	= e.lineNumber;
			oResponse.sMessage 	= e.message;
		}else{
			oResponse.iCode 	=  parseInt(bundle.getText("code.idt2"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt2",[e.toString()]);
		}	
	}finally{
		try{
			var oRequest 				= {};
			oRequest.oAuditRequest 		= oParam.oAuditRequest;
			oRequest.sNombreProceso 	= "RegistrarAccesorioMasivo";
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
 * @description Función que permite actualizar un repuesto
 * @creation Cristian Floret 31/07/2018
 * @update
 */
 function actualizarRepuesto(oParam){
	
	var tiempo	= 0;
	var oFiltro = {};
	try {
		tiempo 	= new Date().getTime();
		//1. Actualizamos la notificación
		oFiltro.oAuditRequest  	=  oParam.oAuditRequest;
		oFiltro.oData 			= oParam.oData;
		var actualizarRepuestoResponse 		= repuestoTxDao.actualizarRepuesto(oFiltro);
		if(actualizarRepuestoResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(actualizarRepuestoResponse.sMessage,'',actualizarRepuestoResponse.iCode);
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
			oRequest.sNombreProceso 	= (oParam.oData.sTipo === 'Accesorio') ? "ActualizarAccesorio":"ActualizarRepuesto";
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
 * @description Función que permite eliminar una o mas repuestoes
 * @creation Cristian Floret 31/07/2018
 * @update
 */
function eliminarRepuesto(oParam){
	
	var tiempo		= 0;
	var oFiltro 	= {};
	oFiltro.oData 	= {};
	try {
		tiempo 				= new Date().getTime();
		
		//1. Eliminamos  un repuesto en la Base de datos
		oFiltro.oAuditRequest = oParam.oAuditRequest;
		oParam.oData.aItems.forEach(function(e){
			e.iIdEstado = parseInt(config.getText("id.estado.eliminado"), 10);
		});
		oFiltro.oData 						= oParam.oData;
		var eliminarRepuestoResponse 		= repuestoTxDao.eliminarRepuesto(oFiltro);
		if(eliminarRepuestoResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(eliminarRepuestoResponse.sMessage,'',eliminarRepuestoResponse.iCode);			
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
			oRequest.sNombreProceso 	= (oParam.oData.sTipo === 'Accesorio') ? "EliminarAccesorio":"EliminarRepuesto";
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
