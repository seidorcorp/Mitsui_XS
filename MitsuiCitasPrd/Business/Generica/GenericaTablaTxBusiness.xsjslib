var textAccess 				= $.import("sap.hana.xs.i18n","text");
var config 					= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 					= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 					= $.import("MitsuiCitasPrd.Utils","Utils");
var genericaTablaCnDao 		= $.import("MitsuiCitasPrd.Dao.Generica","GenericaTablaCnDao");
var genericaTablaTxDao 		= $.import("MitsuiCitasPrd.Dao.Generica","GenericaTablaTxDao");
var serviceClientAuditoria 	= $.import("MitsuiCitasPrd.ServiceClient.Auditoria","Auditoria");
var oResponse={};


/**
 * @description Función que permite registrar una tabla generica  
 * @creation David Villanueva 22/01/2018
 * @update
 */
function registrarTablaGenerica(oParam){
	
	var oFiltro ={};
	var oFiltro2 ={};
	var tiempo=0;
	oFiltro2.oData = {};
	try {
		tiempo = new Date().getTime();
		//1. Consultamos si no existe otra tabla con el mismo nombre
		oFiltro.sCodigoTabla = oParam.oData.sCodigoTabla;
		var genericaTablaCnDaoResponse = genericaTablaCnDao.consultarTabla(oFiltro);
		
		if(genericaTablaCnDaoResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(bundle.getText("msj.idf7"),'',parseInt(bundle.getText("code.idf7"), 10));	
		}
		if(genericaTablaCnDaoResponse.iCode === parseInt(bundle.getText("code.idt1"), 10)){
			throw new TypeError(genericaTablaCnDaoResponse.sMessage,'',genericaTablaCnDaoResponse.iCode);	
		}
		//2. Registramos la tabla
		oFiltro2.oAuditRequest = oParam.oAuditRequest;
		oFiltro2.oData.iIdEstado =  parseInt(config.getText("id.estado.activo"), 10);
		oFiltro2.oData.sCodigoTabla = oParam.oData.sCodigoTabla;
		oFiltro2.oData.sDescripcionTabla = oParam.oData.sDescripcionTabla;
		oFiltro2.oData.sTipo = config.getText("codigo.tipo.tabla");
		
		var genericaTablaTxDaoResponse = genericaTablaTxDao.registrarTabla(oFiltro2);
		if(genericaTablaTxDaoResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(genericaTablaTxDaoResponse.sMessage,'',genericaTablaTxDaoResponse.iCode);			
		}
			
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
	}finally{
		try{
			var oRequest = {};
			oRequest.oAuditRequest = oParam.oAuditRequest;
			oRequest.sNombreProceso = "RegistrarTablaGenerica";
			oRequest.iProcesoPrincipal = 1;
			oRequest.iProcesoOrden = 0;
			oRequest.iTiempoProceso = ((new Date().getTime()) - tiempo);
			oRequest.sEntradaProceso = JSON.stringify(oParam.oData);
			oRequest.sRespuestaProceso = JSON.stringify(oResponse);
			oRequest.sMetadata = "";
			oRequest.sEstado = (oResponse.iCode === 1) ? "OK" : "ERROR";
			serviceClientAuditoria.registrarAuditoria(oRequest);
		} finally {
			
		}
	}
	return oResponse;
}

/**
 * @description Función que permite actualizar una tabla generica  
 * @creation David Villanueva 22/01/2018
 * @update
 */
