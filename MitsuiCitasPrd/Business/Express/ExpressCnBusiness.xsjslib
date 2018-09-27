/* tslint:disable:no-empty */
var textAccess 					= $.import("sap.hana.xs.i18n","text");
var config 						= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var genericaCampoCnDao 			= $.import("MitsuiCitasPrd.Dao.Generica","GenericaCampoCnDao");
var serviceClientCitasTaller	= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.CitasPendienteTaller","CitasPendienteTaller");

var oResponse				= {};


/**
 * @description Función que permite validar servicio Express
 * @creation David Villanueva 31/08/2018
 * @update
 */
function validarServicioExpress(oParam){
	var express = false;
	try {
		//1. Buscamos los talleres express segun filtro
		var oFiltroTaller = {};
		oFiltroTaller.iIdEstado 		= parseInt(config.getText("id.estado.activo"), 10);
		oFiltroTaller.sCodigoTabla 		= 'locales';
		oFiltroTaller.sCodigoSap		= oParam.oData.sCodTaller;
		var consultarLocalesResponse = genericaCampoCnDao.consultarCampoxTabla(oFiltroTaller);
		if(consultarLocalesResponse.iCode > parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(bundle.getText("msj.validar.express.locales"),'',consultarLocalesResponse.iCode);
		}
		if(consultarLocalesResponse.iCode < parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarLocalesResponse.sMessage,'',consultarLocalesResponse.iCode);
		}
		
		var oFiltroHorario = {};
		oFiltroHorario.iIdEstado 		= parseInt(config.getText("id.estado.activo"), 10);
		
		
		//2. validamos el horario del taller express
		var diaCita = new Date(oParam.oData.sFechaCita).getDay();
		if(diaCita === 6){
			oFiltroHorario.sCodigoTabla = 'express_sabado';
		}else{
			oFiltroHorario.sCodigoTabla = 'express_horario';
		}
		oFiltroHorario.iIdPadre			= consultarLocalesResponse.oData[0].iId;
		var consultarHorarioLocalResponse = genericaCampoCnDao.consultarCampoxTabla(oFiltroHorario);
		if(consultarHorarioLocalResponse.iCode > parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(bundle.getText("msj.validar.express.horario"),'',consultarHorarioLocalResponse.iCode);
		}
		if(consultarHorarioLocalResponse.iCode < parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarHorarioLocalResponse.sMessage,'',consultarHorarioLocalResponse.iCode);
		}
		var numExpress = 0;
		var existeExpress = false;
		var rangoFechaCita = '';
		for (var i = 0; i < consultarHorarioLocalResponse.oData.length; i++) {
			if(utils.validarHora(consultarHorarioLocalResponse.oData[i].sDescripcion, oParam.oData.sHoraCita)){
				existeExpress = true;
				numExpress = parseInt(consultarHorarioLocalResponse.oData[i].sCodigoSap, 10);
				rangoFechaCita = consultarHorarioLocalResponse.oData[i].sDescripcion;
			}
		}
		
		if(!existeExpress){
			throw new TypeError(bundle.getText("msj.validar.express.hora"),'',parseInt(bundle.getText("code.idf2"), 10));
		}

		//3. Buscamos las citas pendientes por taller
		var aListaCitas = [];
		var oParamCitas = {};
		oParamCitas.sCodigoTaller 	= oParam.oData.sCodTaller;
		oParamCitas.dFechaInicio 	= oParam.oData.sFechaCita;
		var FechaFin 						= new Date(oParam.oData.sFechaCita+"T00:00:00");
		FechaFin.setHours(FechaFin.getMonth() + 1);
		oParamCitas.dFechaFin	 	= utils.formatDate(FechaFin, "yyyy-mm-dd");;
		var consultarCitasTallerC4CResponse = serviceClientCitasTaller.consultarCitasTallerC4C(oParamCitas);
		if(consultarCitasTallerC4CResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
			aListaCitas = consultarCitasTallerC4CResponse.oData.Activity;
		}
		var numCitasExpressPendientes = 0;
		for(var j = 0; j < aListaCitas.length; j++){
			if(utils.validarHora(rangoFechaCita, aListaCitas[j].zHoraInicio)
					&& aListaCitas[j].zExpress === 'true' 
						&& aListaCitas[j].zFecha === oParam.oData.sFechaCita){
				numCitasExpressPendientes = numCitasExpressPendientes +1;
			}
		}
		numExpress = numExpress - numCitasExpressPendientes;
		if(numExpress < 1){
			throw new TypeError(bundle.getText("msj.validar.express.disponible"),'',parseInt(bundle.getText("code.idf2"), 10));
		}
		
		//4. Buscamos el codigo del modelo de carro
		var oFiltroModelo = {};
		oFiltroModelo.iIdEstado 		= parseInt(config.getText("id.estado.activo"), 10);
		oFiltroModelo.sCodigoTabla 		= 'carro_modelos';
		var codigoModelo 				= oParam.oData.sCodFamiliaVehiculo;
		oFiltroModelo.sCodigoSap		= codigoModelo;
		var consultarModeloResponse = genericaCampoCnDao.consultarCampoxTabla(oFiltroModelo);
		if(consultarModeloResponse.iCode > parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(bundle.getText("msj.validar.modelo"),'',consultarModeloResponse.iCode);
		}
		if(consultarModeloResponse.iCode < parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarModeloResponse.sMessage,'',consultarModeloResponse.iCode);
		}
		
		//5. Validamos si existe configurado el modelo del carro con el taller
		var oFiltroModeloTaller = {};
		oFiltroModeloTaller.iIdEstado 		= parseInt(config.getText("id.estado.activo"), 10);
		oFiltroModeloTaller.sCodigoTabla 	= 'express_mod_taller';
		oFiltroModeloTaller.iIdPadre		= consultarModeloResponse.oData[0].iId;
		oFiltroModeloTaller.sDescripcion	= oParam.oData.sCodTaller;
		var consultarModeloTallerResponse = genericaCampoCnDao.consultarCampoxTabla(oFiltroModeloTaller);
		if(consultarModeloTallerResponse.iCode > parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(bundle.getText("msj.validar.express.mod.taller"),'',consultarModeloTallerResponse.iCode);
		}
		if(consultarModeloTallerResponse.iCode < parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarModeloTallerResponse.sMessage,'',consultarModeloTallerResponse.iCode);
		}
		
		//6. Validamos si existe configurado el modelo del carro con el taller
		var oFiltroModeloMant = {};
		oFiltroModeloMant.iIdEstado 	= parseInt(config.getText("id.estado.activo"), 10);
		oFiltroModeloMant.sCodigoTabla 	= 'express_mant_mod';
		oFiltroModeloMant.iIdPadre		= consultarModeloResponse.oData.iId;
		oFiltroModeloMant.sDescripcion	= oParam.oData.sCodigoMant;
		var consultarModeloMantResponse = genericaCampoCnDao.consultarCampoxTabla(oFiltroModeloMant);
		if(consultarModeloMantResponse.iCode > parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(bundle.getText("msj.validar.express.mod.mant"),'',consultarModeloMantResponse.iCode);
		}
		if(consultarModeloMantResponse.iCode < parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarModeloMantResponse.sMessage,'',consultarModeloMantResponse.iCode);
		}
		
		
		oResponse.iCode 	=  parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage 	=  bundle.getText("msj.idf1");
		oResponse.oData		= numCitasExpressPendientes;
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
