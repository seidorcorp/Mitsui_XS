var textAccess 	= $.import("sap.hana.xs.i18n","text");
var bundle 		= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 		= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var utils 		= $.import("MitsuiCitasPrd.Utils","Utils");
var esquema 	= config.getText("bd.esquema");
var conn 		= $.hdb.getConnection();

function registrarCampo(oParam) {
	var oResponse 	= {};
	var aCampos 	= [
					  '"Id"', 
					  '"IdEstado"', 
					  '"UsuarioCreador"',
					  '"FechaCreacion"',
					  '"TerminalCreacion"',
					  '"CodigoTabla"',
					  '"Campo"',
					  '"DescripcionCampo"',
					  '"CodigoSap"',
					  '"Orden"',
					  '"Fuente"',
					  '"Tipo"',
					  '"IdPadre"'
					];
	var pathQuery;
	var aItems	= [];
	var Id =0;
	try {
		
		oParam.oData.aItems.forEach(function(x){
			
			var querySeq 	= 'select '+esquema+'."SQ_GENERICA".NEXTVAL as "Id" from "DUMMY" ';
			var seq  		= conn.executeQuery(querySeq); 
			Id 				= parseInt(seq[0].Id.toString(),10);
			
			aItems.push([
					Id,
					parseInt(x.iIdEstado, 10),
					oParam.oAuditRequest.sUsuario,
					new Date(oParam.oAuditRequest.dFecha),
					oParam.oAuditRequest.sTerminal,
					x.sCodigoTabla,
					x.sCampo,
					x.sDescripcionCampo,
					x.sCodigoSap,
					utils.convertEmptyToZero(parseInt(x.iOrden, 10)),
					x.sFuente,
					x.sTipo,
					utils.convertEmptyToOne(parseInt(x.iIdPadre, 10))
				]);
		});
		
		pathQuery = 'INSERT INTO '+esquema+'."Generica" ('+aCampos.join(", ")+') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
		conn.executeUpdate(pathQuery, aItems);
		conn.commit();
		oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage 	= bundle.getText("msj.idf1");
		oResponse.oData		= Id;
		
	} catch (e) {
		if(e.code===301){
			oResponse.iCode = bundle.getText("code.idt11");
			oResponse.sMessage = bundle.getText("msj.idt11",[oParam.oData.aItems[0].sCampo]);
		}else {
			oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: registrarCampo - " + e.toString()]);
		}
	} 
	return oResponse;
}

function actualizarCampo(oParam) {
	var oResponse 	= {};
	var aCampos 	= [
					  '"UsuarioModificador" = ?',
					  '"FechaModificacion" = ?',
					  '"TerminalModificacion" = ?',
					  '"IdTransaccion" = ?',
					  '"Campo" = ?',
					  '"DescripcionCampo" = ?',
					  '"CodigoSap" = ?',
					  '"Orden" = ?',
					  '"Fuente" = ?',
					  '"IdEstado" = ?',
					  '"IdPadre" = ?'
					];
	var pathQuery;
	var aItems	= [];
	try {
		
		oParam.oData.aItems.forEach(function(x){
			aItems.push([
					oParam.oAuditRequest.sUsuario,
					new Date(oParam.oAuditRequest.dFecha),
					oParam.oAuditRequest.sTerminal,
					null,
					x.sCampo,
					x.sDescripcionCampo,
					x.sCodigoSap,
					utils.convertEmptyToZero(parseInt(x.iOrden, 10)),
					x.sFuente,
					parseInt(x.iIdEstado, 10),
					utils.convertEmptyToOne(parseInt(x.iIdPadre, 10)),
					parseInt(x.iId, 10)
				]);
		});
		
		pathQuery = 'UPDATE  '+esquema+'."Generica"  SET  '+aCampos.join(", ")+' where "Id" = ? ';
		conn.executeUpdate(pathQuery, aItems);
		conn.commit();
		oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage 	= bundle.getText("msj.idf1");
	} catch (e) {
		if(e.code===301){
			oResponse.iCode = bundle.getText("code.idt11");
			oResponse.sMessage = bundle.getText("msj.idt11",[aItems[0].sCampo]);
		}else {
			oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: actualizarCampo - " + e.toString()]);
		}
	}  
	return oResponse;
}

function eliminarCampo(oParam) {
	var oResponse 	= {};
	var aCampos 	= [
						'"UsuarioModificador" = ?',
						'"FechaModificacion" = ?',
						'"TerminalModificacion" = ?',
						'"IdTransaccion" = ?',
						'"IdEstado" = ?'
					];
	var pathQuery;
	var aItems	= [];
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
		
		pathQuery = 'UPDATE  '+esquema+'."Generica"  SET  '+aCampos.join(", ")+' where "Id" = ? ';
		conn.executeUpdate(pathQuery, aItems);
		conn.commit();
		oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage 	= bundle.getText("msj.idf1");
		
	} catch (e) {
		oResponse.iCode 	= parseInt(bundle.getText("code.idt1"), 10);
		oResponse.sMessage 	= bundle.getText("msj.idt1",["Metodo: eliminarCampo - " + e.toString()]);
	}  
	return oResponse;
}

function eliminarCampoTemporal(oParam) {
	var oResponse = {};
	var sTipo='C';
	var sFuente='SAP';
	var sIdTransaccion = '0000000000000';
	var iIdEstadoEliminado = 25;
	var aCampos = [
					'"UsuarioModificador" = ?',
					'"FechaModificacion" = ?',
					'"TerminalModificacion" = ?',
					'"IdTransaccion" = ?',
					'"IdEstado" = ?'
				];
	var pathQuery;
	try {
		
		pathQuery = 'UPDATE  '+esquema+'."Generica"  SET  '+aCampos.join(", ")+' where  "CodigoTabla" in (?,?,?,?,?,?,?,?,?,?) and "Tipo" = ? and "Fuente" = ? ';
		var rs  =  conn.executeUpdate(pathQuery, 
				oParam.oAuditRequest.sUsuario,
				oParam.oAuditRequest.dFecha,
				oParam.oAuditRequest.sTerminal,
				sIdTransaccion,
				iIdEstadoEliminado,
				oParam.aCodigoTabla[0],
				oParam.aCodigoTabla[1],
				oParam.aCodigoTabla[2],
				oParam.aCodigoTabla[3],
				oParam.aCodigoTabla[4],
				oParam.aCodigoTabla[5],
				oParam.aCodigoTabla[6],
				oParam.aCodigoTabla[7],
				oParam.aCodigoTabla[8],
				oParam.aCodigoTabla[9],
				sTipo,
				sFuente
				);
		conn.commit();
		if(rs > 0){
			oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
			oResponse.sMessage = bundle.getText("msj.idf1");
		}else{
			oResponse.iCode = parseInt(bundle.getText("code.idf17"), 10);
			oResponse.sMessage = bundle.getText("msj.idf17");
		}
	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
		oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: eliminarCampoTemporal - " + e.toString()]);
	} 
	return oResponse;
}