function actualizarTablaGenerica(oParam){
	
	var tiempo=0;
	var oFiltro ={};
	var oFiltro2 ={};
	oFiltro2.oData = {};
	var oFiltro3 ={};
	try {
		tiempo = new Date().getTime();
		//1. Consultamos si no existe otra tabla con el mismo nombre
		oFiltro.sCodigoTabla = oParam.oData.sCodigoTabla;
		oFiltro.iNotId = oParam.oData.iId;
		var genericaTablaCnDaoResponse = genericaTablaCnDao.consultarTabla(oFiltro);
		
		if(genericaTablaCnDaoResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(bundle.getText("msj.idf7"),'',parseInt(bundle.getText("code.idf7"), 10));	
		}
		if(genericaTablaCnDaoResponse.iCode === parseInt(bundle.getText("code.idt1"), 10)){
			throw new TypeError(genericaTablaCnDaoResponse.sMessage,'',genericaTablaCnDaoResponse.iCode);	
		}
		
		//2. obtenemos informacion de la tabla a modificar
		oFiltro3.iId = oParam.oData.iId; 
		var tablaGenericaResponse = genericaTablaCnDao.consultarTabla(oFiltro3);
		if(tablaGenericaResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(tablaGenericaResponse.sMessage,'',tablaGenericaResponse.iCode);	
		}
		//3. Actualizamos la tabla
		oParam.oData.sCodigoTablaAnterior=tablaGenericaResponse.oData[0].CodigoTabla;
		oFiltro2.oAuditRequest  =  oParam.oAuditRequest;
		oFiltro2.oData = oParam.oData;
		var genericaTablaTxDaoResponse = genericaTablaTxDao.actualizarTabla(oFiltro2);
		if(genericaTablaTxDaoResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(genericaTablaTxDaoResponse.sMessage,'',genericaTablaTxDaoResponse.iCode);			
		}
		
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
	} finally {
		try{
			var oRequest = {};
			oRequest.oAuditRequest = oParam.oAuditRequest;
			oRequest.sNombreProceso = "ActualizarTablaGenerica";
			oRequest.iProcesoPrincipal = 1;
			oRequest.iProcesoOrden = 0;
			oRequest.iTiempoProceso = ((new Date().getTime()) - tiempo);
			oRequest.sEntradaProceso = JSON.stringify(oParam.oData);
			oRequest.sRespuestaProceso = JSON.stringify(oResponse);
			oRequest.sMetadata = "";
			oRequest.sEstado = (oResponse.iCode === 1) ? "OK" : "ERROR";
			serviceClientAuditoria.registrarAuditoria(oRequest);
		} finally {
			
		}
	}
	return oResponse;
}


/**
 * @description Función que permite eliminar una tabla generica  
 * @creation David Villanueva 22/01/2018
 * @update
 */
function eliminarTablaGenerica(oParam){
	
	var tiempo=0;
	var oFiltro ={};
	oFiltro.oData = {};
	try {
		tiempo = new Date().getTime();
		//1. Eliminamos  la tabla
		oFiltro.oAuditRequest = oParam.oAuditRequest;
		oFiltro.oData.iIdEstado = parseInt(config.getText("id.estado.eliminado"), 10);
		oFiltro.oData.sCodigoTabla = oParam.oData.sCodigoTabla;
		
		var genericaTablaTxDaoResponse = genericaTablaTxDao.eliminarTabla(oFiltro);
		if(genericaTablaTxDaoResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(genericaTablaTxDaoResponse.sMessage,'',genericaTablaTxDaoResponse.iCode);			
		}
		
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
	}finally {
		try{
			var oRequest = {};
			oRequest.oAuditRequest = oParam.oAuditRequest;
			oRequest.sNombreProceso = "EliminarTablaGenerica";
			oRequest.iProcesoPrincipal = 1;
			oRequest.iProcesoOrden = 0;
			oRequest.iTiempoProceso = ((new Date().getTime()) - tiempo);
			oRequest.sEntradaProceso = JSON.stringify(oParam.oData);
			oRequest.sRespuestaProceso = JSON.stringify(oResponse);
			oRequest.sMetadata = "";
			oRequest.sEstado = (oResponse.iCode === 1) ? "OK" : "ERROR";
			serviceClientAuditoria.registrarAuditoria(oRequest);
		} finally {
			
		}
	}
	return oResponse;
}