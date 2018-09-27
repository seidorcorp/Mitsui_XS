var textAccess 	= $.import("sap.hana.xs.i18n","text");
var bundle 		= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 		= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var utils 		= $.import("MitsuiCitasPrd.Utils","Utils");
var esquema 	= config.getText("bd.esquema");
var conn 		= $.hdb.getConnection();

function registrarNotificacion(oParam) {
	var oResponse = {};
	var aCampos = [
				'"Id"',
				'"IdEstado"',
				'"UsuarioCreador"',
				'"FechaCreacion"',
				'"TerminalCreacion"',
				'"NotificacionesFecha"',
				'"NotificacionesLink"',
				'"IdModulo"',
				'"Mensaje"',
				'"TipoNotificacion"',
				'"IdEstadoNotificacion"',
				'"Archivo"'
	];

	var pathQuery;
	try {
		var querySeq = 'select '+esquema+'."SQ_NOTIFICACION".NEXTVAL as "Id" from "DUMMY" ';
		var seq  = conn.executeQuery(querySeq); 
		var Id = parseInt(seq[0].Id.toString(),10);
		
		pathQuery = 'INSERT INTO '+esquema+'."Notificacion" ('+aCampos.join(", ")+') VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
		var rs  =  conn.executeUpdate(pathQuery, 
				Id,
				oParam.oData.iIdEstado,
				oParam.oAuditRequest.sUsuario,
				new Date(oParam.oAuditRequest.dFecha),
				oParam.oAuditRequest.sTerminal,
				utils.convertEmptyToVacio(oParam.oData.dNotificacionesFecha),
				utils.convertEmptyToVacio(oParam.oData.sNotificacionesLink),
				utils.convertEmptyToZero(oParam.oData.iIdModulo),
				utils.convertEmptyToVacio(oParam.oData.sMensaje),
				utils.convertEmptyToVacio(oParam.oData.sTipoNotificacion),
				utils.convertEmptyToZero(oParam.oData.iIdEstadoNotificacion),
				utils.convertEmptyToVacio(oParam.oData.sNombreArchivo)
				);
		conn.commit();
		if(rs > 0){
			oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
			oResponse.sMessage = bundle.getText("msj.idf1");
			oResponse.oData = Id;
		}else{
			oResponse.iCode = parseInt(bundle.getText("code.idf3"), 10);
			oResponse.sMessage = bundle.getText("msj.idf3");
		}
	} catch (e) {
		if(e.code===301){
			oResponse.iCode = parseInt(bundle.getText("code.idt11"), 10);
			oResponse.sMessage = bundle.getText("msj.idt11",[oParam.oData.sIdModulo]);
		}else {
			oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: registrarNotificacion - " + e.toString()]);
		}
	} finally {
		conn.close();
	}
	return oResponse;
}


function actualizarNotificacion(oParam) {
    var oResponse = {};
    var aCampos = [
					'"IdEstado" = ?',
					'"UsuarioModificador" = ?',
					'"FechaModificacion" = ?',
					'"TerminalModificacion" = ?',
					'"IdEstadoNotificacion" = ?'
    ];
    
	var pathQuery;
	try {

		pathQuery = 'UPDATE  '+esquema+'."Notificacion"  SET  '+aCampos.join(", ")+' where "Id" = ? ';
		var rs  =  conn.executeUpdate(pathQuery,
				parseInt(oParam.oData.iIdEstado, 10),
				oParam.oAuditRequest.sUsuario,
				new Date(oParam.oAuditRequest.dFecha),
				oParam.oAuditRequest.sTerminal,
				utils.convertEmptyToZero(oParam.oData.iIdEstadoNotificacion),
				oParam.oData.iId
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
		if(e.code===301){
			oResponse.iCode = parseInt(bundle.getText("code.idt11"), 10);
			oResponse.sMessage = bundle.getText("msj.idt11",[oParam.oData.sUsuarioSap]);
		}else {
			oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: actualizarNotificacion - " + e.toString()]);
		}
	} finally {
		conn.close();
	}
	return oResponse;
}

function eliminarNotificacion(oParam) {
	var oResponse = {};
	var aCampos = [
					'"UsuarioModificador" = ?',
					'"FechaModificacion" = ?',
					'"TerminalModificacion" = ?',
					'"IdTransaccion" = ?',
					'"IdEstado" = ?'
				];
	var pathQuery;
	var aItems=[];
	try {
		oParam.oData.aItems.forEach(function(x){
			aItems.push([
					oParam.oAuditRequest.sUsuario,
					new Date(oParam.oAuditRequest.dFecha),
					oParam.oAuditRequest.sTerminal,
					oParam.oAuditRequest.sIdTransaccion,
					parseInt(x.iIdEstado, 10),
					parseInt(x.iId, 10)
				]);
		});
		
		pathQuery = 'UPDATE  '+esquema+'."Notificacion"  SET  '+aCampos.join(", ")+' where "Id" = ? ';
		conn.executeUpdate(pathQuery, aItems);
		conn.commit();
		oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
		
	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
		oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: eliminarNotificacion - " + e.toString()]);
	} finally {
		conn.close();
	}
	return oResponse;
}

