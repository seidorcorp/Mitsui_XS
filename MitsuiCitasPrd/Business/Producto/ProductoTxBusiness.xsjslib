var textAccess 					= $.import("sap.hana.xs.i18n","text");
var config 						= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var productoTxDao 				= $.import("MitsuiCitasPrd.Dao.Producto","ProductoTxDao");
var serviceClientAuditoria 		= $.import("MitsuiCitasPrd.ServiceClient.Auditoria","Auditoria");
var oResponse					= {};

/**
 * @description Función que permite registrar un producto
 * @creation David Villanueva 31/08/2018
 * @update
 */
function registrarProducto(oParam){
	
	var oFiltro2 		= {};
	var tiempo			= 0;
	oFiltro2.oData 		= {};
	try {
		tiempo = new Date().getTime();

		//1. Registramos el taller en la BD
		oFiltro2.oAuditRequest 		= oParam.oAuditRequest;
		oFiltro2.oData 				= oParam.oData;
		oFiltro2.oData.iIdEstado 	= parseInt(config.getText("id.estado.activo"), 10);
		
		var registrarProductoResponse 		= productoTxDao.registrarProducto(oFiltro2);
		if(registrarProductoResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(registrarProductoResponse.sMessage,'',registrarProductoResponse.iCode);			
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
			oRequest.sNombreProceso 	= "RegistrarProducto";
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
 * @description Función que permite registrar varios Productos 
 * @creation David Villanueva 31/07/2018
 * @update
 */
function registrarProductoMasivo(oParam){
	
	var oFiltro2 	= {};
	oFiltro2.oData 	= {};
	var tiempo		= 0;
	try {
		tiempo 								= new Date().getTime();
		
		//1. Registramos la lista de productos masivos
		var registrarProductoMasivoResponse 		= productoTxDao.registrarProductoMasivo(oParam);
		if(registrarProductoMasivoResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(registrarProductoMasivoResponse.sMessage,'',registrarProductoMasivoResponse.iCode);			
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
			oRequest.sNombreProceso 	= "RegistrarProductoMasivo";
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
 * @description Función que permite actualizar un Producto
 * @creation David Villanueva 31/07/2018
 * @update
 */
function actualizarProducto(oParam){
	
	var tiempo	= 0;
	var oFiltro = {};
	try {
		tiempo 	= new Date().getTime();
		//1. Actualizamos un taller
		oFiltro.oAuditRequest  	= oParam.oAuditRequest;
		oFiltro.oData 			= oParam.oData;
		var actualizarProductoResponse 		= productoTxDao.actualizarProducto(oFiltro);
		if(actualizarProductoResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(actualizarProductoResponse.sMessage,'',actualizarProductoResponse.iCode);
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
			oRequest.sNombreProceso 	= "ActualizarProducto";
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
 * @description Función que permite eliminar uno o varios Productos
 * @creation David Villanueva 31/07/2018
 * @update
 */
function eliminarProducto(oParam){
	
	var tiempo		= 0;
	var oFiltro 	= {};
	oFiltro.oData 	= {};
	try {
		tiempo 				= new Date().getTime();
		
		//1. Eliminamos  un producto
		oFiltro.oAuditRequest = oParam.oAuditRequest;
		oParam.oData.aItems.forEach(function(e){
			e.iIdEstado = parseInt(config.getText("id.estado.eliminado"), 10);
		});
		oFiltro.oData 							= oParam.oData;
		var eliminarProductoResponse 			= productoTxDao.eliminarProducto(oFiltro);
		if(eliminarProductoResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(eliminarProductoResponse.sMessage,'',eliminarProductoResponse.iCode);			
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
			oRequest.sNombreProceso 	= "EliminarProducto";
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
