/* tslint:disable:no-empty */
var textAccess 				= $.import("sap.hana.xs.i18n","text");
var config 					= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 					= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 					= $.import("MitsuiCitasPrd.Utils","Utils");
var noticiaInternaCnDao		= $.import("MitsuiCitasPrd.Dao.NoticiaInterna","NoticiaInternaCnDao");
var noticiaInternaTxDao		= $.import("MitsuiCitasPrd.Dao.NoticiaInterna","NoticiaInternaTxDao");
var noticiaExternaCnDao		= $.import("MitsuiCitasPrd.Dao.NoticiaExterna","NoticiaExternaCnDao");
var noticiaExternaTxDao		= $.import("MitsuiCitasPrd.Dao.NoticiaExterna","NoticiaExternaTxDao");
var beneficioCnDao			= $.import("MitsuiCitasPrd.Dao.Beneficio","BeneficioCnDao");
var beneficioTxDao			= $.import("MitsuiCitasPrd.Dao.Beneficio","BeneficioTxDao");
var eventoCnDao				= $.import("MitsuiCitasPrd.Dao.Evento","EventoCnDao");
var eventoTxDao				= $.import("MitsuiCitasPrd.Dao.Evento","EventoTxDao");
var serviceClientAuditoria 	= $.import("MitsuiCitasPrd.ServiceClient.Auditoria","Auditoria");

var oResponse				= {};

/**
 * @description Función que permite activar noticias internas, noticias externas, beneficios y eventos
 * @creation David Villanueva 05/09/2018
 * @update
 */
