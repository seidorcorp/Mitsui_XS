var textAccess 					= $.import("sap.hana.xs.i18n","text");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var tallerHorarioTxBusiness 	= $.import("MitsuiCitasPrd.Business.CalendarioTaller","CalendarioTallerCnBusiness2");

var sIdTransaccion;

function procesarOfertasBath(){
	var oParam = {};
	try{
		sIdTransaccion = utils.generarIdTransaccion();
		oParam.oAuditRequest = {};
		oParam.oAuditRequest.sIdTransaccion =sIdTransaccion;
		oParam.oAuditRequest.sAplicacion = 'BATCH';
		oParam.oAuditRequest.sUsuario='SYSTEM';
		oParam.oAuditRequest.sTerminal='127.0.0.1';
		oParam.oAuditRequest.dFecha = utils.obtenerFechaIso();
		oParam.oData={};
		oParam.oData.sCodigoCentro = 'M013';
		oParam.oData.sFechaInicio ='2018-09-18';
		oParam.oData.sFechaFinal = '2018-10-12';
//		tallerHorarioTxBusiness.registrarTallerHorario(oParam);
		var tallerHorarioTxBusinessBusinessResponse = tallerHorarioTxBusiness.generarCalendarioxFiltro(oParam);
		
		utils.sendResponse(
				sIdTransaccion,
				tallerHorarioTxBusinessBusinessResponse.iCode, 
				tallerHorarioTxBusinessBusinessResponse.sMessage, 
				tallerHorarioTxBusinessBusinessResponse.oData );
		
	}finally{
		
	}
} 

procesarOfertasBath();