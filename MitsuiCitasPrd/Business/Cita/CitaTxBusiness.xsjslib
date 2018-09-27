var textAccess 					= $.import("sap.hana.xs.i18n","text");
var config 						= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var citaTxDao 					= $.import("MitsuiCitasPrd.Dao.Cita","CitaTxDao");
var serviceClientCita			= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.CrearCita","CrearCita");
var serviceClientCitaEliminar	= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.ActualizarCita","ActualizarEstadoCita");
var genericaCampoCnDao 			= $.import("MitsuiCitasPrd.Dao.Generica","GenericaCampoCnDao");
var citaCnDao 					= $.import("MitsuiCitasPrd.Dao.Cita","CitaCnDao");
var serviceClientAuditoria 		= $.import("MitsuiCitasPrd.ServiceClient.Auditoria","Auditoria");
var oResponse					= {};

/**
 * @description Función que permite registrar una cita para un cliente y auto
 *              existente en C4C
 * @creation David Villanueva 02/09/2018
 * @update
 */
function registrarCitaClienteAutoExiste(oParam){
	
	var tiempo				= 0;
	var respuestaServicio 	= [];
	var iTiempoServidor		= 5;
	try {
		tiempo = new Date().getTime();
		
		// 1. consultamos el participante del centro
		var sCodParticipante 			= '';
		var oFiltroTabla 				= {};
		oFiltroTabla.iIdEstado 			= parseInt(config.getText("id.estado.activo"), 10);
		oFiltroTabla.sCodigoTabla 		= 'participantes_centro';
		oFiltroTabla.sDescripcion 		= oParam.oData.sCodTaller;
		var consultarParticipantesResponse = genericaCampoCnDao.consultarCampoxTabla(oFiltroTabla);
		if(consultarParticipantesResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
			sCodParticipante = consultarParticipantesResponse.oData[0].sCodigoSap;
		}
		
		// 2. consultamos los datos generales
		var aListDatos						= [];
		var oFiltroDatosGenerales			= {};
		oFiltroDatosGenerales.iIdEstado 	= parseInt(config.getText("id.estado.activo"), 10);
		oFiltroDatosGenerales.sCodigoTabla 	= 'datos_generales_citas';
		var consultarDatosGeneralesResponse = genericaCampoCnDao.consultarCampoxTabla(oFiltroDatosGenerales);
		if(consultarDatosGeneralesResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
			aListDatos = consultarDatosGeneralesResponse.oData;
		}
		var iDuracionExpress 	= 0;
		var iDuracionCita	 	= 0;
		for (var i = 0; i < aListDatos.length; i++) {
			if(aListDatos[i].sCampo === 'hora_duracion_cita'){
				iDuracionCita = parseInt(aListDatos[i].sCodigoSap, 10);
			}
			if(aListDatos[i].sCampo === 'hora_duracion_express'){
				iDuracionExpress = parseInt(aListDatos[i].sCodigoSap, 10);
			}
			if(aListDatos[i].sCampo === 'cod_cliente_comodin'){
				oParam.oData.sIdClienteC4c = (oParam.oData.bClienteComodin) ? aListDatos[i].sCodigoSap : oParam.oData.sIdClienteC4c;
			}
		}
		
		var iDuracionCita = (oParam.oData.bExpress===true) ? iDuracionExpress : iDuracionCita
		// 3. Registramos la cita en C4C

		var oParamCrearCita 				= {};
		var FechaInicio  					= new Date(oParam.oData.sFechaCita+"T"+oParam.oData.sHoraCita);
		FechaInicio.setHours(FechaInicio.getHours() + iTiempoServidor);
		var FechaFin 						= new Date(oParam.oData.sFechaCita+"T"+oParam.oData.sHoraCita);
		FechaFin.setHours(FechaFin.getHours() + iTiempoServidor + iDuracionCita);
		var FechaFinSinTiempoServidor 		= new Date(oParam.oData.sFechaCita+"T"+oParam.oData.sHoraCita);
		FechaFinSinTiempoServidor.setHours(FechaFinSinTiempoServidor.getHours() + iDuracionCita);
		oParamCrearCita.bClienteComodin 	= oParam.oData.bClienteComodin;
		oParamCrearCita.sNomClienteComodin	= oParam.oData.sNomClienteComodin;
		oParamCrearCita.iIdClienteC4c		= oParam.oData.sIdClienteC4c;
		oParamCrearCita.iIdParticipante 	= sCodParticipante;
		oParamCrearCita.dFechaInicio		= utils.formatDate(FechaInicio, "yyyy-mm-ddTh:m:sZ");
		oParamCrearCita.dFechaFin 	   		= utils.formatDate(FechaFin, "yyyy-mm-ddTh:m:sZ");
		oParamCrearCita.sObservacion   		= oParam.oData.sObservacion;
		oParamCrearCita.sFechaSalida   		= utils.formatDate(FechaFinSinTiempoServidor, "yyyy-mm-ddTh:m:s").substr(0,10);
		oParamCrearCita.sHoraSalida			= utils.formatDate(FechaFinSinTiempoServidor, "yyyy-mm-ddTh:m:s").substr(-8,8);
		oParamCrearCita.sCodTaller     		= oParam.oData.sCodTaller;
		oParamCrearCita.sPlaca 		   		= oParam.oData.sPlaca;
		oParamCrearCita.bExpress 	   		= oParam.oData.bExpress;
		oParamCrearCita.bActualizarCita	    = oParam.oData.bActualizarCita;
		oParamCrearCita.sIdCitaC4c			= oParam.oData.sIdCitaC4c;
		var crearCitaC4cResponse 	 		= serviceClientCita.crearCitaC4c(oParamCrearCita);
		if(crearCitaC4cResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(crearCitaC4cResponse.sMessage,'',crearCitaC4cResponse.iCode);			
		}

		// 4. Registramos la cita en la BD
		var oRespuestaHana 	= [];
		var   oFiltro2 		= {};
		oFiltro2.oAuditRequest 			= oParam.oAuditRequest;
		oFiltro2.oData 					= oParam.oData;
		oFiltro2.oData.iIdEstado 		= parseInt(config.getText("id.estado.activo"), 10);
		oFiltro2.oData.iIdEstadoCita 	= parseInt(config.getText("id.estado.cita.generada"), 10);
		oFiltro2.oData.sIdCitaC4c		= crearCitaC4cResponse.oData.AppointmentActivity.UUID;
		oFiltro2.oData.iIdCita			= crearCitaC4cResponse.oData.AppointmentActivity.ID;
		oFiltro2.oData.sPaquete			= oParam.oData.sCodPaquete;
		oFiltro2.oData.iExpress			= (oParam.oData.bExpress === true) ? 1 : 0;
		oFiltro2.oData.iClienteComodin	= (oParam.oData.bClienteComodin === true) ? 1 : 0;
		
		var registrarCitaResponse 		= citaTxDao.registrarCita(oFiltro2);
		if(registrarCitaResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			oRespuestaHana.push({
				"Servicio" 	: "registrarCitaHana",
				"Code"		: registrarCitaResponse.iCode,
				"Mensaje"	: registrarCitaResponse.sMessage,
				"Request"	: oFiltro2
			});
		}
		
		oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage 	= bundle.getText("msj.idf1");
		oResponse.oData 	= crearCitaC4cResponse.oData;
		
	}catch(e){
		if (e instanceof TypeError) {
			oResponse.iCode 	= e.lineNumber;
			oResponse.sMessage 	= e.message;
		}else{
			oResponse.iCode 	= parseInt(bundle.getText("code.idt2"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt2",[e.toString()]);
		}	
	}
	return oResponse;
}

/**
 * @description Función que permite registrar una cita
 * @creation David Villanueva 02/09/2018
 * @update
 */
function registrarCita(oParam){
	
	var tiempo			= 0;
	try {
		tiempo = new Date().getTime();
		oParam.oData.bClienteComodin 	= false;
		oParam.oData.bActualizarCita 	= false;
		oParam.oData.bConsultarPaquete 	= true;
		oParam.oData.iExistePaquete		= 1;
		// 01: Mantenimiento Periodico, 02:Diagnostico, 03:Campañas /// 1 :
		// Vehiculo no existe, 0: Vehiculo existe
		
		// 1. Escenario cuando existe cliente y auto registrado en C4C y elige
		// el mantenimiento periodico
		if(oParam.oData.sCodigoTipoServicio === '01' && oParam.oData.iVehiculoNuevo === 0){
			var sModelo 				= '00'+ oParam.oData.sIdModelo;
			var sCodPaquete				= 'M' + sModelo.substr(-4,4) + '-'+ oParam.oData.sCodigoServicioRealizar;
			oParam.oData.sCodPaquete	= sCodPaquete;
			var registrarCitaClienteAutoExisteResponse = registrarCitaClienteAutoExiste(oParam);
			if(registrarCitaClienteAutoExisteResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
				throw new TypeError(registrarCitaClienteAutoExisteResponse.sMessage,'',registrarCitaClienteAutoExisteResponse.iCode);	
			}
		}
		
		// 2. Escenario cuando existe el auto y elige el mantenimiento
		// diagnostico
		if(oParam.oData.sCodigoTipoServicio === '02' && oParam.oData.iVehiculoNuevo === 0){
			oParam.oData.iExistePaquete		= 	0;
			var registrarCitaClienteAutoExisteResponse = registrarCitaClienteAutoExiste(oParam);
			if(registrarCitaClienteAutoExisteResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
				throw new TypeError(registrarCitaClienteAutoExisteResponse.sMessage,'',registrarCitaClienteAutoExisteResponse.iCode);	
			}
		}
		
		// 3. Escenario cuando existe el auto y elige el mantenimiento campaña
		if(oParam.oData.sCodigoTipoServicio === '03' && oParam.oData.iVehiculoNuevo === 0){
			if(oParam.oData.sCodigoServicioRealizar.substr(0,1) === 'P'){
				var sModelo 							= '00'+ oParam.oData.sIdModelo;
				var sCodPaquete							= 'M' + sModelo.substr(-4,4) + '-'+ oParam.oData.sCodigoServicioRealizar.substr(2,8);
				oParam.oData.sCodPaquete				= sCodPaquete;
			}
			if(oParam.oData.sCodigoServicioRealizar.substr(0,1) === 'M'){
				oParam.oData.bConsultarPaquete 	= 	false;
				oParam.oData.iExistePaquete		= 	0;
				var sModelo 					=   '00'+ oParam.oData.sIdModelo;
				var sCodPaquete					= 	oParam.oData.sCodigoServicioRealizar.substr(2,20);
				oParam.oData.sCodPaquete		=  	sCodPaquete;
			}
			
			var registrarCitaClienteAutoExisteResponse = registrarCitaClienteAutoExiste(oParam);
			if(registrarCitaClienteAutoExisteResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
				throw new TypeError(registrarCitaClienteAutoExisteResponse.sMessage,'',registrarCitaClienteAutoExisteResponse.iCode);	
			}
		}
		
		// 4. Escenario cuando no existe el auto y no selecciona tipo de
		// servicio
		if(oParam.oData.sCodigoTipoServicio === null && oParam.oData.iVehiculoNuevo === 1){
			oParam.oData.bClienteComodin 	= true;
			oParam.oData.iExistePaquete		= 	0;
			oParam.oData.sNomClienteComodin = oParam.oData.sNombre +" " + oParam.oData.sApellido;
			var registrarCitaClienteAutoExisteResponse = registrarCitaClienteAutoExiste(oParam);
			if(registrarCitaClienteAutoExisteResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
				throw new TypeError(registrarCitaClienteAutoExisteResponse.sMessage,'',registrarCitaClienteAutoExisteResponse.iCode);	
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
			oRequest.sNombreProceso 	= "RegistrarCita";
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
 * @description Función que permite actualizar una cita
 * @creation David Villanueva 02/09/2018
 * @update
 */
function actualizarCita(oParam){
	
	var tiempo	= 0;
	
	try {
		tiempo 	= new Date().getTime();
		
		// 1 Actualizamos la cita a estado diferido en C4C
		var oParamEstadoCita 			= {};
		oParamEstadoCita.sIdCita 		= oParam.oData.sIdCitaC4c;
		oParamEstadoCita.iIdEstadoCita	= 4;	
		var actualizarEstadoCitaC4cResponse = serviceClientCitaEliminar.actualizarEstadoCitaC4c(oParamEstadoCita);
		if(actualizarEstadoCitaC4cResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(actualizarEstadoCitaC4cResponse.sMessage,'',actualizarEstadoCitaC4cResponse.iCode);			
		}
		
		// 2. Eliminamos la cita en HANA
		var oParamCita 				= {};
		oParamCita.oAuditRequest 	= oParam.oAuditRequest;
		oParamCita.oData			= {};
		oParamCita.oData.aItems		= [];
		oParamCita.oData.aItems.push({
			"iIdEstado" 	: parseInt(config.getText("id.estado.eliminado"), 10),
			"sIdCitaC4c" 	: oParam.oData.sIdCitaC4c
		});
		var eliminarCitaResponse 		= citaTxDao.eliminarCita(oParamCita);
		if(eliminarCitaResponse.iCode === parseInt(bundle.getText("code.idt1"), 10)){
			// throw new
			// TypeError(eliminarCitaResponse.sMessage,'',eliminarCitaResponse.iCode);
		}

		// 3. Creamos una nueva cita con referencia
		oParam.oData.bClienteComodin 		= false;
		oParam.oData.bActualizarCita 		= true;
		oParam.oData.sIdCitaC4cReferencia   = oParam.oData.sIdCitaC4c;
		oParam.oData.sIdCitaReferencia      = oParam.oData.iId;
		oParam.oData.iCitaReprogramada      = 1;
		oParam.oData.iExistePaquete			= 1;
		// 1. Escenario cuando existe cliente y auto registrado en C4C y elige
		// el mantenimiento periodico
		if(oParam.oData.sCodigoTipoServicio === '01' && oParam.oData.iVehiculoNuevo === 0){
			var sModelo 				= '00'+ oParam.oData.sIdModelo;
			var sCodPaquete				= 'M' + sModelo.substr(-4,4) + '-'+ oParam.oData.sCodigoServicioRealizar;
			oParam.oData.sCodPaquete	= sCodPaquete;
			var registrarCitaClienteAutoExisteResponse = registrarCitaClienteAutoExiste(oParam);
			if(registrarCitaClienteAutoExisteResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
				throw new TypeError(registrarCitaClienteAutoExisteResponse.sMessage,'',registrarCitaClienteAutoExisteResponse.iCode);	
			}
		}
		
		// 2. Escenario cuando existe el auto y elige el mantenimiento
		// diagnostico
		if(oParam.oData.sCodigoTipoServicio === '02' && oParam.oData.iVehiculoNuevo === 0){
			oParam.oData.iExistePaquete		= 	0;
			var registrarCitaClienteAutoExisteResponse = registrarCitaClienteAutoExiste(oParam);
			if(registrarCitaClienteAutoExisteResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
				throw new TypeError(registrarCitaClienteAutoExisteResponse.sMessage,'',registrarCitaClienteAutoExisteResponse.iCode);	
			}
		}
		
		// 3. Escenario cuando existe el auto y elige el mantenimiento campaña
		if(oParam.oData.sCodigoTipoServicio === '03' && oParam.oData.iVehiculoNuevo === 0){
			if(oParam.oData.sCodigoServicioRealizar.substr(0,1) === 'P'){
				var sModelo 							= '00'+ oParam.oData.sIdModelo;
				var sCodPaquete							= 'M' + sModelo.substr(-4,4) + '-'+ oParam.oData.sCodigoServicioRealizar.substr(2,8);
				oParam.oData.sCodPaquete				= sCodPaquete;
			}
			if(oParam.oData.sCodigoServicioRealizar.substr(0,1) === 'M'){
				oParam.oData.bConsultarPaquete 	= 	false;
				oParam.oData.iExistePaquete		= 	0;
				var sModelo 					=   '00'+ oParam.oData.sIdModelo;
				var sCodPaquete					= 	oParam.oData.sCodigoServicioRealizar.substr(2,8);
				oParam.oData.sCodPaquete		=  	sCodPaquete;
			}
			
			var registrarCitaClienteAutoExisteResponse = registrarCitaClienteAutoExiste(oParam);
			if(registrarCitaClienteAutoExisteResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
				throw new TypeError(registrarCitaClienteAutoExisteResponse.sMessage,'',registrarCitaClienteAutoExisteResponse.iCode);	
			}
		}
		
//		var registrarCitaClienteAutoExisteResponse = registrarCitaClienteAutoExiste(oParam);
//		if(registrarCitaClienteAutoExisteResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
//			throw new TypeError(registrarCitaClienteAutoExisteResponse.sMessage,'',registrarCitaClienteAutoExisteResponse.iCode);	
//		}
		oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage 	= bundle.getText("msj.idf1");
		oResponse.oData 	= registrarCitaClienteAutoExisteResponse.oData;
		
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
			oRequest.sNombreProceso 	= "ActualizarCita";
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
 * @description Función que permite eliminar cita
 * @creation David Villanueva 02/09/2018
 * @update
 */
function eliminarCita(oParam){
	
	var tiempo		= 0;
	var oFiltro 	= {};
	oFiltro.oData 	= {};
	try {
		tiempo 				= new Date().getTime();
		
		// 1. Eliminamos la cita en C4C
		var oParamEliminarCita 	= {};
		oParamEliminarCita.sIdCita 			= oParam.oData.aItems[0].sIdCitaC4c;
		oParamEliminarCita.iIdEstadoCita	= 6;	
		var actualizarEstadoCitaC4cResponse = serviceClientCitaEliminar.actualizarEstadoCitaC4c(oParamEliminarCita);
		if(actualizarEstadoCitaC4cResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(actualizarEstadoCitaC4cResponse.sMessage,'',actualizarEstadoCitaC4cResponse.iCode);			
		}
		
		// 2. Eliminamos la cita en Hana
		oFiltro.oAuditRequest = oParam.oAuditRequest;
		oParam.oData.aItems.forEach(function(e){
			e.iIdEstado = parseInt(config.getText("id.estado.eliminado"), 10);
		});
		oFiltro.oData 					= oParam.oData;
		var eliminarCitaResponse 		= citaTxDao.eliminarCita(oFiltro);
		if(eliminarCitaResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			// throw new
			// TypeError(eliminarCitaResponse.sMessage,'',eliminarCitaResponse.iCode);
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
			oRequest.sNombreProceso 	= "EliminarCita";
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
