var textAccess 	= $.import("sap.hana.xs.i18n","text");
var bundle 		= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 		= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var utils 		= $.import("MitsuiCitasPrd.Utils","Utils");
var esquema 	= config.getText("bd.esquema");
var conn 		= $.hdb.getConnection();

function registrarCita(oParam) {
	var oResponse = {};
	var aCampos = [
				  '"Id"',
				  '"IdEstado"', 
				  '"UsuarioCreador"',
				  '"FechaCreacion"',
				  '"TerminalCreacion"',
				  '"IdCitaC4c"',
				  '"Placa"',
				  '"FechaCita"',
				  '"HoraCita"',
				  '"IdTaller"',
				  '"CodTaller"',
				  '"IdUsuario"',
				  '"NumIdentificacion"',
				  '"IdEstadoCita"',
				  '"Paquete"',
				  '"CodTipoServicio"',
				  '"CodServicioRealizar"',
				  '"Observacion"',
				  '"Express"',
				  '"Modelo"',
				  '"Marca"',
				  '"TipoValorTrabajo"',
				  '"IdModelo"',
				  '"IdClienteC4c"',
				  '"IdCita"',
				  '"ClienteComodin"',
				  '"IdCitaC4cReferencia"',
				  '"IdCitaReferencia"',
				  '"CitaReprogramada"',
				  '"NombreCliente"',
				  '"ExistePaquete"',
				  '"MedioContacto"',
				  '"CodFamilia"'
				];
	var pathQuery;
	try {
		var querySeq = 'select '+esquema+'."SQ_CITA".NEXTVAL as "Id" from "DUMMY" ';
		var seq  = conn.executeQuery(querySeq); 
		var Id = parseInt(seq[0].Id.toString(),10);
		
		pathQuery = 'INSERT INTO '+esquema+'."Cita" ('+aCampos.join(", ")+') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		var rs  =  conn.executeUpdate(pathQuery, 
				Id,
				oParam.oData.iIdEstado,
				oParam.oAuditRequest.sUsuario,
				new Date(oParam.oAuditRequest.dFecha),
				oParam.oAuditRequest.sTerminal,
				utils.convertEmptyToVacio(oParam.oData.sIdCitaC4c),
				utils.convertEmptyToVacio(oParam.oData.sPlaca),
				new Date(oParam.oData.sFechaCita),
				utils.convertEmptyToVacio(oParam.oData.sHoraCita),
				utils.convertEmptyToZero(oParam.oData.iIdTaller),
				utils.convertEmptyToVacio(oParam.oData.sCodTaller),
				utils.convertEmptyToZero(oParam.oData.iIdUsuario),
				utils.convertEmptyToVacio(oParam.oData.sNumIdentificacion),
				utils.convertEmptyToZero(oParam.oData.iIdEstadoCita),
				utils.convertEmptyToVacio(oParam.oData.sPaquete),
				utils.convertEmptyToVacio(oParam.oData.sCodigoTipoServicio),
				utils.convertEmptyToVacio(oParam.oData.sCodigoServicioRealizar),
				utils.convertEmptyToVacio(oParam.oData.sObservacion),
				utils.convertEmptyToZero(oParam.oData.iExpress),
				utils.convertEmptyToVacio(oParam.oData.sModelo),
				utils.convertEmptyToVacio(oParam.oData.sMarca),
				utils.convertEmptyToVacio(oParam.oData.sTipoValorTrabajo),
				utils.convertEmptyToVacio(oParam.oData.sIdModelo),
				utils.convertEmptyToVacio(oParam.oData.sIdClienteC4c),
				utils.convertEmptyToVacio(oParam.oData.iIdCita),
				utils.convertEmptyToZero(oParam.oData.iClienteComodin),
				utils.convertEmptyToVacio(oParam.oData.sIdCitaC4cReferencia),
				utils.convertEmptyToVacio(oParam.oData.sIdCitaReferencia),
				utils.convertEmptyToZero(oParam.oData.iCitaReprogramada),
				utils.convertEmptyToVacio(oParam.oData.sNomClienteComodin),
				utils.convertEmptyToZero(oParam.oData.iExistePaquete),
				utils.convertEmptyToVacio(oParam.oData.sMedioContacto),
				utils.convertEmptyToVacio(oParam.oData.sCodFamiliaVehiculo)
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
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: registrarCita - " + e.toString()]);
		}
	} finally {
		conn.close();
	}
	return oResponse;
}