function bathActivacion(oParam){
	
	var tiempo=0;
	try {
		tiempo = new Date().getTime();
//		//1. Buscamos las noticias internas 
		var oFiltro = {};
		var consultarNoticiaInternaxFiltroResponse = noticiaInternaCnDao.consultarNoticiaInternaxFiltro(oFiltro);
		if(consultarNoticiaInternaxFiltroResponse.iCode === parseInt(bundle.getText("code.idt1"), 10)){
			throw new TypeError(consultarNoticiaInternaxFiltroResponse.sMessage,'',consultarNoticiaInternaxFiltroResponse.iCode);
		}
		
		var FechaServidor = new Date();
		FechaServidor.setHours(FechaServidor.getHours() + parseInt(config.getText("horas.adelantado.servidor"), 10));
		var FechaServidorString = utils.formatDate(FechaServidor, "yyyy-mm-dd");
		
		var fechaPublicacion 		= null;
		var fechaPublicacionString 	= "";
		var fechaExpiracion 		= null;
		var fechaExpiracionString 	= "";
		for (var i = 0; i < consultarNoticiaInternaxFiltroResponse.oData.length; i++) {
			fechaPublicacion = consultarNoticiaInternaxFiltroResponse.oData[i].dFechaPublicacion;
			//1.1 validamos que la  fecha de publicacion no sea mayor a la fecha actual y que tenga el estado bloqueado
			if(fechaPublicacion !== undefined 
					&&  fechaPublicacion !== null
						&&  fechaPublicacion !== ''
							&&  fechaPublicacion !== -1){
				//fechaPublicacion.setHours(FechaServidor.getHours() + parseInt(config.getText("horas.adelantado.servidor"), 10));
				fechaPublicacionString  = utils.formatDate(fechaPublicacion, "yyyy-mm-dd");
				
				if( utils.validarFechaIguales(new Date(FechaServidorString +'T00:00:00').getTime(), new Date(fechaPublicacionString +'T00:00:00').getTime())  
					&& consultarNoticiaInternaxFiltroResponse.oData[i].iIdEstado === parseInt(config.getText("id.estado.bloqueado"), 10)){
					//1.2. Actualizamos el estado a Activado
					var oParamActivar 				= {};
					oParamActivar.oAuditRequest 	= oParam.oAuditRequest;
					oParamActivar.oData 			= {};
					oParamActivar.oData.iIdEstado 	= parseInt(config.getText("id.estado.activo"), 10);
					oParamActivar.oData.iId		 	= consultarNoticiaInternaxFiltroResponse.oData[i].iId;
					var actualizarEstadoNoticiaInternaResponse = noticiaInternaTxDao.actualizarEstadoNoticiaInterna(oParamActivar);
					if(actualizarEstadoNoticiaInternaResponse.iCode === parseInt(bundle.getText("code.idt1"), 10)){
						throw new TypeError(actualizarEstadoNoticiaInternaResponse.sMessage,'',actualizarEstadoNoticiaInternaResponse.iCode);
					}
				}
			}
			
			//1.3 validamos que la  fecha de expiracion no sea mayor a la fecha actual y que tenga el estado activo
			fechaExpiracion = consultarNoticiaInternaxFiltroResponse.oData[i].dFechaExpiracion;
			if(fechaExpiracion !== undefined 
					&&  fechaExpiracion !== null
						&&  fechaExpiracion !== ''
							&&  fechaExpiracion !== -1){
				//fechaExpiracion.setHours(FechaServidor.getHours() + parseInt(config.getText("horas.adelantado.servidor"), 10));
				fechaExpiracionString  = utils.formatDate(fechaExpiracion, "yyyy-mm-dd");
				if( utils.validarFechaMayor(new Date(FechaServidorString +'T00:00:00').getTime(), new Date(fechaExpiracionString +'T00:00:00').getTime())  
					&& consultarNoticiaInternaxFiltroResponse.oData[i].iIdEstado === parseInt(config.getText("id.estado.activo"), 10)){
					//1.4. Actualizamos el estado a Bloqueado
					var oParamBloquear 				= {};
					oParamBloquear.oAuditRequest 	= oParam.oAuditRequest;
					oParamBloquear.oData 			= {};
					oParamBloquear.oData.iIdEstado 	= parseInt(config.getText("id.estado.bloqueado"), 10);
					oParamBloquear.oData.iId		= consultarNoticiaInternaxFiltroResponse.oData[i].iId;
					var actualizarEstadoNoticiaInternaResponse = noticiaInternaTxDao.actualizarEstadoNoticiaInterna(oParamBloquear);
					if(actualizarEstadoNoticiaInternaResponse.iCode === parseInt(bundle.getText("code.idt1"), 10)){
						throw new TypeError(actualizarEstadoNoticiaInternaResponse.sMessage,'',actualizarEstadoNoticiaInternaResponse.iCode);
					}
				}
			}
			
		}
		
		//2. Buscamos las noticias externas 
		var oFiltroNoExt = {};
		var consultarNoticiaExternaxFiltroResponse = noticiaExternaCnDao.consultarNoticiaExternaxFiltro(oFiltroNoExt);
		if(consultarNoticiaExternaxFiltroResponse.iCode === parseInt(bundle.getText("code.idt1"), 10)){
			throw new TypeError(consultarNoticiaExternaxFiltroResponse.sMessage,'',consultarNoticiaExternaxFiltroResponse.iCode);
		}
		var fechaPublicacion 		= null;
		var fechaPublicacionString 	= "";
		var fechaExpiracion 		= null;
		var fechaExpiracionString 	= "";
		for (var i = 0; i < consultarNoticiaExternaxFiltroResponse.oData.length; i++) {
			fechaPublicacion = consultarNoticiaExternaxFiltroResponse.oData[i].dFechaPublicacion;
			//2.1 validamos que la  fecha de publicacion no sea mayor a la fecha actual y que tenga el estado bloqueado
			if(fechaPublicacion !== undefined 
					&&  fechaPublicacion !== null
						&&  fechaPublicacion !== ''
							&&  fechaPublicacion !== -1){
				//fechaPublicacion.setHours(FechaServidor.getHours() + parseInt(config.getText("horas.adelantado.servidor"), 10));
				fechaPublicacionString  = utils.formatDate(fechaPublicacion, "yyyy-mm-dd");
				
				if( utils.validarFechaIguales(new Date(FechaServidorString +'T00:00:00').getTime(), new Date(fechaPublicacionString +'T00:00:00').getTime())  
					&& consultarNoticiaExternaxFiltroResponse.oData[i].iIdEstado === parseInt(config.getText("id.estado.bloqueado"), 10)){
					//2.2. Actualizamos el estado a Activado
					var oParamActivar 				= {};
					oParamActivar.oAuditRequest 	= oParam.oAuditRequest;
					oParamActivar.oData 			= {};
					oParamActivar.oData.iIdEstado 	= parseInt(config.getText("id.estado.activo"), 10);
					oParamActivar.oData.iId		 	= consultarNoticiaExternaxFiltroResponse.oData[i].iId;
					var actualizarEstadoNoticiaExternaResponse = noticiaExternaTxDao.actualizarEstadoNoticiaExterna(oParamActivar);
					if(actualizarEstadoNoticiaExternaResponse.iCode === parseInt(bundle.getText("code.idt1"), 10)){
						throw new TypeError(actualizarEstadoNoticiaExternaResponse.sMessage,'',actualizarEstadoNoticiaExternaResponse.iCode);
					}
				}
			}
			
			//2.3 validamos que la  fecha de expiracion no sea mayor a la fecha actual y que tenga el estado activo
			fechaExpiracion = consultarNoticiaExternaxFiltroResponse.oData[i].dFechaExpiracion;
			if(fechaExpiracion !== undefined 
					&&  fechaExpiracion !== null
						&&  fechaExpiracion !== ''
							&&  fechaExpiracion !== -1){
				//fechaExpiracion.setHours(FechaServidor.getHours() + parseInt(config.getText("horas.adelantado.servidor"), 10));
				fechaExpiracionString  = utils.formatDate(fechaExpiracion, "yyyy-mm-dd");
				if( utils.validarFechaMayor(new Date(FechaServidorString +'T00:00:00').getTime(), new Date(fechaExpiracionString +'T00:00:00').getTime())  
					&& consultarNoticiaExternaxFiltroResponse.oData[i].iIdEstado === parseInt(config.getText("id.estado.activo"), 10)){
					//2.4. Actualizamos el estado a Bloqueado
					var oParamBloquear 				= {};
					oParamBloquear.oAuditRequest 	= oParam.oAuditRequest;
					oParamBloquear.oData 			= {};
					oParamBloquear.oData.iIdEstado 	= parseInt(config.getText("id.estado.bloqueado"), 10);
					oParamBloquear.oData.iId		= consultarNoticiaExternaxFiltroResponse.oData[i].iId;
					var actualizarEstadoNoticiaExternaResponse = noticiaExternaTxDao.actualizarEstadoNoticiaExterna(oParamBloquear);
					if(actualizarEstadoNoticiaExternaResponse.iCode === parseInt(bundle.getText("code.idt1"), 10)){
						throw new TypeError(actualizarEstadoNoticiaExternaResponse.sMessage,'',actualizarEstadoNoticiaExternaResponse.iCode);
					}
				}
			}
			
		}
		
		
		//3. Buscamos los beneficios
		var oFiltroBenef = {};
		var consultarBeneficioxFiltro2Response = beneficioCnDao.consultarBeneficioxFiltro2(oFiltroBenef);
		if(consultarBeneficioxFiltro2Response.iCode === parseInt(bundle.getText("code.idt1"), 10)){
			throw new TypeError(consultarBeneficioxFiltro2Response.sMessage,'',consultarBeneficioxFiltro2Response.iCode);
		}
		var fechaPublicacion 		= null;
		var fechaPublicacionString 	= "";
		var fechaExpiracion 		= null;
		var fechaExpiracionString 	= "";
		for (var i = 0; i < consultarBeneficioxFiltro2Response.oData.length; i++) {
			fechaPublicacion = consultarBeneficioxFiltro2Response.oData[i].dFechaPublicacion;
			//3.1 validamos que la  fecha de publicacion no sea mayor a la fecha actual y que tenga el estado bloqueado
			if(fechaPublicacion !== undefined 
					&&  fechaPublicacion !== null
						&&  fechaPublicacion !== ''
							&&  fechaPublicacion !== -1){
				//fechaPublicacion.setHours(FechaServidor.getHours() + parseInt(config.getText("horas.adelantado.servidor"), 10));
				fechaPublicacionString  = utils.formatDate(fechaPublicacion, "yyyy-mm-dd");
				
				if( utils.validarFechaIguales(new Date(FechaServidorString +'T00:00:00').getTime(), new Date(fechaPublicacionString +'T00:00:00').getTime())  
					&& consultarBeneficioxFiltro2Response.oData[i].iIdEstado === parseInt(config.getText("id.estado.bloqueado"), 10)){
					//3.2. Actualizamos el estado a Activado
					var oParamActivar 				= {};
					oParamActivar.oAuditRequest 	= oParam.oAuditRequest;
					oParamActivar.oData 			= {};
					oParamActivar.oData.iIdEstado 	= parseInt(config.getText("id.estado.activo"), 10);
					oParamActivar.oData.iId		 	= consultarBeneficioxFiltro2Response.oData[i].iId;
					var actualizarEstadoBeneficioResponse = beneficioTxDao.actualizarEstadoBeneficio(oParamActivar);
					if(actualizarEstadoBeneficioResponse.iCode === parseInt(bundle.getText("code.idt1"), 10)){
						throw new TypeError(actualizarEstadoBeneficioResponse.sMessage,'',actualizarEstadoBeneficioResponse.iCode);
					}
				}
			}
			
			//3.3 validamos que la  fecha de expiracion no sea mayor a la fecha actual y que tenga el estado activo
			fechaExpiracion = consultarBeneficioxFiltro2Response.oData[i].dFechaExpiracion;
			if(fechaExpiracion !== undefined 
					&&  fechaExpiracion !== null
						&&  fechaExpiracion !== ''
							&&  fechaExpiracion !== -1){
				//fechaExpiracion.setHours(FechaServidor.getHours() + parseInt(config.getText("horas.adelantado.servidor"), 10));
				fechaExpiracionString  = utils.formatDate(fechaExpiracion, "yyyy-mm-dd");
				if( utils.validarFechaMayor(new Date(FechaServidorString +'T00:00:00').getTime(), new Date(fechaExpiracionString +'T00:00:00').getTime())  
					&& consultarBeneficioxFiltro2Response.oData[i].iIdEstado === parseInt(config.getText("id.estado.activo"), 10)){
					//3.4. Actualizamos el estado a Bloqueado
					var oParamBloquear 				= {};
					oParamBloquear.oAuditRequest 	= oParam.oAuditRequest;
					oParamBloquear.oData 			= {};
					oParamBloquear.oData.iIdEstado 	= parseInt(config.getText("id.estado.bloqueado"), 10);
					oParamBloquear.oData.iId		= consultarBeneficioxFiltro2Response.oData[i].iId;
					var actualizarEstadoBeneficioResponse = beneficioTxDao.actualizarEstadoBeneficio(oParamBloquear);
					if(actualizarEstadoBeneficioResponse.iCode === parseInt(bundle.getText("code.idt1"), 10)){
						throw new TypeError(actualizarEstadoBeneficioResponse.sMessage,'',actualizarEstadoBeneficioResponse.iCode);
					}
				}
			}
		}
		
		//4. Buscamos los eventos
		var oFiltroEvent = {};
		var consultarEventoxFiltro2Response = eventoCnDao.consultarEventoxFiltro2(oFiltroEvent);
		if(consultarEventoxFiltro2Response.iCode === parseInt(bundle.getText("code.idt1"), 10)){
			throw new TypeError(consultarEventoxFiltro2Response.sMessage,'',consultarEventoxFiltro2Response.iCode);
		}
		var fechaPublicacion 		= null;
		var fechaPublicacionString 	= "";
		var fechaExpiracion 		= null;
		var fechaExpiracionString 	= "";
		for (var i = 0; i < consultarEventoxFiltro2Response.oData.length; i++) {
			fechaPublicacion = consultarEventoxFiltro2Response.oData[i].dFechaPublicacion;
			//4.1 validamos que la  fecha de publicacion no sea mayor a la fecha actual y que tenga el estado bloqueado
			if(fechaPublicacion !== undefined 
					&&  fechaPublicacion !== null
						&&  fechaPublicacion !== ''
							&&  fechaPublicacion !== -1){
				//fechaPublicacion.setHours(FechaServidor.getHours() + parseInt(config.getText("horas.adelantado.servidor"), 10));
				fechaPublicacionString  = utils.formatDate(fechaPublicacion, "yyyy-mm-dd");
				
				if( utils.validarFechaIguales(new Date(FechaServidorString +'T00:00:00').getTime(), new Date(fechaPublicacionString +'T00:00:00').getTime())  
					&& consultarEventoxFiltro2Response.oData[i].iIdEstado === parseInt(config.getText("id.estado.bloqueado"), 10)){
					//4.2. Actualizamos el estado a Activado
					var oParamActivar 				= {};
					oParamActivar.oAuditRequest 	= oParam.oAuditRequest;
					oParamActivar.oData 			= {};
					oParamActivar.oData.iIdEstado 	= parseInt(config.getText("id.estado.activo"), 10);
					oParamActivar.oData.iId		 	= consultarEventoxFiltro2Response.oData[i].iId;
					var actualizarEstadoEventoResponse = eventoTxDao.actualizarEstadoEvento(oParamActivar);
					if(actualizarEstadoEventoResponse.iCode === parseInt(bundle.getText("code.idt1"), 10)){
						throw new TypeError(actualizarEstadoEventoResponse.sMessage,'',actualizarEstadoEventoResponse.iCode);
					}
				}
			}
			
			//4.3 validamos que la  fecha de expiracion no sea mayor a la fecha actual y que tenga el estado activo
			fechaExpiracion = consultarEventoxFiltro2Response.oData[i].dFechaFin;
			if(fechaExpiracion !== undefined 
					&&  fechaExpiracion !== null
						&&  fechaExpiracion !== ''
							&&  fechaExpiracion !== -1){
				//fechaExpiracion.setHours(FechaServidor.getHours() + parseInt(config.getText("horas.adelantado.servidor"), 10));
				fechaExpiracionString  = utils.formatDate(fechaExpiracion, "yyyy-mm-dd");
				if( utils.validarFechaMayor(new Date(FechaServidorString +'T00:00:00').getTime(), new Date(fechaExpiracionString +'T00:00:00').getTime())  
					&& consultarEventoxFiltro2Response.oData[i].iIdEstado === parseInt(config.getText("id.estado.activo"), 10)){
					//4.4. Actualizamos el estado a Bloqueado
					var oParamBloquear 				= {};
					oParamBloquear.oAuditRequest 	= oParam.oAuditRequest;
					oParamBloquear.oData 			= {};
					oParamBloquear.oData.iIdEstado 	= parseInt(config.getText("id.estado.bloqueado"), 10);
					oParamBloquear.oData.iId		= consultarEventoxFiltro2Response.oData[i].iId;
					var actualizarEstadoEventoResponse = eventoTxDao.actualizarEstadoEvento(oParamBloquear);
					if(actualizarEstadoEventoResponse.iCode === parseInt(bundle.getText("code.idt1"), 10)){
						throw new TypeError(actualizarEstadoEventoResponse.sMessage,'',actualizarEstadoEventoResponse.iCode);
					}
				}
			}
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
			oRequest.sNombreProceso = "BathActivacion";
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
