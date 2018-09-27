var textAccess 		= $.import("sap.hana.xs.i18n","text");
var bundle 			= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 			= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var utils 			= $.import("MitsuiCitasPrd.Utils","Utils");
var esquema 		= config.getText("bd.esquema");
var conn 			= $.hdb.getConnection();

function registrarNoticiaInterna(oParam) {
	var oResponse = {};
	var aCampos = [
				'"Id"', 
			    '"IdEstado"',
			    '"UsuarioCreador"',
			    '"FechaCreacion"',
			    '"TerminalCreacion"',
			    '"Titulo"',
			    '"Resumen"',
			    '"Imagen"',
			    '"FechaPublicacion"',
			    '"FechaExpiracion"',
			    '"Contenido"',
			    '"NombreImagen"'
				];
	var pathQuery;
	try {
		var querySeq = 'select '+esquema+'."SQ_NOTICIAINTERNA".NEXTVAL as "Id" from "DUMMY" ';
		var seq  = conn.executeQuery(querySeq); 
		var Id = parseInt(seq[0].Id.toString(),10);
		
		pathQuery = 'INSERT INTO '+esquema+'."NoticiaInterna" ('+aCampos.join(", ")+') VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
		var rs  =  conn.executeUpdate(pathQuery, 
				Id,
				oParam.oData.iIdEstado,
				oParam.oAuditRequest.sUsuario,
				new Date(oParam.oAuditRequest.dFecha),
				oParam.oAuditRequest.sTerminal,
				utils.convertEmptyToVacio(oParam.oData.sTitulo),
				utils.convertEmptyToVacio(oParam.oData.sResumen),
				utils.convertEmptyToVacio(oParam.oData.sImagen),
				utils.convertEmptyToVacio(oParam.oData.dFechaPublicacion),
				utils.convertEmptyToVacio(oParam.oData.dFechaExpiracion),
				utils.convertEmptyToVacio(oParam.oData.Contenido),
				utils.convertEmptyToVacio(oParam.oData.sNombreImagen)
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
			oResponse.sMessage = bundle.getText("msj.idt11",[oParam.oData.sUsuarioSap]);
		}else {
			oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: registrarNoticiaInterna - " + e.toString()]);
		}
	} finally {
		conn.close();
	}
	return oResponse;
}

function actualizarNoticiaInterna(oParam) {
	var oResponse = {};
	var aCampos = [
				  '"IdEstado" = ?',
			      '"UsuarioModificador" = ?',
			      '"FechaModificacion" = ?',
			      '"TerminalModificacion" = ?',
			      '"Titulo" = ?',
			      '"Resumen" = ?',
			      '"Imagen" = ?',
			      '"FechaPublicacion" = ?',
			      '"FechaExpiracion" = ?',
			      '"Contenido" = ?',
			      '"NombreImagen" = ?'
				];
	var pathQuery;
	try {

		pathQuery = 'UPDATE  '+esquema+'."NoticiaInterna"  SET  '+aCampos.join(", ")+' where "Id" = ? ';
		var rs  =  conn.executeUpdate(pathQuery,
				parseInt(oParam.oData.iIdEstado, 10),
				oParam.oAuditRequest.sUsuario,
				oParam.oAuditRequest.dFecha,
				oParam.oAuditRequest.sTerminal,
				utils.convertEmptyToVacio(oParam.oData.sTitulo),
				utils.convertEmptyToVacio(oParam.oData.sResumen),
				utils.convertEmptyToVacio(oParam.oData.sImagen),
				utils.convertEmptyToVacio(oParam.oData.dFechaPublicacion),
				utils.convertEmptyToVacio(oParam.oData.dFechaExpiracion),
				utils.convertEmptyToVacio(oParam.oData.sContenido),
				utils.convertEmptyToVacio(oParam.oData.sNombreImagen),
				utils.convertEmptyToVacio(oParam.oData.iId)
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
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: actualizarNoticiaInterna - " + e.toString()]);
		}
	} finally {
		conn.close();
	}
	return oResponse;
}
 
function actualizarEstadoNoticiaInterna(oParam) {
	var oResponse = {};
	var aCampos = [
				  '"IdEstado" = ?',
			      '"UsuarioModificador" = ?',
			      '"FechaModificacion" = ?',
			      '"TerminalModificacion" = ?'
				];
	var pathQuery;
	try {

		pathQuery = 'UPDATE  '+esquema+'."NoticiaInterna"  SET  '+aCampos.join(", ")+' where "Id" = ? ';
		var rs  =  conn.executeUpdate(pathQuery,
				parseInt(oParam.oData.iIdEstado, 10),
				oParam.oAuditRequest.sUsuario,
				oParam.oAuditRequest.dFecha,
				oParam.oAuditRequest.sTerminal,
				utils.convertEmptyToVacio(oParam.oData.iId)
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
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: actualizarEstadoNoticiaInterna - " + e.toString()]);
		}
	} 
	return oResponse;
}


function eliminarNoticiaInterna(oParam) {
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
					utils.generarIdTransaccion(),
					parseInt(x.iIdEstado, 10),
					parseInt(x.iId, 10)
				]);
		});
		
		pathQuery = 'UPDATE  '+esquema+'."NoticiaInterna"  SET  '+aCampos.join(", ")+' where "Id" = ? ';
		conn.executeUpdate(pathQuery, aItems);
		conn.commit();
		oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
		
	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
		oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: eliminarNoticiaInterna - " + e.toString()]);
	} finally {
		conn.close();
	}
	return oResponse;
}
