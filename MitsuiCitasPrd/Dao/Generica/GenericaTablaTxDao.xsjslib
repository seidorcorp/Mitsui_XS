var textAccess 	= $.import("sap.hana.xs.i18n","text");
var bundle 		= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 		= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var esquema 	= config.getText("bd.esquema");
var conn 		= $.hdb.getConnection();

function registrarTabla(oParam) {
	var oResponse 	= {};
	var aCampos 	= [
					  '"Id"',
					  '"IdEstado"',
					  '"UsuarioCreador"',
					  '"FechaCreacion"',
					  '"TerminalCreacion"',
					  '"CodigoTabla"',
					  '"DescripcionTabla"',
					  '"Tipo"'
				  	];
	var pathQuery;
	try {
		
		var querySeq = 'select '+esquema+'."SQ_GENERICA".NEXTVAL as "Id" from "DUMMY" ';
		var seq  	 = conn.executeQuery(querySeq); 
		var Id 	 	 = parseInt(seq[0].Id.toString(),10);
		
		pathQuery 	= 'INSERT INTO '+esquema+'."Generica" ('+aCampos.join(", ")+') VALUES (?,?,?,?,?,?,?,?)';
		var rs  	=  conn.executeUpdate(pathQuery,
						Id,
						oParam.oData.iIdEstado,
						oParam.oAuditRequest.sUsuario,
						new Date(oParam.oAuditRequest.dFecha),
						oParam.oAuditRequest.sTerminal,
						oParam.oData.sCodigoTabla,
						oParam.oData.sDescripcionTabla,
						oParam.oData.sTipo
						);
		conn.commit();
		if(rs > 0){
			oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idf1");
			oResponse.oData		= Id;
		}else{
			oResponse.iCode 	= parseInt(bundle.getText("code.idf3"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idf3");
		}
	} catch (e) {
		if(e.code===301){
			oResponse.iCode = bundle.getText("code.idt11");
			oResponse.sMessage = bundle.getText("msj.idt11",[oParam.oData.sCodigoTabla]);
		}else {
			oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: registrarTabla - " + e.toString()]);
		}
	} finally {
		conn.close();
	}
	return oResponse;
}

function actualizarTabla(oParam) {
	var oResponse 	= {};
	var aCampos 	= [
					  '"UsuarioModificador" = ?',
					  '"FechaModificacion" = ?',
					  '"TerminalModificacion" = ?',
					  '"CodigoTabla" = ?',
					  '"DescripcionTabla" = ?'
				  	];
	var pathQuery;
	try {
		
		pathQuery 	= 'UPDATE  '+esquema+'."Generica"  SET  '+aCampos.join(", ")+' where "CodigoTabla" = ? ';
		var rs  	=  conn.executeUpdate(pathQuery, 
						oParam.oAuditRequest.sUsuario,
						oParam.oAuditRequest.dFecha,
						oParam.oAuditRequest.sTerminal,
						oParam.oData.sCodigoTabla,
						oParam.oData.sDescripcionTabla,
						oParam.oData.sCodigoTablaAnterior
						);
		conn.commit();
		if(rs > 0){
			oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idf1");
		}else{
			oResponse.iCode 	= parseInt(bundle.getText("code.idf3"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idf3");
		}
	} catch (e) {
		if(e.code===301){
			oResponse.iCode = bundle.getText("code.idt11");
			oResponse.sMessage = bundle.getText("msj.idt11",[oParam.oData.sCodigoTabla]);
		}else {
			oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: actualizarTabla - " + e.toString()]);
		}
	} finally {
		conn.close();
	}
	return oResponse;
}

function eliminarTabla(oParam) {
	var oResponse 	= {};
	var aCampos 	= [
						'"UsuarioModificador" = ?',
						'"FechaModificacion" = ?',
						'"TerminalModificacion" = ?',
						'"IdTransaccion" = ?',
						'"IdEstado" = ?'
					];
	var pathQuery;
	try {
		
		pathQuery 	= 'UPDATE  '+esquema+'."Generica"  SET  '+aCampos.join(", ")+' where "CodigoTabla" = ?  and "IdEstado" <> 25 ';
		var rs  	=  conn.executeUpdate(pathQuery, 
						oParam.oAuditRequest.sUsuario,
						oParam.oAuditRequest.dFecha,
						oParam.oAuditRequest.sTerminal,
						oParam.oAuditRequest.sIdTransaccion,
						oParam.oData.iIdEstado,
						oParam.oData.sCodigoTabla
						);
		conn.commit();
		if(rs > 0){
			oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idf1");
		}else{
			oResponse.iCode 	= parseInt(bundle.getText("code.idf3"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idf3");
		}
	} catch (e) {
		oResponse.iCode 	= parseInt(bundle.getText("code.idt1"), 10);
		oResponse.sMessage 	= bundle.getText("msj.idt1",["Metodo: eliminarTabla - " + e.toString()]);
	} finally {
		conn.close();
	}
	return oResponse;
}