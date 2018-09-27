var textAccess 					= $.import("sap.hana.xs.i18n","text");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var tallerHorarioTxBusiness 	= $.import("MitsuiCitasPrd.Business.TallerHorario","TallerHorarioTxBusiness");

var sIdTransaccion;

function procesarTallerHorarioBath(){
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
		tallerHorarioTxBusiness.registrarTallerHorario(oParam);
//		var tallerHorarioTxBusinessBusinessResponse = tallerHorarioTxBusiness.registrarTallerHorario(oParam);
//		
//		utils.sendResponse(
//				sIdTransaccion,
//				tallerHorarioTxBusinessBusinessResponse.iCode, 
//				tallerHorarioTxBusinessBusinessResponse.sMessage, 
//				tallerHorarioTxBusinessBusinessResponse.oData );
		
	}finally{
		
	}
} 

//procesarTallerHorarioBath();