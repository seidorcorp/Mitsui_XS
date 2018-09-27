var textAccess 	= $.import("sap.hana.xs.i18n","text");
var bundle 		= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 		= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var utils 		= $.import("MitsuiCitasPrd.Utils","Utils");
var esquema 	= config.getText("bd.esquema");
var conn 		= $.hdb.getConnection();

function registrarUsuario(oParam) {
	var oResponse = {};
	var aCampos = [
				  '"Id"',
				  '"IdEstado"', 
				  '"UsuarioCreador"',
				  '"FechaCreacion"',
				  '"TerminalCreacion"',
				  '"Usuario"',
				  '"NumIdentificacion"',
				  '"Nombre"',
				  '"Apellido"',
				  '"Email"',
				  '"FechaNacimiento"',
				  '"IdTipoUsuario"',
				  '"Aplicacion"',
				  '"Telefono"'
				];
	var pathQuery;
	try {
		var querySeq = 'select '+esquema+'."SQ_USUARIO".NEXTVAL as "Id" from "DUMMY" ';
		var seq  = conn.executeQuery(querySeq); 
		var Id = parseInt(seq[0].Id.toString(),10);
		
		pathQuery = 'INSERT INTO '+esquema+'."Usuario" ('+aCampos.join(", ")+') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		var rs  =  conn.executeUpdate(pathQuery, 
				Id,
				oParam.oData.iIdEstado,
				oParam.oAuditRequest.sUsuario,
				new Date(oParam.oAuditRequest.dFecha),
				oParam.oAuditRequest.sTerminal,
				oParam.oData.sUsuario,
				oParam.oData.sNumIdentificacion,
				oParam.oData.sNombre,
				oParam.oData.sApellido,
				oParam.oData.sEmail,
				utils.convertEmptyToVacio(oParam.oData.dFechaNacimiento),
				oParam.oData.iIdTipoUsuario,
				oParam.oData.sAplicacion,
				utils.convertEmptyToVacio(oParam.oData.sTelefono)
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
			oResponse.sMessage = bundle.getText("msj.idt11",[oParam.oData.sEmail]);
		}else {
			oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: registrarUsuario - " + e.toString()]);
		}
	} 
	return oResponse;
}

function actualizarUsuario(oParam) {
	var oResponse = {};
	var aCampos = [
				  '"IdEstado" = ?',
				  '"UsuarioModificador" = ?',
				  '"FechaModificacion" = ?',
				  '"TerminalModificacion" = ?',
				  '"Usuario" = ?',
				  '"NumIdentificacion" = ?',
				  '"Nombre" = ?',
				  '"Apellido" = ?',
				  '"FechaNacimiento" = ?',
				  '"IdTipoUsuario" = ?',
				  '"Telefono" = ?'
				];
	var pathQuery;
	try {

		pathQuery = 'UPDATE  '+esquema+'."Usuario"  SET  '+aCampos.join(", ")+' where "Id" = ? ';
		var rs  =  conn.executeUpdate(pathQuery,
				parseInt(oParam.oData.iIdEstado, 10),
				oParam.oAuditRequest.sUsuario,
				oParam.oAuditRequest.dFecha,
				oParam.oAuditRequest.sTerminal,
				utils.convertEmptyToVacio(oParam.oData.sUsuario),
				utils.convertEmptyToVacio(oParam.oData.sNumIdentificacion),
				utils.convertEmptyToVacio(oParam.oData.sNombre),
				utils.convertEmptyToVacio(oParam.oData.sApellido),
				utils.convertEmptyToVacio(oParam.oData.dFechaNacimiento),
				oParam.oData.iIdTipoUsuario,
				utils.convertEmptyToVacio(oParam.oData.sTelefono),
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
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: actualizarUsuario - " + e.toString()]);
		}
	} 
	return oResponse;
}

function eliminarUsuario(oParam) {
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
		
		pathQuery = 'UPDATE  '+esquema+'."Usuario"  SET  '+aCampos.join(", ")+' where "Id" = ? ';
		conn.executeUpdate(pathQuery, aItems);
		conn.commit();
		oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
		
	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
		oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: eliminarUsuario - " + e.toString()]);
	} 
	return oResponse;
}

function activarBloquearUsuario(oParam) {
	var oResponse = {};
	var aCampos = [
					'"UsuarioModificador" = ?',
					'"FechaModificacion" = ?',
					'"TerminalModificacion" = ?',
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
					parseInt(x.iIdEstado, 10),
					parseInt(x.iId, 10)
				]);
		});
		
		pathQuery = 'UPDATE  '+esquema+'."Usuario"  SET  '+aCampos.join(", ")+' where "Id" = ? ';
		conn.executeUpdate(pathQuery, aItems);
		conn.commit();
		oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
		
	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
		oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: activarBloquearUsuario - " + e.toString()]);
	} 
	return oResponse;
}