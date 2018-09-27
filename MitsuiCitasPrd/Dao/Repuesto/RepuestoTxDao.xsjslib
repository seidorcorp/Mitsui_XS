var textAccess 	= $.import("sap.hana.xs.i18n","text");
var bundle 		= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 		= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var utils 		= $.import("MitsuiCitasPrd.Utils","Utils");
var esquema 	= config.getText("bd.esquema");
var conn 		= $.hdb.getConnection();

function registrarRepuesto(oParam) {
	var oResponse = {};
	var aCampos = [
				'"Id"',
				'"IdEstado"',
				'"UsuarioCreador"',
				'"FechaCreacion"',
                '"TerminalCreacion"',
                '"CodigoSap"',
                '"Descripcion"',
                '"Precio"',
                '"Marca"',
                '"Modelo"',
                '"AnioInicio"',
                '"AnioFin"',
                '"Descuento"',
                '"Imagen"',
                '"Tipo"',
                '"NombreImagen"',
                '"LinkInformacion"'
	];

	var pathQuery;
	try {
		var querySeq = 'select '+esquema+'."SQ_REPUESTO".NEXTVAL as "Id" from "DUMMY" ';
		var seq  = conn.executeQuery(querySeq); 
		var Id = parseInt(seq[0].Id.toString(),10);
		
		pathQuery = 'INSERT INTO '+esquema+'."Repuesto" ('+aCampos.join(", ")+') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		var rs  =  conn.executeUpdate(pathQuery, 
				Id,
				oParam.oData.iIdEstado,
				oParam.oAuditRequest.sUsuario,
				new Date(oParam.oAuditRequest.dFecha),
				oParam.oAuditRequest.sTerminal,
				utils.convertEmptyToVacio(oParam.oData.sCodigoSap),
				utils.convertEmptyToVacio(oParam.oData.sDescripcion),
				utils.convertEmptyToVacio(oParam.oData.fPrecio),
				utils.convertEmptyToVacio(oParam.oData.sMarca),
				utils.convertEmptyToVacio(oParam.oData.sModelo),
				utils.convertEmptyToVacio(oParam.oData.iAnioInicio),
                utils.convertEmptyToVacio(oParam.oData.iAnioFin),
                utils.convertEmptyToVacio(oParam.oData.iDescuento),
                utils.convertEmptyToVacio(oParam.oData.sImagen),
                utils.convertEmptyToVacio(oParam.oData.sTipo),
                utils.convertEmptyToVacio(oParam.oData.sNombreImagen),
                utils.convertEmptyToVacio(oParam.oData.sLinkInformacion)
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
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: registrarRepuesto - " + e.toString()]);
		}
	} finally {
		conn.close();
	}
	return oResponse;
}

function registrarRepuestoMasivo(oParam) {
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
		        '"Precio"',
		        '"Marca"',
		        '"Modelo"',
		        '"AnioInicio"',
		        '"AnioFin"',
		        '"Descuento"',
		        '"Imagen"',
		        '"TipoProducto"',
		        '"Tipo"',
		        '"NombreImagen"',
                '"LinkInformacion"'
				];
	var pathQuery;
	try {
		
		oParam.oData.aItems.forEach(function(x){
			
			var querySeq 	= 'select '+esquema+'."SQ_REPUESTO".NEXTVAL as "Id" from "DUMMY" ';
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
					x.fPrecio,
					utils.convertEmptyToVacio(x.sMarca),
					utils.convertEmptyToVacio(x.sModelo),
					utils.convertEmptyToZero(x.iAnioInicio),
					utils.convertEmptyToZero(x.iAnioFin),
					utils.convertEmptyToZero(x.iDescuento),
	                utils.convertEmptyToVacio(x.sImagen),
	                utils.convertEmptyToVacio(x.sTipoProducto),
	                utils.convertEmptyToVacio(x.sTipo),
	                utils.convertEmptyToVacio(x.sNombreImagen),
	                utils.convertEmptyToVacio(x.sLinkInformacion)
				]);
		});
		
		pathQuery = 'INSERT INTO '+esquema+'."Repuesto" ('+aCampos.join(", ")+') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		conn.executeUpdate(pathQuery, aItems);
		conn.commit();
		oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
		
	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
		oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: registrarRepuestoMasivo - " + e.toString()]);
	} 
	return oResponse;
}

function actualizarRepuesto(oParam) {
    var oResponse = {};
    
    var aCampos = [
				        '"IdEstado"				= ?',
				        '"UsuarioModificador"	= ?',
				        '"FechaModificacion" 	= ?',
				        '"TerminalModificacion" = ?',
				        '"CodigoSap" 			= ?',
				        '"Descripcion" 			= ?',
				        '"Precio" 				= ?',
				        '"Marca" 				= ?',
				        '"Modelo" 				= ?',
				        '"AnioInicio" 			= ?',
				        '"AnioFin" 				= ?',
				        '"Descuento" 			= ?',
				        '"Imagen" 				= ?',
				        '"Tipo" 				= ?',
				        '"NombreImagen"			= ?',
				        '"LinkInformacion"		= ?'
				];
    
	var pathQuery;
	try {

		pathQuery = 'UPDATE  '+esquema+'."Repuesto"  SET  '+aCampos.join(", ")+' where "Id" = ? ';
		var rs  =  conn.executeUpdate(pathQuery,
				parseInt(oParam.oData.iIdEstado, 10),
				oParam.oAuditRequest.sUsuario,
				new Date(oParam.oAuditRequest.dFecha),
				oParam.oAuditRequest.sTerminal,
				utils.convertEmptyToVacio(oParam.oData.sCodigoSap),
				utils.convertEmptyToVacio(oParam.oData.sDescripcion),
				utils.convertEmptyToZero(oParam.oData.fPrecio),
				utils.convertEmptyToVacio(oParam.oData.sMarca),
				utils.convertEmptyToVacio(oParam.oData.sModelo),
				utils.convertEmptyToZero(oParam.oData.iAnioInicio),
				utils.convertEmptyToZero(oParam.oData.iAnioFin),
				utils.convertEmptyToZero(oParam.oData.iDescuento),
                utils.convertEmptyToVacio(oParam.oData.sImagen),  
                utils.convertEmptyToVacio(oParam.oData.sTipo),
                utils.convertEmptyToVacio(oParam.oData.sNombreImagen),
                utils.convertEmptyToVacio(oParam.oData.sLinkInformacion),
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
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: actualizarRepuesto - " + e.toString()]);
		}
	} finally {
		conn.close();
	}
	return oResponse;
}

function eliminarRepuesto(oParam) {
	var oResponse = {};
	var aCampos = [
					'"UsuarioModificador" 	= ?',
					'"FechaModificacion" 	= ?',
					'"TerminalModificacion" = ?',
					'"IdTransaccion" 		= ?',
					'"IdEstado" 			= ?'
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
		
		pathQuery = 'UPDATE  '+esquema+'."Repuesto"  SET  '+aCampos.join(", ")+' where "Id" = ? ';
		conn.executeUpdate(pathQuery, aItems);
		conn.commit();
		oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
		
	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
		oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: eliminarRepuesto - " + e.toString()]);
	} finally {
		conn.close();
	}
	return oResponse;
}

