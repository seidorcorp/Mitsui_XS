var textAccess 					= $.import("sap.hana.xs.i18n","text");
var config 						= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var citaTxDao 					= $.import("MitsuiCitasPrd.Dao.Cita","CitaTxDao");
var serviceClientProductos		= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.ListaProductos","ListaProductos");
var serviceClientOferta			= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.CrearOferta","CrearOferta");
var serviceClientActOferta		= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.ActualizarOferta","ActualizarOferta");
var serviceClientDetalleMat		= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.DetalleMaterial","DetalleMaterial");
var genericaCampoCnDao 			= $.import("MitsuiCitasPrd.Dao.Generica","GenericaCampoCnDao");
var citaCnDao 					= $.import("MitsuiCitasPrd.Dao.Cita","CitaCnDao");
var serviceClientAuditoria 		= $.import("MitsuiCitasPrd.ServiceClient.Auditoria","Auditoria");
var serviceClientEmail			= $.import("MitsuiCitasPrd.ServiceClient.EnvioCorreoGeneral","EnvioCorreoGeneral");
var oResponse					= {};

function enviarCorreoError(oParam){
	var oRespuestaCorreo		= {};
	try{
		var oRequest 				= {};
		oRequest.sCorreoDestino 	= oParam.sCorreoDestino;
		oRequest.sAsunto			= "[CITAS-APP] - Error al generar Oferta";
		oRequest.sCuerpo		 	=  "<font color=\"#888181\" size=\"3\" face=\"MS Sans Serif\">"+
										"<h4><b>Error al generar la oferta de la cita generada </b></h4>"+ 
										"<i><b style=\"color: #546494\"> Información del Cliente: </b></i><br><ul>" +
										"<li><strong style=\" color: #807777;\">Nombre:</strong> "+oParam.sCliente+"</li>" +
										"<li><strong style=\" color: #807777;\">Placa:</strong> "+oParam.sPlaca+"</li></ul>" +
										"<i><b style=\"color: #546494\">Información del Servicio:</b></i><br> <ul>" +
										"<li><strong style=\" color: #807777;\">Codigo Cita:</strong> "+oParam.sCodCita+" </li>" +
										"<li><strong style=\" color: #807777;\">Fecha:</strong> "+oParam.sFecha+" </li>" +
										"<li><strong style=\" color: #807777;\">Hora:</strong> "+oParam.sHora+" </li>" +
										"<li><strong style=\" color: #807777;\">Tipo Servicio:</strong> "+oParam.sTipoServicio+" </li>" +
										"<li><strong style=\" color: #807777;\">Servicio a realizar:</strong> "+oParam.sServicioRelizar+" </li>" +
										"<li><strong style=\" color: #807777;\">Observación:</strong> "+oParam.sObservacion+" </li>" +
										"<li><strong style=\" color: #807777;\">Telefono:</strong> "+oParam.sTelefono+" </li> </ul>" +
										"</font>";
		
		var enviarCorreoResponse = serviceClientEmail.enviarCorreo(oRequest);
		if(enviarCorreoResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
			oRespuestaCorreo.iCode 		= parseInt(bundle.getText("code.idf1"), 10);
			oRespuestaCorreo.sMessage 	= bundle.getText("msj.idf1");
		}else {
			oRespuestaCorreo.iCode 		= enviarCorreoResponse.iCode;
			oRespuestaCorreo.sMessage 	= enviarCorreoResponse.sMessage;
		}
		
	}catch(e){
		if (e instanceof TypeError) {
			oRespuestaCorreo.iCode 	= e.lineNumber;
			oRespuestaCorreo.sMessage 	= e.message;
		}else{
			oRespuestaCorreo.iCode 	= parseInt(bundle.getText("code.idt2"), 10);
			oRespuestaCorreo.sMessage 	= bundle.getText("msj.idt2",[e.toString()]);
		}	
	}
	
	return oRespuestaCorreo;
}

/**
 * @description Función que permite registrar una oferta
 * @creation David Villanueva 15/09/2018
 * @update
 */
