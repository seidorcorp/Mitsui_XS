var textAccess 	= $.import("sap.hana.xs.i18n","text");
var bundle 		= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 		= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var utils 		= $.import("MitsuiCitasPrd.Utils","Utils");
var esquema 	= config.getText("bd.esquema");
var conn 		= $.hdb.getConnection();

function registrarTaller(oParam) {
	var oResponse = {};
	var aCampos = [
				  '"Id"',
				  '"IdEstado"', 
				  '"UsuarioCreador"',
				  '"FechaCreacion"',
				  '"TerminalCreacion"',
				  '"CentroSap"',
				  '"Direccion"',
				  '"Central"',
				  '"Express"',
				  '"ServicioMantenimiento"',
				  '"Email"',
				  '"EmailCita"',
				  '"Latitud"',
				  '"Longitud"',
				  '"Horario1"',
				  '"Horario2"',
				  '"Horario3"',
				  '"Imagen"',
				  '"NombreImagen"',
				  '"Marca"'
				];
	var pathQuery;
	try {
		var querySeq = 'select '+esquema+'."SQ_TALLER".NEXTVAL as "Id" from "DUMMY" ';
		var seq  = conn.executeQuery(querySeq); 
		var Id = parseInt(seq[0].Id.toString(),10);
		
		pathQuery = 'INSERT INTO '+esquema+'."Taller" ('+aCampos.join(", ")+') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		var rs  =  conn.executeUpdate(pathQuery, 
				Id,
				oParam.oData.iIdEstado,
				oParam.oAuditRequest.sUsuario,
				new Date(oParam.oAuditRequest.dFecha),
				oParam.oAuditRequest.sTerminal,
				utils.convertEmptyToVacio(oParam.oData.sCentroSap),
				utils.convertEmptyToVacio(oParam.oData.sDireccion),
				utils.convertEmptyToVacio(oParam.oData.sCentral),
				utils.convertEmptyToVacio(oParam.oData.iExpress),
				utils.convertEmptyToVacio(oParam.oData.sServicioMantenimiento),
				utils.convertEmptyToVacio(oParam.oData.sEmail),
				utils.convertEmptyToVacio(oParam.oData.sEmailCita),
				utils.convertEmptyToVacio(oParam.oData.fLatitud),
				utils.convertEmptyToVacio(oParam.oData.fLongitud),
				utils.convertEmptyToVacio(oParam.oData.sHorario1),
				utils.convertEmptyToVacio(oParam.oData.sHorario2),
				utils.convertEmptyToVacio(oParam.oData.sHorario3),
				utils.convertEmptyToVacio(oParam.oData.sImagen),
				utils.convertEmptyToVacio(oParam.oData.sNombreImagen),
				utils.convertEmptyToVacio(oParam.oData.sMarcas)
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
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: registrarTaller - " + e.toString()]);
		}
	}  
	return oResponse;
}

