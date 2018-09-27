var textAccess = $.import("sap.hana.xs.i18n","text");
var bundle = textAccess.loadBundle("MitsuiAuditoriaPrd.I18n","messaje");
var config = textAccess.loadBundle("MitsuiAuditoriaPrd.Config","config");
var esquema = config.getText("bd.esquema");
var conn = $.hdb.getConnection();

function consultarAuditoria(oFiltro) {
	var rs;
	var oResponse = {};
	var aLsGenerica = [];
	var aParam = [];
	var aCampos = [
		  '"Id"',
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
	try {
		var pathQuery = 'select '+aCampos.join(",")+'  from '+esquema+'."Auditoria"  ' +
				'where 1=1 ';
		
		if(oFiltro.iId !== undefined && oFiltro.iId !== null && oFiltro.iId > 0){
			pathQuery = pathQuery + 'and "Id" = ? '; 
			aParam.push(oFiltro.iId);
		}
		
		aParam.unshift(pathQuery);
		rs  = conn.executeQuery.apply(conn, aParam);
		var result = rs.getIterator();
		var row;
		while(result.next()){
		    row = result.value();
		    aLsGenerica.push({
				"iId" 					: row.Id,
				"sIdTransaccion"		: row.IdTransaccion,
				"sTerminal"				: row.Terminal,
				"sUsuario" 				: row.Usuario,
				"sAplicacion" 			: row.Aplicacion,
				"sNombreProceso" 		: row.NombreProceso,
				"sProcesoPrincipal" 	: row.ProcesoPrincipal,
				"sProcesoOrden" 		: row.ProcesoOrden,
				"sFechaTransaccion" 	: row.FechaTransaccion,
				"iTiempoProceso" 		: row.TiempoProceso,
				"sEntradaProceso" 		: row.EntradaProceso,
				"sRespuestaProceso" 	: row.RespuestaProceso,
				"sEstado" 				: row.Estado
			});
		}
		
		if(aLsGenerica.length > 0){
			oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
			oResponse.sMessage = bundle.getText("msj.idf1");
			oResponse.oData = aLsGenerica;
		}else{
			oResponse.iCode = parseInt(bundle.getText("code.idf2"), 10);
			oResponse.sMessage = bundle.getText("msj.idf2");
		}
	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
		oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: consultarAuditoria - " + e.toString()]);
	} finally {
		conn.close();
	}
	return oResponse;
}