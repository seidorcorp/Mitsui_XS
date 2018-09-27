var textAccess = $.import("sap.hana.xs.i18n","text");
var bundle = textAccess.loadBundle("MitsuiAuditoriaPrd.I18n","messaje");
var config = textAccess.loadBundle("MitsuiAuditoriaPrd.Config","config");
var esquema = config.getText("bd.esquema");
var conn = $.hdb.getConnection();


function registrarAuditoria(oParam) {
	var oResponse = {};
	var aCampos = [
				  '"IdTransaccion"', 
				  '"Terminal"',
				  '"Usuario"', 
				  '"Aplicacion"',
				  '"NombreProceso"',
				  '"ProcesoPrincipal"',
				  '"ProcesoOrden"',
				  '"FechaTransaccion"',
				  '"TiempoProceso"',
				  '"EntradaProceso"',
				  '"RespuestaProceso"',
				  '"Metadata"',
				  '"Estado"'
				];
	var pathQuery;
	try {
		pathQuery = 'INSERT INTO '+esquema+'."Auditoria" ('+aCampos.join(", ")+') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
		var rs  =  conn.executeUpdate(pathQuery, 
				oParam.oAuditRequest.sIdTransaccion,
				oParam.oAuditRequest.sTerminal,
				oParam.oAuditRequest.sUsuario,
				oParam.oAuditRequest.sAplicacion,
				oParam.oData.sNombreProceso,
				oParam.oData.iProcesoPrincipal,
				oParam.oData.iProcesoOrden,
				new Date(oParam.oAuditRequest.dFecha),
				oParam.oData.iTiempoProceso,
				oParam.oData.sEntradaProceso,
				oParam.oData.sRespuestaProceso,
				oParam.oData.sMetadata,
				oParam.oData.sEstado
				);
		conn.commit();
		if(rs > 0){
			oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
			oResponse.sMessage = bundle.getText("msj.idf1");
		}else{
			oResponse.iCode = parseInt(bundle.getText("code.idf3"), 10);
			oResponse.sMessage = bundle.getText("msj.idf3");
		}
	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
		oResponse.sMessage = bundle.getText("msj.idt1",[e.toString()]);

	} finally {
		conn.close();
	}
	return oResponse;
}