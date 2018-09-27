/* tslint:disable:no-empty */
var textAccess 					= $.import("sap.hana.xs.i18n","text");
var config 						= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var genericaCampoCnDao 			= $.import("MitsuiCitasPrd.Dao.Generica","GenericaCampoCnDao");
var citaCnDao 					= $.import("MitsuiCitasPrd.Dao.Cita","CitaCnDao");
var serviceClientCitasId	 	= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.ConsultarCitasClienteId","CitasClienteId");

var oResponse					= {};

/**
 * @description Función que permite consultar las citas del cliente por id
 * @creation David Villanueva 31/08/2018
 * @update
 */
function consultarCitasClienteId(oParam){
	var oFiltro = {};
	try {
		oFiltro.iIdCliente 		 		= oParam.oData.iIdCliente;
		//1. Buscamos las citas del cliente por Id
		var consultarCitasClienteIdC4CResponse = serviceClientCitasId.consultarCitasClienteIdC4C(oFiltro);
		
		if(consultarCitasClienteIdC4CResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarCitasClienteIdC4CResponse.sMessage,'',consultarCitasClienteIdC4CResponse.iCode);
		}
		
		//2. obtenemos los codigos de la tabla carro_modelos de la generica
		for (var i = 0; i < consultarCitasClienteIdC4CResponse.oData.Activity.length; i++) {
			consultarCitasClienteIdC4CResponse.oData.Activity[i].sTaller		 		= "";
			consultarCitasClienteIdC4CResponse.oData.Activity[i].sCodTipoServicio 		= "";
			consultarCitasClienteIdC4CResponse.oData.Activity[i].sTipoServicio 			= "";
			consultarCitasClienteIdC4CResponse.oData.Activity[i].sCodServicioRealizar 	= "";
			consultarCitasClienteIdC4CResponse.oData.Activity[i].sServicioRealizar 		= "";
			consultarCitasClienteIdC4CResponse.oData.Activity[i].sMarca		 			= "";
			consultarCitasClienteIdC4CResponse.oData.Activity[i].sModelo		 		= "";
			consultarCitasClienteIdC4CResponse.oData.Activity[i].sIdModelo			 	= "";
			consultarCitasClienteIdC4CResponse.oData.Activity[i].sTipoValorTrabajo	 	= "";
			consultarCitasClienteIdC4CResponse.oData.Activity[i].bExpress	 			= false;
			consultarCitasClienteIdC4CResponse.oData.Activity[i].sMedioContacto	 		= "";
			consultarCitasClienteIdC4CResponse.oData.Activity[i].sDescMedioContacto	 	= "";
			consultarCitasClienteIdC4CResponse.oData.Activity[i].bVieneC4c			 	= true;
			consultarCitasClienteIdC4CResponse.oData.Activity[i].sMensajeC4c		 	= "Por favor, cancelar la cita pendiente y luego genere su cita";
			var oFiltroTabla = {};
			oFiltroTabla.sIdCitaC4c = consultarCitasClienteIdC4CResponse.oData.Activity[i].zUUID;
			var consultarCitaxFiltroResponse = citaCnDao.consultarCitaxFiltro(oFiltroTabla);
			if(consultarCitaxFiltroResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
				consultarCitasClienteIdC4CResponse.oData.Activity[i].sTaller		 		= consultarCitaxFiltroResponse.oData[0].sTaller;
				consultarCitasClienteIdC4CResponse.oData.Activity[i].sCodTipoServicio 		= consultarCitaxFiltroResponse.oData[0].sCodTipoServicio;
				consultarCitasClienteIdC4CResponse.oData.Activity[i].sTipoServicio 			= consultarCitaxFiltroResponse.oData[0].sTipoServicio;
				consultarCitasClienteIdC4CResponse.oData.Activity[i].sCodServicioRealizar 	= consultarCitaxFiltroResponse.oData[0].sCodServicioRealizar;
				consultarCitasClienteIdC4CResponse.oData.Activity[i].sServicioRealizar 		= consultarCitaxFiltroResponse.oData[0].sServicioRealizar;
				consultarCitasClienteIdC4CResponse.oData.Activity[i].sDescripcion			= consultarCitaxFiltroResponse.oData[0].sObservacion;
				consultarCitasClienteIdC4CResponse.oData.Activity[i].sMarca		 			= consultarCitaxFiltroResponse.oData[0].sMarca;
				consultarCitasClienteIdC4CResponse.oData.Activity[i].sModelo		 		= consultarCitaxFiltroResponse.oData[0].sModelo;
				consultarCitasClienteIdC4CResponse.oData.Activity[i].sIdModelo			 	= consultarCitaxFiltroResponse.oData[0].sIdModelo;
				consultarCitasClienteIdC4CResponse.oData.Activity[i].sTipoValorTrabajo	 	= consultarCitaxFiltroResponse.oData[0].sTipoValorTrabajo;
				consultarCitasClienteIdC4CResponse.oData.Activity[i].sMedioContacto	 		= consultarCitaxFiltroResponse.oData[0].sMedioContacto;
				consultarCitasClienteIdC4CResponse.oData.Activity[i].sDescMedioContacto	 	= consultarCitaxFiltroResponse.oData[0].sDescMedioContacto;
				consultarCitasClienteIdC4CResponse.oData.Activity[i].bVieneC4c			 	= false;
				consultarCitasClienteIdC4CResponse.oData.Activity[i].sMensajeC4c			= '';
				consultarCitasClienteIdC4CResponse.oData.Activity[i].bExpress	 			= (consultarCitaxFiltroResponse.oData[0].iExpress === 0) ?  false : true;
			}
		}
		
		oResponse.oData = consultarCitasClienteIdC4CResponse.oData;
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