function actualizarCita(oParam) {
	var oResponse = {};
	
	var aCampos = [
				  '"UsuarioModificador" 	= ?',
				  '"FechaModificacion" 		= ?',
				  '"TerminalModificacion" 	= ?',
				  '"IdCitaC4c" 				= ?',
				  '"Placa" 					= ?',
				  '"FechaCita" 				= ?',
				  '"HoraCita" 				= ?',
				  '"CodTaller" 				= ?',
				  '"IdUsuario"				= ?',
				  '"NumIdentificacion"		= ?',
				  '"CodTipoServicio"		= ?',
				  '"CodServicioRealizar"	= ?',
				  '"Observacion"			= ?',
				  '"Express"				= ?'
//				  '"Paquete" 				= ?',
//				  '"Modelo" 				= ?',
//				  '"Marca"					= ?',
//				  '"TipoValorTrabajo"		= ?',
//				  '"IdModelo"				= ?'
				  
				];
	var pathQuery;
	try {

		pathQuery = 'UPDATE  '+esquema+'."Cita"  SET  '+aCampos.join(", ")+' where "IdCitaC4c" = ? and "IdEstado" = 23 ';
		var rs  =  conn.executeUpdate(pathQuery,
				oParam.oAuditRequest.sUsuario,
				oParam.oAuditRequest.dFecha,
				oParam.oAuditRequest.sTerminal,
				utils.convertEmptyToVacio(oParam.oData.sIdCitaC4c),
				utils.convertEmptyToVacio(oParam.oData.sPlaca),
				new Date(oParam.oData.sFechaCita),
				utils.convertEmptyToVacio(oParam.oData.sHoraCita),
				utils.convertEmptyToVacio(oParam.oData.sCodTaller),
				utils.convertEmptyToVacio(oParam.oData.iIdUsuario),
				utils.convertEmptyToVacio(oParam.oData.sNumIdentificacion),
				utils.convertEmptyToVacio(oParam.oData.sCodigoTipoServicio),
				utils.convertEmptyToVacio(oParam.oData.sCodigoServicioRealizar),
				utils.convertEmptyToVacio(oParam.oData.sObservacion),
				utils.convertEmptyToZero(oParam.oData.iExpress),
//				utils.convertEmptyToVacio(oParam.oData.sPaquete),
//				utils.convertEmptyToVacio(oParam.oData.sModelo),
//				utils.convertEmptyToVacio(oParam.oData.sMarca),
//				utils.convertEmptyToVacio(oParam.oData.sTipoValorTrabajo),
//				utils.convertEmptyToVacio(oParam.oData.sIdModelo),
				oParam.oData.sIdCitaC4c
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
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: actualizarCita - " + e.toString()]);
		}
	} finally {
		conn.close();
	}
	return oResponse;
}



function actualizarEstadoCorreo(oParam) {
	var oResponse = {};
	
	var aCampos = [
				  '"EnvioEmail"		= ?',
				  
				];
	var pathQuery;
	try {
		pathQuery = 'UPDATE  '+esquema+'."Cita"  SET  '+aCampos.join(", ")+' where "Id" = ? ';
		var rs  =  conn.executeUpdate(pathQuery,
				oParam.iEnvioEmail,
				oParam.iId
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
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: actualizarEstadoCorreo - " + e.toString()]);
	}  
	return oResponse;
}

function actualizarEstadoEnvioOferta(oParam) {
	var oResponse = {};
	
	var aCampos = [
				  '"EnvioOferta"		= ?',
				  '"EstadoEnvioOferta"	= ?',
				  '"IdOferta"			= ?'
				];
	var pathQuery;
	try {
		pathQuery = 'UPDATE  '+esquema+'."Cita"  SET  '+aCampos.join(", ")+' where "Id" = ? ';
		var rs  =  conn.executeUpdate(pathQuery,
				oParam.iEnvioOferta,
				oParam.sEstadoEnvioOferta,
				oParam.sIdOferta,
				oParam.iId
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
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: actualizarEstadoEnvioOferta - " + e.toString()]);
	}  
	return oResponse;
}

function eliminarCita(oParam) {
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
					x.sIdCitaC4c
				]);
		});
		
		pathQuery = 'UPDATE  '+esquema+'."Cita"  SET  '+aCampos.join(", ")+' where "IdCitaC4c" = ? and "IdEstado" = 23';
		conn.executeUpdate(pathQuery, aItems);
		conn.commit();
		oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
		
	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
		oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: eliminarCita - " + e.toString()]);
	} 
	return oResponse;
}
