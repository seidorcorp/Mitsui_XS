var textAccess 					= $.import("sap.hana.xs.i18n","text");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var bathActivacionTxBusiness 	= $.import("MitsuiCitasPrd.Business.BathActivacion","BathActivacionTxBusiness");

var sIdTransaccion;

function activacionesBath(){
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
		bathActivacionTxBusiness.bathActivacion(oParam);
//		var bathActivacionTxBusinessResponse = bathActivacionTxBusiness.bathActivacion(oParam);
//		
//		utils.sendResponse(
//				sIdTransaccion,
//				bathActivacionTxBusinessResponse.iCode, 
//				bathActivacionTxBusinessResponse.sMessage, 
//				bathActivacionTxBusinessResponse.oData );
		
	}finally{
		
	}
} 

//activacionesBath();