var textAccess 				= $.import("sap.hana.xs.i18n","text");
var config 					= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 					= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 					= $.import("MitsuiCitasPrd.Utils","Utils");
var genericaCampoCnDao 		= $.import("MitsuiCitasPrd.Dao.Generica","GenericaCampoCnDao");
var genericaCampoTxDao 		= $.import("MitsuiCitasPrd.Dao.Generica","GenericaCampoTxDao");
var serviceClientAuditoria 	= $.import("MitsuiCitasPrd.ServiceClient.Auditoria","Auditoria");
var oResponse				= {};

/**
 * @description Función que permite registrar campos generica  
 * @creation David Villanueva 22/01/2018
 * @update
 */
function registrarCampoGenerica(oParam){
	
	var oFiltro 	= {};
	var oFiltro2 	= {};
	oFiltro2.oData 	= {};
	var tiempo		= 0;
	try {
		tiempo 								= new Date().getTime();
		
		//1. Consultamos si no existe otra campo con el mismo nombre
		oFiltro.sCodigoTabla 				= oParam.oData.aItems[0].sCodigoTabla;
		oFiltro.sCampo 						= oParam.oData.aItems[0].sCampo;
		var genericaCampoCnDaoResponse 		= genericaCampoCnDao.consultarCampo(oFiltro);
		if(genericaCampoCnDaoResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(bundle.getText("msj.idf7"),'',parseInt(bundle.getText("code.idf7"), 10));	
		}

		if(genericaCampoCnDaoResponse.iCode === parseInt(bundle.getText("code.idt1"), 10)){
			throw new TypeError(genericaCampoCnDaoResponse.sMessage,'',genericaCampoCnDaoResponse.iCode);	
		}
		
		//2. Registramos el campo
		oFiltro2.oAuditRequest = oParam.oAuditRequest;
		
		oParam.oData.aItems.forEach(function(e){
			e.iIdEstado = parseInt(config.getText("id.estado.activo"), 10);
			e.sFuente 	= "SCP";
			e.sTipo 	= "C";
		});
		
		oFiltro2.oData.aItems 				= oParam.oData.aItems;
		var genericaCampoTxDaoResponse 		= genericaCampoTxDao.registrarCampo(oFiltro2);
		if(genericaCampoTxDaoResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(genericaCampoTxDaoResponse.sMessage,'',genericaCampoTxDaoResponse.iCode);			
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
			oRequest.sNombreProceso 	= "RegistrarCampoGenerica";
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
 * @description Función que permite actualizar un campo generico  
 * @creation David Villanueva 24/01/2018
 * @update
 */
function actualizarCampoGenerica(oParam){
	
	var tiempo		= 0;
	var oFiltro 	= {};
	var oFiltro2 	= {};
	oFiltro2.oData 	= {};
	try {
		tiempo 								= new Date().getTime();
		
		//1. Consultamos si no existe otro campo con el mismo nombre
		oFiltro.sCodigoTabla 				= oParam.oData.aItems[0].sCodigoTabla;
		oFiltro.sCampo 						= oParam.oData.aItems[0].sCampo;
		oFiltro.iNotId 						= oParam.oData.aItems[0].iId;
		var genericaCampoCnDaoResponse 		= genericaCampoCnDao.consultarCampo(oFiltro);
		if(genericaCampoCnDaoResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(bundle.getText("msj.idf7"),'',parseInt(bundle.getText("code.idf7"), 10));	
		}
		if(genericaCampoCnDaoResponse.iCode === parseInt(bundle.getText("code.idt1"), 10)){
			throw new TypeError(genericaCampoCnDaoResponse.sMessage,'',genericaCampoCnDaoResponse.iCode);	
		}
		//3. Actualizamos el campo
		oFiltro2.oAuditRequest  =  oParam.oAuditRequest;
		oParam.oData.aItems.forEach(function(e){
			e.sFuente = "SCP";
		});
		oFiltro2.oData 							= oParam.oData;
		var ggenericaCampoTxDaoResponse 		= genericaCampoTxDao.actualizarCampo(oFiltro2);
		if(ggenericaCampoTxDaoResponse.iCode 	!== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(ggenericaCampoTxDaoResponse.sMessage,'',ggenericaCampoTxDaoResponse.iCode);			
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
	} finally {
		try{
			var oRequest 				= {};
			oRequest.oAuditRequest 		= oParam.oAuditRequest;
			oRequest.sNombreProceso 	= "actualizarCampoGenerica";
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
 * @description Función que permite eliminar una campo generico  
 * @creation David Villanueva 24/01/2018
 * @update
 */
function eliminarCampoGenerica(oParam){
	
	var tiempo		= 0;
	var oFiltro 	= {};
	oFiltro.oData 	= {};
	try {
		tiempo		= new Date().getTime();
		
		//1. Eliminamos  la tabla
		oFiltro.oAuditRequest	 			= oParam.oAuditRequest;
		oParam.oData.aItems.forEach(function(e){
			e.iIdEstado = parseInt(config.getText("id.estado.eliminado"), 10);
		});
		oFiltro.oData 				   		= oParam.oData;
		var genericaCampoTxDaoResponse 		= genericaCampoTxDao.eliminarCampo(oFiltro);
		if(genericaCampoTxDaoResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(genericaCampoTxDaoResponse.sMessage,'',genericaCampoTxDaoResponse.iCode);			
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
	}finally {
		try{
			var oRequest 				= {};
			oRequest.oAuditRequest 		= oParam.oAuditRequest;
			oRequest.sNombreProceso 	= "eliminarCampoGenerica";
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
