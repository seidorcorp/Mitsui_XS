var textAccess 	= $.import("sap.hana.xs.i18n","text");
var bundle 		= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 		= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var utils 		= $.import("MitsuiCitasPrd.Utils","Utils");
var esquema 	= config.getText("bd.esquema");
var conn 		= $.hdb.getConnection();

function registrarProducto(oParam) {
	var oResponse = {};
	var aCampos = [
				  '"Id"',
				  '"IdEstado"', 
				  '"UsuarioCreador"',
				  '"FechaCreacion"',
				  '"TerminalCreacion"',
				  '"CodigoSap"',
				  '"Descripcion"',
				  '"Puntos"',
				  '"Precio"',
				  '"Jerarquia"',
				  '"NombreImagen1"',
				  '"Imagen1"',
				  '"NombreImagen2"',
				  '"Imagen2"',
				  '"NombreImagen3"',
				  '"Imagen3"'
				];
	var pathQuery;
	try {
		var querySeq = 'select '+esquema+'."SQ_PRODUCTO".NEXTVAL as "Id" from "DUMMY" ';
		var seq  = conn.executeQuery(querySeq); 
		var Id = parseInt(seq[0].Id.toString(),10);
		
		pathQuery = 'INSERT INTO '+esquema+'."Producto" ('+aCampos.join(", ")+') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		var rs  =  conn.executeUpdate(pathQuery, 
				Id,
				oParam.oData.iIdEstado,
				oParam.oAuditRequest.sUsuario,
				new Date(oParam.oAuditRequest.dFecha),
				oParam.oAuditRequest.sTerminal,
				utils.convertEmptyToVacio(oParam.oData.sCodigoSap),
				utils.convertEmptyToVacio(oParam.oData.sDescripcion),
				utils.convertEmptyToVacio(oParam.oData.iPuntos),
				utils.convertEmptyToVacio(oParam.oData.fPrecio),
				utils.convertEmptyToVacio(oParam.oData.sJerarquia),
				utils.convertEmptyToVacio(oParam.oData.sNombreImagen1),
				utils.convertEmptyToVacio(oParam.oData.sImagen1),
				utils.convertEmptyToVacio(oParam.oData.sNombreImagen2),
				utils.convertEmptyToVacio(oParam.oData.sImagen2),
				utils.convertEmptyToVacio(oParam.oData.sNombreImagen3),
				utils.convertEmptyToVacio(oParam.oData.sImagen3)
				);
		conn.commit();
		if(rs > 0){
			oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idf1");
			oResponse.oData 	= Id;
		}else{
			oResponse.iCode = parseInt(bundle.getText("code.idf3"), 10);
			oResponse.sMessage = bundle.getText("msj.idf3");
		}
	} catch (e) {
		if(e.code===301){
			oResponse.iCode = parseInt(bundle.getText("code.idt11"), 10);
			oResponse.sMessage = bundle.getText("msj.idt11",[oParam.oData.sTitulo]);
		}else {
			oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: registrarProducto - " + e.toString()]);
		}
	} finally {
		conn.close();
	}
	return oResponse;
}

