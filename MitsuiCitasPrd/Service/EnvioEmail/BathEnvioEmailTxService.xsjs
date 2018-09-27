var textAccess 					= $.import("sap.hana.xs.i18n","text");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var envioEmailCnBusiness 		= $.import("MitsuiCitasPrd.Business.Email","EnvioEmailCnBusiness");

var sIdTransaccion;

function enviarEmailBath(){
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
		envioEmailCnBusiness.enviarEmail(oParam);
//		var enviarEmailResponse = envioEmailCnBusiness.enviarEmail(oParam);
//		var bathActivacionTxBusinessResponse = bathActivacionTxBusiness.bathActivacion(oParam);
		
//		utils.sendResponse(
//				sIdTransaccion,
//				enviarEmailResponse.iCode, 
//				enviarEmailResponse.sMessage, 
//				enviarEmailResponse.oData );
		
	}finally{
		
	}
} 

//enviarEmailBath();