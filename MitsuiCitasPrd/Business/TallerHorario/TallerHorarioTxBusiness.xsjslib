var textAccess 					= $.import("sap.hana.xs.i18n","text");
var config 						= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var tallerCnDao 				= $.import("MitsuiCitasPrd.Dao.Taller","TallerCnDao");
var tallerHorarioTxDao 			= $.import("MitsuiCitasPrd.Dao.Taller","TallerHorarioTxDao");
var serviceClientCalendario		= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.CalendarioTaller","CalendarioTaller");
var serviceClientCalendarioExc	= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.CalendarioTallerExcepcion","CalendarioTallerEx");
var serviceClientAuditoria 		= $.import("MitsuiCitasPrd.ServiceClient.Auditoria","Auditoria");
var oResponse					= {};

/**
 * @description Función que permite registrar el horario del talle
 * @creation David Villanueva 17/09/2018
 * @update
 */
function registrarTallerHorario(oParam){
	
	var oFiltro2 		= {};
	var tiempo			= 0;
	oFiltro2.oData 		= {};
	try {
		tiempo = new Date().getTime();

		// 1. Consultamos los talleres
		var oParamTaller 		= {};
		oParamTaller.iIdEstado	= 23;
		var consultarTallerxFiltroResponse  = tallerCnDao.consultarTallerxFiltro(oParamTaller);
		if(consultarTallerxFiltroResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarTallerxFiltroResponse.sMessage,'',parseInt(consultarTallerxFiltroResponse.iCode,10));			
		}
		
		//1.1 Eliminamos todos los datos actuales
		var oParamElimHorario 						= {};
		oParamElimHorario.oAuditRequest 			= oParam.oAuditRequest;
		oParamElimHorario.oData 					= {};
		oParamElimHorario.oData.iIdEstado 			= 25;
		var eliminarMasivoTallerHorarioResponse =  tallerHorarioTxDao.eliminarMasivoTallerHorario(oParamElimHorario);
		if(eliminarMasivoTallerHorarioResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(eliminarMasivoTallerHorarioResponse.sMessage,'',parseInt(eliminarMasivoTallerHorarioResponse.iCode,10));			
		}
		
		for (var i = 0; i < consultarTallerxFiltroResponse.oData.length; i++) {
			var oTaller = consultarTallerxFiltroResponse.oData[i];
			// 1. Buscamos el calendario por taller
			var oParamCalendario 			= {};
			oParamCalendario.sCodigoCentro 	= oTaller.sCentroSap;
			var consultarCalendarioTallerC4cResponse = serviceClientCalendario.consultarCalendarioTallerC4c(oParamCalendario);
			if(consultarCalendarioTallerC4cResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
				throw new TypeError(consultarCalendarioTallerC4cResponse.sMessage,'',consultarCalendarioTallerC4cResponse.iCode);
			}
			// 2. Buscamos el calendario de excepciones por taller
			var oParamEx 			= {};
			oParamEx.sCodigoCentro 	= oTaller.sCentroSap;
			var listExcepciones 	= [];
			var consultarCalendarioTallerExcC4cResponse = serviceClientCalendarioExc.consultarCalendarioTallerExcC4c(oParamEx);
			if(consultarCalendarioTallerC4cResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
				throw new TypeError(consultarCalendarioTallerExcC4cResponse.sMessage,'',consultarCalendarioTallerExcC4cResponse.iCode);
			}
			if(consultarCalendarioTallerExcC4cResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
				listExcepciones = consultarCalendarioTallerExcC4cResponse.oData.BOCitasPorLocalExcepcion;
			}
			// 3. recorreremos la lista del calendario obtenido de C4C
			for (var k = 0; k < consultarCalendarioTallerC4cResponse.oData.BOCitasPorLocal.length; k++) {
				  var hora = consultarCalendarioTallerC4cResponse.oData.BOCitasPorLocal[k].zHoraInicio;
				  var tope = parseInt(consultarCalendarioTallerC4cResponse.oData.BOCitasPorLocal[k].zTope,10);
				  var fechaInicio 	= consultarCalendarioTallerC4cResponse.oData.BOCitasPorLocal[k].zFechaInicioValidez;
				  var fechaFin 		= consultarCalendarioTallerC4cResponse.oData.BOCitasPorLocal[k].zFechaFinValidez;
				  // 4. buscamos si existen excepciones en la fecha
				  for(var j = 0; j < listExcepciones.length; j++){
					   fechaInicio = listExcepciones[j].zFechaInicioValidez;
					   fechaFin = listExcepciones[j].zFechaFinValidez;
					  var horaInicio = listExcepciones[j].zHoraInicio.substring(0,5);
					  var nuevoTope = parseInt(utils.convertEmptyToZero(listExcepciones[j].zTope),10);
					  if(hora === horaInicio){
						  tope =  nuevoTope;
					  }
				  }
				  
				// 5. Registramos el horario del taller
					var oParamHorario 						= {};
					oParamHorario.oAuditRequest 			= oParam.oAuditRequest;
					oParamHorario.oData 					= {};
					oParamHorario.oData.iIdEstado 			= parseInt(config.getText("id.estado.activo"), 10);
					oParamHorario.oData.sCodTaller 			= oTaller.sCentroSap;
					oParamHorario.oData.iNumDia 			= parseInt(consultarCalendarioTallerC4cResponse.oData.BOCitasPorLocal[k].zDia,10);
					oParamHorario.oData.sHora 				= (hora === "")? "" : hora.substring(0,5);
					oParamHorario.oData.iDisponible 		= tope;
					oParamHorario.oData.sFechaInicioValidez = fechaInicio;
					oParamHorario.oData.sFechaFinValidez 	= fechaFin;
					
					var registrarTallerHorarioResponse 		= tallerHorarioTxDao.registrarTallerHorario(oParamHorario);
					if(registrarTallerHorarioResponse.iCode === parseInt(bundle.getText("code.idt11"), 10)){
						//6. Actualizamos el horario del taller
						oParamHorario.oData.iIdEstado		= parseInt(config.getText("id.estado.activo"), 10);
						var actualizarTallerHorarioResponse = tallerHorarioTxDao.actualizarTallerHorario(oParamHorario);
						if(actualizarTallerHorarioResponse.iCode === parseInt(bundle.getText("code.idt1"), 10)){
							throw new TypeError(actualizarTallerHorarioResponse.sMessage,'',parseInt(actualizarTallerHorarioResponse.iCode,10));			
						}
					}
					
					if(registrarTallerHorarioResponse.iCode === parseInt(bundle.getText("code.idt1"), 10)){
						throw new TypeError(registrarTallerHorarioResponse.sMessage,'',parseInt(registrarTallerHorarioResponse.iCode,10));			
					}
					
			}
			
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
			oRequest.sNombreProceso 	= "RegistrarTallerHorario";
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
 * @description Función que permite registrar varios talleres
 * @creation David Villanueva 31/07/2018
 * @update
 */
function registrarTallerMasivo(oParam){
	
	var oFiltro2 	= {};
	oFiltro2.oData 	= {};
	var tiempo		= 0;
	try {
		tiempo 								= new Date().getTime();
		
		// 1. Registramos la lista de talleres
		var registrarTallerMasivoResponse 		= tallerTxDao.registrarTallerMasivo(oParam);
		if(registrarTallerMasivoResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(registrarTallerMasivoResponse.sMessage,'',registrarTallerMasivoResponse.iCode);			
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
			oRequest.sNombreProceso 	= "RegistrarTallerMasivo";
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
 * @description Función que permite actualizar un taller
 * @creation David Villanueva 31/07/2018
 * @update
 */
function actualizarTaller(oParam){
	
	var tiempo	= 0;
	var oFiltro = {};
	try {
		tiempo 	= new Date().getTime();
		// 1. Actualizamos un taller
		oFiltro.oAuditRequest  	= oParam.oAuditRequest;
		oFiltro.oData 			= oParam.oData;
		var actualizarNoticiaExternaResponse 		= tallerTxDao.actualizarTaller(oFiltro);
		if(actualizarNoticiaExternaResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(actualizarNoticiaExternaResponse.sMessage,'',actualizarNoticiaExternaResponse.iCode);
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
			oRequest.sNombreProceso 	= "ActualizarTaller";
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
 * @description Función que permite eliminar uno o varios Talleres
 * @creation David Villanueva 31/07/2018
 * @update
 */
function eliminarTaller(oParam){
	
	var tiempo		= 0;
	var oFiltro 	= {};
	oFiltro.oData 	= {};
	try {
		tiempo 				= new Date().getTime();
		
		// 1. Eliminamos un taller
		oFiltro.oAuditRequest = oParam.oAuditRequest;
		oParam.oData.aItems.forEach(function(e){
			e.iIdEstado = parseInt(config.getText("id.estado.eliminado"), 10);
		});
		oFiltro.oData 						= oParam.oData;
		var eliminarTallerResponse 		= tallerTxDao.eliminarTaller(oFiltro);
		if(eliminarTallerResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(eliminarTallerResponse.sMessage,'',eliminarTallerResponse.iCode);			
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
			oRequest.sNombreProceso 	= "EliminarTaller";
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
