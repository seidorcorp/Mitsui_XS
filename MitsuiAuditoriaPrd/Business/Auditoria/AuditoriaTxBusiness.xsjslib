var textAccess 		= $.import("sap.hana.xs.i18n","text");
var bundle 			= textAccess.loadBundle("MitsuiAuditoriaPrd.I18n","messaje");
var config 			= textAccess.loadBundle("MitsuiAuditoriaPrd.Utils","config");
var utils 			= $.import("MitsuiAuditoriaPrd.Utils","Utils");
var auditoriaTxDao 	= $.import("MitsuiAuditoriaPrd.Dao.Auditoria","AuditoriaTxDao");
var oResponse 		= {};

function registrarAuditoria(oParam) {
	var registrarAuditoriaDao;
	var oFiltro = {};
	oFiltro.oData = {};
	try {
		oFiltro.oAuditRequest = oParam.oAuditRequest;
		oFiltro.oData.sNombreProceso = oParam.oData.sNombreProceso;
		oFiltro.oData.iProcesoPrincipal = utils.convertEmptyToOne(parseInt(oParam.oData.iProcesoPrincipal,10));
		oFiltro.oData.iProcesoOrden = utils.convertEmptyToZero(parseInt(oParam.oData.iProcesoOrden,10));
		oFiltro.oData.iTiempoProceso = utils.convertEmptyToOne(parseInt(oParam.oData.iTiempoProceso, 10));
		oFiltro.oData.sEntradaProceso = oParam.oData.sEntradaProceso;
		oFiltro.oData.sRespuestaProceso = oParam.oData.sRespuestaProceso;
		oFiltro.oData.sMetadata = oParam.oData.sMetadata;
		oFiltro.oData.sEstado = oParam.oData.sEstado;
		
		// 1. Registrar Auditoria
		registrarAuditoriaDao = auditoriaTxDao.registrarAuditoria(oFiltro);
		if(registrarAuditoriaDao.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(registrarAuditoriaDao.sMessage,'',registrarAuditoriaDao.iCode);
		}
		oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
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