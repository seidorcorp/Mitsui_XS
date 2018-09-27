/* tslint:disable:no-empty */
var textAccess 					= $.import("sap.hana.xs.i18n","text");
var config 						= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var serviceClientVehiculos	 	= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.ConsultaVehiculos","ConsultarVehiculos");
var serviceClientCitasId	 	= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.ConsultarCitasClienteId","CitasClienteId");
var serviceClientHistorial	 	= $.import("MitsuiCitasPrd.ServiceClient.MitsuiSap.ClienteHistorialCitas","ClienteHistorialCitas");
var genericaCampoCnDao 			= $.import("MitsuiCitasPrd.Dao.Generica","GenericaCampoCnDao");
var oResponse					= {};

/**
 * @description Función que permite buscar los vehiculos del cliente
 * @creation David Villanueva 31/08/2018
 * @update
 */
function buscarVehiculosxFiltro(oParam){
	
	try {
		
		//1. Buscamos los vehiculos del cliente segun filtro
		var oFiltro = {};
		oFiltro.sIdCliente 		 		= oParam.oData.iIdCliente;
		var consultarVehiculosC4cResponse = serviceClientVehiculos.consultarVehiculosC4c(oFiltro);
		if(consultarVehiculosC4cResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarVehiculosC4cResponse.sMessage,'',consultarVehiculosC4cResponse.iCode);
		}
		
		//2. Buscamos las citas pendientes del usuario por Id
		var aListaVeh 			= [];
		var oFiltroId 			= {};
		oFiltroId.iIdCliente    = oParam.oData.iIdCliente;
		var consultarCitasClienteIdC4CResponse = serviceClientCitasId.consultarCitasClienteIdC4C(oFiltroId);
		if(consultarCitasClienteIdC4CResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
			aListaVeh = consultarCitasClienteIdC4CResponse.oData.Activity;
		}
		
		//3. Consultamos las imagenes de los modelos de auto
		var oFiltroImagenesModelo 			= {};
		var aListaImagenes					= [];
		oFiltroImagenesModelo.iIdEstado 	= parseInt(config.getText("id.estado.activo"), 10);
		oFiltroImagenesModelo.sCodigoTabla 	= 'imagen_modelo_autos';
		var consultarImagesModeloResponse = genericaCampoCnDao.consultarCampoxTabla(oFiltroImagenesModelo);
		if(consultarImagesModeloResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
			aListaImagenes = consultarImagesModeloResponse.oData;
		}
		var iIdModelo 			= '';
		var oData 				= {};
		oData.BOVehiculo 		= [];
		for (var i = 0; i < consultarVehiculosC4cResponse.oData.BOVehiculo.length; i++) {
			consultarVehiculosC4cResponse.oData.BOVehiculo[i].sUrlImagenModelo = "";
			consultarVehiculosC4cResponse.oData.BOVehiculo[i].citaPendiente = false;
			if((consultarVehiculosC4cResponse.oData.BOVehiculo[i].zIDMarca === oParam.oData.sMarca) 
					|| (oParam.oData.sMarca === '')){
				//3.1 buscamos el id del modelo en la  lista de imagenes
				iIdModelo = consultarVehiculosC4cResponse.oData.BOVehiculo[i].zFamiliaModelo;
				for (var j = 0; j < aListaImagenes.length; j++) {
					if(aListaImagenes[j].sCodigoSap === iIdModelo){
						consultarVehiculosC4cResponse.oData.BOVehiculo[i].sUrlImagenModelo = aListaImagenes[j].sDescripcion;
					}
				}
				
				//3.2 verificamos si ese carro tiene cita pendiente
				var placa = consultarVehiculosC4cResponse.oData.BOVehiculo[i].zPlaca;
				for (var j = 0; j < aListaVeh.length; j++) {
					if(aListaVeh[j].zPlaca === placa){
						consultarVehiculosC4cResponse.oData.BOVehiculo[i].citaPendiente = true;
					}
				}
				
				oData.BOVehiculo.push(consultarVehiculosC4cResponse.oData.BOVehiculo[i]);
			}
		}
		
		if(oData.BOVehiculo !== undefined && oData.BOVehiculo !== null && oData.BOVehiculo.length > 0){
			oResponse.oData = oData;
			oResponse.iCode =  parseInt(bundle.getText("code.idf1"), 10);
			oResponse.sMessage = bundle.getText("msj.idf1");
		}else{
			oResponse.iCode =  parseInt(bundle.getText("code.idf2"), 10);
			oResponse.sMessage = bundle.getText("msj.idf2");
		}
		
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


/**
 * @description Función que permite buscar el ultimo Kilometraje del carro
 * @creation David Villanueva 10/09/2018
 * @update
 */
function buscarUltimoKmAuto(oParam){
	
	try {
		
		//1 buscamos el historial del auto por placa de sap
		var km = 0;
		var oParamHistorial = {};
		oParamHistorial.sPlaca 	= oParam.oData.sPlaca;
		var aKms = [];
		var consultarClienteHistorialCitasSapResponse = serviceClientHistorial.consultarClienteHistorialCitasSap(oParamHistorial);
		if(consultarClienteHistorialCitasSapResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarClienteHistorialCitasSapResponse.sMessage,'',consultarClienteHistorialCitasSapResponse.iCode);
		}
		
		for (var i = 0; i < consultarClienteHistorialCitasSapResponse.oData.EtOrdVlc.item.length; i++) {
			var km = consultarClienteHistorialCitasSapResponse.oData.EtOrdVlc.item[i].Kilometraje;
			aKms.push(parseInt(km,10));
		}
		
		if(aKms.length > 0){
			km = Math.max(...aKms)
		}
		
		var oCamposAuto = {};
		oCamposAuto.kmAuto = km;
		
		oResponse.oData = oCamposAuto;
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
	}
	return oResponse;
	
}