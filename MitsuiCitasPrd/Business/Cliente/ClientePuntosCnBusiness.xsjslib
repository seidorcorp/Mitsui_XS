/* tslint:disable:no-empty */
var textAccess 					= $.import("sap.hana.xs.i18n","text");
var config 						= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var serviceClientSap		 	= $.import("MitsuiCitasPrd.ServiceClient.MitsuiSap.ClientePuntos","ClientePuntos");

var oResponse					= {};

/**
 * @description Función que permite buscar los puntos del cliente
 * @creation David Villanueva 17/08/2018
 * @update
 */
function consultarPuntosCliente(oParam){
	var oFiltro = {};
	try {
		oFiltro.sNumIdentificacion 		 		= oParam.oData.sNumIdentificacion;
		//1. Buscamos puntos del cliente
		var consultarClientePuntosSapResponse = serviceClientSap.consultarClientePuntosSap(oFiltro);
		
		if(consultarClientePuntosSapResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarClientePuntosSapResponse.sMessage,'',consultarClientePuntosSapResponse.iCode);
		}
		
		oResponse.oData = consultarClientePuntosSapResponse.oData;
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
