/* tslint:disable:no-empty */
var textAccess 					= $.import("sap.hana.xs.i18n","text");
var config 						= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var serviceClientSap		 	= $.import("MitsuiCitasPrd.ServiceClient.MitsuiSap.ClienteHistorialCitas","ClienteHistorialCitas");

var oResponse					= {};

/**
 * @description Función que permite consultar el historial de citas por placa
 * @creation David Villanueva 17/08/2018
 * @update
 */
function consultarHistoricoCitas(oParam){
	var oFiltro = {};
	try {
		oFiltro.sPlaca 		 		= oParam.oData.sPlaca;
		// 1. Buscamos los usuarios segun filtro
		var consultarClienteHistorialCitasSapResponse = serviceClientSap.consultarClienteHistorialCitasSap(oFiltro);
		
		if(consultarClienteHistorialCitasSapResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarClienteHistorialCitasSapResponse.sMessage,'',consultarClienteHistorialCitasSapResponse.iCode);
		}
		//1.2 adicionamos el campo observacion
		for (var i = 0; i < consultarClienteHistorialCitasSapResponse.oData.EtOrdVlc.item.length; i++) {
			
			if(consultarClienteHistorialCitasSapResponse.oData.EtOrdVlc.item[i].Observacion === undefined 
					|| consultarClienteHistorialCitasSapResponse.oData.EtOrdVlc.item[i].Observacion === null 
						|| consultarClienteHistorialCitasSapResponse.oData.EtOrdVlc.item[i].Observacion === '' ){
				
				consultarClienteHistorialCitasSapResponse.oData.EtOrdVlc.item[i].Observacion = '';
			}
			
		}
		//1.3 Ordernamos la lista de historial por fecha
		consultarClienteHistorialCitasSapResponse.oData.EtOrdVlc.item.sort(function (a, b) {
			  var fecha1 =a.FechaServ.split('/');
			  var fecha2 =b.FechaServ.split('/');
			  var FechaInicio = new Date(fecha1[2], fecha1[1] - 1, fecha1[0]).getTime(); 
			  var FechaFinal = new Date(fecha2[2], fecha2[1] - 1, fecha2[0]).getTime(); 
			      return (FechaFinal - FechaInicio)
			  
			});
		
		oResponse.oData = consultarClienteHistorialCitasSapResponse.oData;
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