function registrarOferta(oParam){
	
	var tiempo				= 0;
	var oErrores	    	= [];
	var oFiltro 			= {};
	oFiltro.oData 			= {};
	
	try {
		tiempo 				= new Date().getTime();
		
		// 1. Consultamos las ofertas por enviar
		var oFiltroCita 		= {};
		oFiltroCita.iEnvioOferta = 0;
		var consultarCitaxFiltroResponse = citaCnDao.consultarCitaxFiltro(oFiltroCita);
		if(consultarCitaxFiltroResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarCitaxFiltroResponse.sMessage,'',consultarCitaxFiltroResponse.iCode);	
		}
		for (var i = 0; i < consultarCitaxFiltroResponse.oData.length; i++) {
			
			var oCita = consultarCitaxFiltroResponse.oData[i];
			// 2 consultamos datos de venta del generico
			var oFiltroGenerico = {};
			oFiltroGenerico.iIdEstado 		= parseInt(config.getText("id.estado.activo"), 10);
			oFiltroGenerico.sCodigoTabla 	= 'Codigo_Ventas';
			oFiltroGenerico.sCampo	 		= oCita.sCodTaller + '-' + oCita.sMarca;
			var consultarLocalesResponse = genericaCampoCnDao.consultarCampoxTabla(oFiltroGenerico)
			if(consultarLocalesResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
				oErrores.push({
					"Operacion"	: "ConsultarDatosVenta",
					"IdCitaC4c"	: oCita.sIdCitaC4c,
					"IdCita"	: oCita.sIdCita,
					"Codigo"	: consultarLocalesResponse.iCode,
					"Mensaje"	: consultarLocalesResponse.sMessage
				});
				continue;
			}
			
			var sIdOrganizacion 	= '';
			var sIdOficina 			= '';
			var sIdGrupo 			= '';
			var sIdCanal 			= '';
			var sIdDivision			= '';
			if(consultarLocalesResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
				var campos = consultarLocalesResponse.oData[0].sDescripcion.split(",");
				sIdOrganizacion 	= campos[0];
				sIdOficina 			= campos[1];
				sIdGrupo 			= campos[2];
				sIdCanal 			= campos[3];
				sIdDivision			= campos[4];
			}
			
			var oOferta 			 = {};
			oOferta.iIdCliente 		 = oCita.iIdClienteC4c;
			oOferta.sIdOrganizacion  = sIdOrganizacion;
			oOferta.sIdOficina 		 = sIdOficina;
			oOferta.sIdGrupo 		 = sIdGrupo;
			oOferta.sIdCanal 		 = sIdCanal;
			oOferta.sIdDivision 	 = sIdDivision;
			oOferta.sIdCitaC4C 		 = oCita.sIdCitaC4c;
			oOferta.sCodTaller		 = oCita.sCodTaller;
			oOferta.sPlaca			 = oCita.sPlaca;
			oOferta.sObservacion	 = oCita.sObservacion;
			oOferta.bExpress	 	 = (oCita.iExpress === 1) ? true : false;
			oOferta.aItems 			= [];
			var existeOferta 		= false;
			
			//2.1 Eliminamos la oferta si es que tiene una referencia
			if(oCita.iCitaReprogramada === 1){
				var oParamEstado 				 = {};
				oParamEstado.sIdOfertaReferencia = oCita.sIdOfertaReferencia;
				var CambiarEstadoOfertaC4cResponse = serviceClientActOferta.CambiarEstadoOfertaC4c(oParamEstado);
				if(CambiarEstadoOfertaC4cResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
					oErrores.push({
						"Operacion"			: "EliminarOfertaRefernecia",
						"IdCitaReferencia"	: oCita.iIdCitaReferencia,
						"Codigo"			: CambiarEstadoOfertaC4cResponse.iCode,
						"Mensaje"			: CambiarEstadoOfertaC4cResponse.sMessage
					});
				}
			}
			
			// 1: Es Paquete ; 0: Es Material
			if	(oCita.iExistePaquete === 1){
				// 3. Consultamos los paquetes
				var oParamProd 		= {};
				oParamProd.sCodigo 	= oCita.sPaquete;
				var consultarProductosC4cResponde = serviceClientProductos.consultarProductosC4c(oParamProd);
				oOferta.sMensaje = consultarProductosC4cResponde.sMessage;
				if(consultarProductosC4cResponde.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					existeOferta = true;
				}
				
				if(existeOferta){
					var codPaquete 			= consultarProductosC4cResponde.oData.BOListaProductos.zPACKAGE_TYPE;
					for (var j = 0; j < consultarProductosC4cResponde.oData.ProductosVinculados.length; j++) {
						var oBjeto 				= consultarProductosC4cResponde.oData.ProductosVinculados[j];
						var codProducto 		= oBjeto.zIDProductoVinculado;
						var sPosTiempoTeorico	= oBjeto.zCantidad;
						var zOVPosCantTrab		= 0;
						var Quantity			= oBjeto.zZMENG;
						var sUnidadMedida		= 'EA';
						if(oBjeto.zTipoPosicion === 'P010'){
							codProducto = oBjeto.zMatnr;
						}
						
						if(oBjeto.zTipoPosicion === 'P001'){
							zOVPosCantTrab 		= 1;
							sUnidadMedida		= 'HUR';
							//3.1 Consultamos el detalle de material 
							var oParamDetMat 	= {};
							var detalleMaterialC4cResponse = null;
							oParamDetMat.sTipoValorTrabajo 		= oCita.sTipoValorTrabajo;
							oParamDetMat.sIDProductoVinculado 	= oBjeto.zIDProductoVinculado;
							detalleMaterialC4cResponse = serviceClientDetalleMat.detalleMaterialC4c(oParamDetMat);
							if(detalleMaterialC4cResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
								sPosTiempoTeorico = detalleMaterialC4cResponse.oData.BODetalleMaterialesLabores.VALUE;
								Quantity		  = detalleMaterialC4cResponse.oData.BODetalleMaterialesLabores.VALUE;
							}
						}
						oOferta.aItems.push({
//							"iId"					: parseInt(oBjeto.zPOSNR,10),
							"sTipoPosicion"			: oBjeto.zTipoPosicion,
							"sCodProducto"			: codProducto,
							"sCodProductoInterno"	: oBjeto.zIDProductoVinculado,
							"sPosCantTrab"			: zOVPosCantTrab,
							"sCodPaquete"			: oParamProd.sCodigo,
							"sTipoPaquete"			: codPaquete,
							"sUnidadMedida"			: sUnidadMedida,
							"sPosTiempoTeorico"		: (sPosTiempoTeorico===undefined)? 0 : sPosTiempoTeorico,
							"Quantity"				: (Quantity===undefined)? 0 : Quantity,
							"sIDTipoPosicion"		: oBjeto.zTipoPosicion
							
						});
					}
					
				} else {
					var servicio = '';
					if(oCita.sServicioRealizar !== undefined 
							&& oCita.sServicioRealizar !== null 
								&& oCita.sServicioRealizar !== ''){
						servicio = ' / ' + oCita.sServicioRealizar;
					}
					oOferta.sObservacion	 = oCita.sTipoServicio +  servicio + " : " + oCita.sObservacion;
				}
				
				
			}else{
				//3.2 Si no existe paquete se le envia la descripcion del servicio a realizar en la observación
				var servicio = '';
				if(oCita.sServicioRealizar !== undefined 
						&& oCita.sServicioRealizar !== null 
							&& oCita.sServicioRealizar !== ''){
					servicio = ' / ' + oCita.sServicioRealizar;
				}
				oOferta.sObservacion	 = oCita.sTipoServicio +  servicio + " : " + oCita.sObservacion;
			}
			
			if(oCita.iExistePaquete === 0){
				oOferta.sMaterial = oCita.sPaquete;
			}
			if(oCita.iExpress === 1){
				var oFiltroGenerico = {};
				oFiltroGenerico.iIdEstado 		= parseInt(config.getText("id.estado.activo"), 10);
				oFiltroGenerico.sCodigoTabla 	= 'tipos_vehiculos_express';
				oFiltroGenerico.sDescripcion	= oCita.sCodFamilia;
				var consultarLocalesResponse = genericaCampoCnDao.consultarCampoxTabla(oFiltroGenerico)
				if(consultarLocalesResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					oOferta.sProducCodExpress = consultarLocalesResponse.oData[0].sCodigoSap;
					oOferta.sProducCodInternoExpress = consultarLocalesResponse.oData[0].sCodigoSap;
				}
			}
			
			// 5 creamos la oferta
			var sIdOferta = '';
			var crearOfertaC4cResponse = serviceClientOferta.crearOfertaC4c(oOferta);
			if(crearOfertaC4cResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
				oErrores.push({
					"Servicio"	:"CrearOfertaC4c",
					"IdCitaC4c"	: oCita.sIdCitaC4c,
					"IdCita"	: oCita.sIdCita,
					"Codigo"	: crearOfertaC4cResponse.iCode,
					"Mensaje"	: crearOfertaC4cResponse.sMessage
				});

			}
			
			//6 actualizamos el estado de EnvioOferta
			if(crearOfertaC4cResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
				sIdOferta = crearOfertaC4cResponse.oData.CustomerQuote.ID;
			}
			var oParamEstadoOferta 			= {};
			oParamEstadoOferta.iEnvioOferta = 1;
			oParamEstadoOferta.iId			= oCita.iId;
			oParamEstadoOferta.sIdOferta	= sIdOferta;
			oParamEstadoOferta.sEstadoEnvioOferta 	= (crearOfertaC4cResponse.iCode === 1) ? "OK" : "ERROR";
			var actualizarEstadoEnvioOfertaResponse 	= citaTxDao.actualizarEstadoEnvioOferta(oParamEstadoOferta);
			if(actualizarEstadoEnvioOfertaResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
				throw new TypeError(actualizarEstadoEnvioOfertaResponse.sMessage,'',actualizarEstadoEnvioOfertaResponse.iCode);	
			}

			//7. Si sale error enviar correo, colocamos por aqui porque demora en enviar el correo
			if(crearOfertaC4cResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			
				var oCorreo 			= {};
				oCorreo.sCorreoDestino 	= oCita.sEmailCita;
				oCorreo.sCliente 		= oCita.sNombre +" "+ oCita.sApellido;
				oCorreo.sPlaca 			= oCita.sPlaca;
				oCorreo.sCodCita 		= oCita.sIdCita;
				oCorreo.sFecha 			= utils.formatDate(oCita.dFechaCita, "dd/mm/yyyy");
				oCorreo.sHora 			= oCita.sHoraCita;
				oCorreo.sTipoServicio 	= oCita.sTipoServicio;
				oCorreo.sServicioRelizar= oCita.sServicioRealizar;
				oCorreo.sObservacion 	= oCita.sObservacion;
				oCorreo.sTelefono 		= oCita.sTelefono;
				enviarCorreoError(oCorreo);
			}
		}
		
		if(oErrores.length > 0){
			oResponse.iCode 	= parseInt(bundle.getText("code.idf2"), 10);
			oResponse.sMessage 	= bundle.getText("msj.oferta.crear.error");
			oResponse.oData 	= oErrores;
			
		}else{
			oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idf1");
		}
		
	}catch(e){
		if (e instanceof TypeError) {
			oResponse.iCode 	= e.lineNumber;
			oResponse.sMessage 	= e.message;
		}else{
			oResponse.iCode 	= parseInt(bundle.getText("code.idt2"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt2",[e.toString()]);
			oErrores.push({
				"Servicio"	:"CrearOfertaC4c",
				"Codigo"	: parseInt(bundle.getText("code.idt2"), 10),
				"Mensaje"	: bundle.getText("msj.idt2",[e.toString()])
			});
		}	
			oResponse.oData		= oErrores;
	}finally {
		try{
			if(oErrores.length > 0){
				var oRequest 				= {};
				oRequest.oAuditRequest 		= oParam.oAuditRequest;
				oRequest.sNombreProceso 	= "RegistrarOferta";
				oRequest.iProcesoPrincipal 	= 1;
				oRequest.iProcesoOrden 		= 0;
				oRequest.iTiempoProceso 	= ((new Date().getTime()) - tiempo);
				oRequest.sEntradaProceso 	= JSON.stringify(oParam.oData);
				oRequest.sRespuestaProceso 	= JSON.stringify(oResponse);
				oRequest.sMetadata 			= "";
				oRequest.sEstado 			= (oResponse.iCode === 1) ? "OK" : "ERROR";
				serviceClientAuditoria.registrarAuditoria(oRequest);
			}
		} finally {
			
		}
	}
	return oResponse;
}