function registrarTallerMasivo(oParam) {
	var oResponse = {};
	var aItems	= [];
	var Id =0;
	var aCampos = [
				  '"Id"',
				  '"IdEstado"', 
				  '"UsuarioCreador"',
				  '"FechaCreacion"',
				  '"TerminalCreacion"',
				  '"CentroSap"',
				  '"Direccion"',
				  '"Central"',
				  '"Express"',
				  '"ServicioMantenimiento"',
				  '"Email"',
				  '"EmailCita"',
				  '"Latitud"',
				  '"Longitud"',
				  '"Horario1"',
				  '"Horario2"',
				  '"Horario3"',
				  '"Imagen"',
				  '"Descripcion"',
				  '"NombreImagen"',
				  '"Marcas"'
				];
	var pathQuery;
	try {
		
		oParam.oData.aItems.forEach(function(x){
			
			var querySeq 	= 'select '+esquema+'."SQ_TALLER".NEXTVAL as "Id" from "DUMMY" ';
			var seq  		= conn.executeQuery(querySeq); 
			Id 				= parseInt(seq[0].Id.toString(),10);
			
			aItems.push([
					Id,
					parseInt(config.getText("id.estado.activo"), 10),
					oParam.oAuditRequest.sUsuario,
					new Date(oParam.oAuditRequest.dFecha),
					oParam.oAuditRequest.sTerminal,
					utils.convertEmptyToVacio(x.sCentroSap),
					utils.convertEmptyToVacio(x.sDireccion),
					utils.convertEmptyToVacio(x.sCentral),
					x.iExpress,
					utils.convertEmptyToVacio(x.sServicioMantenimiento),
					utils.convertEmptyToVacio(x.sEmail),
					utils.convertEmptyToVacio(x.sEmailCita),
					x.fLatitud,
					x.fLongitud,
					utils.convertEmptyToVacio(x.sHorario1),
					utils.convertEmptyToVacio(x.sHorario2),
					utils.convertEmptyToVacio(x.sHorario3),
					utils.convertEmptyToVacio(x.sImagen),
					utils.convertEmptyToVacio(x.sDescripcion),
					utils.convertEmptyToVacio(x.sNombreImagen),
					utils.convertEmptyToVacio(x.sMarcas)
				]);
		});
		
		pathQuery = 'INSERT INTO '+esquema+'."Taller" ('+aCampos.join(", ")+') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		conn.executeUpdate(pathQuery, aItems);
		conn.commit();
		oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
		
	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
		oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: registrarTallerMasivo - " + e.toString()]);
	} 
	return oResponse;
}

function actualizarTaller(oParam) {
	var oResponse = {};

	var aCampos = [
				  '"IdEstado" 				= ?',
				  '"UsuarioModificador" 	= ?',
				  '"FechaModificacion" 		= ?',
				  '"TerminalModificacion" 	= ?',
				  '"CentroSap" 				= ?',
				  '"Direccion" 				= ?',
				  '"Central" 				= ?',
				  '"Express" 				= ?',
				  '"ServicioMantenimiento" 	= ?',
				  '"Email" 					= ?',
				  '"EmailCita"				= ?',
				  '"Latitud"				= ?',
				  '"Longitud"				= ?',
				  '"Horario1"				= ?',
				  '"Horario2"				= ?',
				  '"Horario3"				= ?',
				  '"Imagen"					= ?',
				  '"NombreImagen"			= ?',
				  '"Marcas"					= ?'
				];
	
	var pathQuery;
	try {

		pathQuery = 'UPDATE  '+esquema+'."Taller"  SET  '+aCampos.join(", ")+' where "Id" = ? ';
		var rs  =  conn.executeUpdate(pathQuery,
				parseInt(oParam.oData.iIdEstado, 10),
				oParam.oAuditRequest.sUsuario,
				oParam.oAuditRequest.dFecha,
				oParam.oAuditRequest.sTerminal,
				utils.convertEmptyToVacio(oParam.oData.sCentroSap),
				utils.convertEmptyToVacio(oParam.oData.sDireccion),
				utils.convertEmptyToVacio(oParam.oData.sCentral),
				oParam.oData.iExpress,
				utils.convertEmptyToVacio(oParam.oData.sServicioMantenimiento),
				utils.convertEmptyToVacio(oParam.oData.sEmail),
				utils.convertEmptyToVacio(oParam.oData.sEmailCita),
				oParam.oData.fLatitud,
				oParam.oData.fLongitud,
				utils.convertEmptyToVacio(oParam.oData.sHorario1),
				utils.convertEmptyToVacio(oParam.oData.sHorario2),
				utils.convertEmptyToVacio(oParam.oData.sHorario3),
				utils.convertEmptyToVacio(oParam.oData.sImagen),
				utils.convertEmptyToVacio(oParam.oData.sNombreImagen),
				utils.convertEmptyToVacio(oParam.oData.sMarcas),
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
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: actualizarTaller - " + e.toString()]);
		}
	} finally {
		conn.close();
	}
	return oResponse;
}

function eliminarTaller(oParam) {
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
		
		pathQuery = 'UPDATE  '+esquema+'."Taller"  SET  '+aCampos.join(", ")+' where "Id" = ? ';
		conn.executeUpdate(pathQuery, aItems);
		conn.commit();
		oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
		
	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
		oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: eliminarTaller - " + e.toString()]);
	} finally {
		conn.close();
	}
	return oResponse;
}
