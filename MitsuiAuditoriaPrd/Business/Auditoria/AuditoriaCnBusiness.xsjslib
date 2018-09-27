var textAccess 			= $.import("sap.hana.xs.i18n","text");
var bundle 				= textAccess.loadBundle("MitsuiAuditoriaPrd.I18n","messaje");
var config 				= textAccess.loadBundle("MitsuiAuditoriaPrd.Utils","config");
var utils 				= $.import("MitsuiAuditoriaPrd.Utils","Utils");
var auditoriaCnDao 		= $.import("MitsuiAuditoriaPrd.Dao.Auditoria","AuditoriaCnDao");
var oResponse 			= {};

function consultarAuditoria(oParam) {
	var consultarAuditoriaDao;
	var oFiltro = {};
	oFiltro.oData = {};
	try {
		oFiltro.oAuditRequest = oParam.oAuditRequest;
		//oFiltro.iId = oParam.oData.iId;

		// 1. Registrar Auditoria
		consultarAuditoriaDao = auditoriaCnDao.consultarAuditoria(oFiltro);
		if(consultarAuditoriaDao.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarAuditoriaDao.sMessage,'',consultarAuditoriaDao.iCode);
		}
		oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
		oResponse.oData		= consultarAuditoriaDao.oData;
	}catch(e){
		if (e instanceof TypeError) {
			oResponse.iCode = e.lineNumber;
			oResponse.sMessage = e.message;
		}else{
			oResponse.iCode = parseInt(bundle.getText("code.idt2"), 10);
			oResponse.sMessage = bundle.getText("msj.idt2",[e.toString()]);
		}	
	}
	return oResponse;
}