function registrarProductoMasivo(oParam) {
	var oResponse = {};
	var aItems	= [];
	var Id =0;
	var aCampos = [
				  '"Id"',
				  '"IdEstado"', 
				  '"UsuarioCreador"',
				  '"FechaCreacion"',
				  '"TerminalCreacion"',
				  '"CodigoSap"',
				  '"Descripcion"',
				  '"Puntos"',
				  '"Precio"',
				  '"Jerarquia"',
				  '"NombreImagen1"',
				  '"Imagen1"',
				  '"NombreImagen2"',
				  '"Imagen2"',
				  '"NombreImagen3"',
				  '"Imagen3"'
				];
	var pathQuery;
	try {
		
		oParam.oData.aItems.forEach(function(x){
			
			var querySeq 	= 'select '+esquema+'."SQ_PRODUCTO".NEXTVAL as "Id" from "DUMMY" ';
			var seq  		= conn.executeQuery(querySeq); 
			Id 				= parseInt(seq[0].Id.toString(),10);
			
			aItems.push([
					Id,
					parseInt(config.getText("id.estado.activo"), 10),
					oParam.oAuditRequest.sUsuario,
					new Date(oParam.oAuditRequest.dFecha),
					oParam.oAuditRequest.sTerminal,
					utils.convertEmptyToVacio(x.sCodigoSap),
					utils.convertEmptyToVacio(x.sDescripcion),
					utils.convertEmptyToZero(x.iPuntos),
					utils.convertEmptyToZero(x.fPrecio),
					utils.convertEmptyToVacio(x.sJerarquia),
					utils.convertEmptyToVacio(x.sNombreImagen1),
					utils.convertEmptyToVacio(x.sImagen1),
					utils.convertEmptyToVacio(x.sNombreImagen2),
					utils.convertEmptyToVacio(x.sImagen2),
					utils.convertEmptyToVacio(x.sNombreImagen3),
					utils.convertEmptyToVacio(x.sImagen3)
				]);
		});
		
		pathQuery = 'INSERT INTO '+esquema+'."Producto" ('+aCampos.join(", ")+') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		conn.executeUpdate(pathQuery, aItems);
		conn.commit();
		oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
		
	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
		oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: registrarProductoMasivo - " + e.toString()]);
	} 
	return oResponse;
}

function actualizarProducto(oParam) {
	var oResponse = {};

	var aCampos = [
				  '"IdEstado" 				= ?',
				  '"UsuarioModificador" 	= ?',
				  '"FechaModificacion" 		= ?',
				  '"TerminalModificacion" 	= ?',
				  '"CodigoSap" 				= ?',
				  '"Descripcion" 			= ?',
				  '"Puntos" 				= ?',
				  '"Precio" 				= ?',
				  '"Jerarquia" 				= ?',
				  '"NombreImagen1" 			= ?',
				  '"Imagen1" 				= ?',
				  '"NombreImagen2" 			= ?',
				  '"Imagen2" 				= ?',
				  '"NombreImagen3" 			= ?',
				  '"Imagen3" 				= ?'
				];
	
	var pathQuery;
	try {

		pathQuery = 'UPDATE  '+esquema+'."Producto"  SET  '+aCampos.join(", ")+' where "Id" = ? ';
		var rs  =  conn.executeUpdate(pathQuery,
				parseInt(oParam.oData.iIdEstado, 10),
				oParam.oAuditRequest.sUsuario,
				oParam.oAuditRequest.dFecha,
				oParam.oAuditRequest.sTerminal,
				utils.convertEmptyToVacio(oParam.oData.sCodigoSap),
				utils.convertEmptyToVacio(oParam.oData.sDescripcion),
				utils.convertEmptyToZero(oParam.oData.iPuntos),
				utils.convertEmptyToZero(oParam.oData.fPrecio),
				utils.convertEmptyToVacio(oParam.oData.sJerarquia),
				utils.convertEmptyToVacio(oParam.oData.sNombreImagen1),
				utils.convertEmptyToVacio(oParam.oData.sImagen1),
				utils.convertEmptyToVacio(oParam.oData.sNombreImagen2),
				utils.convertEmptyToVacio(oParam.oData.sImagen2),
				utils.convertEmptyToVacio(oParam.oData.sNombreImagen3),
				utils.convertEmptyToVacio(oParam.oData.sImagen3),
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
			oResponse.sMessage = bundle.getText("msj.idt11",[oParam.oData.sTitulo]);
		}else {
			oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: actualizarProducto - " + e.toString()]);
		}
	} finally {
		conn.close();
	}
	return oResponse;
}

function eliminarProducto(oParam) {
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
		
		pathQuery = 'UPDATE  '+esquema+'."Producto"  SET  '+aCampos.join(", ")+' where "Id" = ? ';
		conn.executeUpdate(pathQuery, aItems);
		conn.commit();
		oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
		
	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
		oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: eliminarProducto - " + e.toString()]);
	} finally {
		conn.close();
	}
	return oResponse;
}
