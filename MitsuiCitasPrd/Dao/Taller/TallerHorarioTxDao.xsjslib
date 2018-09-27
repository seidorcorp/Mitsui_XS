var textAccess 	= $.import("sap.hana.xs.i18n","text");
var bundle 		= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 		= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var utils 		= $.import("MitsuiCitasPrd.Utils","Utils");
var esquema 	= config.getText("bd.esquema");
var conn 		= $.hdb.getConnection();

function registrarTallerHorario(oParam) {
	var oResponse = {};
	var aCampos = [
				  '"IdEstado"', 
				  '"UsuarioCreador"',
				  '"FechaCreacion"',
				  '"TerminalCreacion"',
				  '"CodTaller"',
				  '"NumDia"',
				  '"Hora"',
				  '"Disponible"',
				  '"FechaInicioValidez"',
				  '"FechaFinValidez"'
				];
	var pathQuery;
	try {
		
		pathQuery = 'INSERT INTO '+esquema+'."TallerHorario" ('+aCampos.join(", ")+') VALUES (?,?,?,?,?,?,?,?,?,?)';
		var rs  =  conn.executeUpdate(pathQuery, 
				oParam.oData.iIdEstado,
				oParam.oAuditRequest.sUsuario,
				new Date(oParam.oAuditRequest.dFecha),
				oParam.oAuditRequest.sTerminal,
				utils.convertEmptyToVacio(oParam.oData.sCodTaller),
				utils.convertEmptyToZero(oParam.oData.iNumDia),
				utils.convertEmptyToVacio(oParam.oData.sHora),
				utils.convertEmptyToZero(oParam.oData.iDisponible),
				utils.convertEmptyToVacio(oParam.oData.sFechaInicioValidez),
				utils.convertEmptyToVacio(oParam.oData.sFechaFinValidez)
				);
		conn.commit();
		if(rs > 0){
			oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idf1");
		}else{
			oResponse.iCode = parseInt(bundle.getText("code.idf3"), 10);
			oResponse.sMessage = bundle.getText("msj.idf3");
		}
	} catch (e) {
		if(e.code===301){
			oResponse.iCode = parseInt(bundle.getText("code.idt11"), 10);
			oResponse.sMessage = bundle.getText("msj.idt11",[oParam.oData.sCodTaller]);
		}else {
			oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: registrarTallerHorario - " + e.toString()]);
		}
	}  
	return oResponse;
}

function actualizarTallerHorario(oParam) {
	var oResponse = {};

	var aCampos = [
				  '"IdEstado"               = ?', 
				  '"UsuarioModificador" 	= ?',
				  '"FechaModificacion" 		= ?',
				  '"TerminalModificacion" 	= ?',
				  '"Disponible" 			= ?',
				  '"FechaInicioValidez" 	= ?',
				  '"FechaFinValidez" 		= ?',
				];
	
	var pathQuery;
	try {

		pathQuery = 'UPDATE  '+esquema+'."TallerHorario"  SET  '+aCampos.join(", ")+' where "CodTaller" = ? and "NumDia" = ? and "Hora" = ? ';
		var rs  =  conn.executeUpdate(pathQuery,
				oParam.oData.iIdEstado,
				oParam.oAuditRequest.sUsuario,
				oParam.oAuditRequest.dFecha,
				oParam.oAuditRequest.sTerminal,
				utils.convertEmptyToZero(oParam.oData.iDisponible),
				utils.convertEmptyToVacio(oParam.oData.sFechaInicioValidez),
				utils.convertEmptyToVacio(oParam.oData.sFechaFinValidez),
				utils.convertEmptyToVacio(oParam.oData.sCodTaller),
				utils.convertEmptyToZero(oParam.oData.iNumDia),
				utils.convertEmptyToVacio(oParam.oData.sHora) 
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
			oResponse.sMessage = bundle.getText("msj.idt11",[oParam.oData.sCodTaller]);
		}else {
			oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: actualizarTallerHorario - " + e.toString()]);
		}
	}  
	return oResponse;
}

function eliminarTallerHorario(oParam) {
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
		
		pathQuery = 'UPDATE  '+esquema+'."TallerHorario"  SET  '+aCampos.join(", ")+' where "Id" = ? ';
		conn.executeUpdate(pathQuery, aItems);
		conn.commit();
		oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
		
	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
		oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: eliminarTallerHorario - " + e.toString()]);
	} 
	return oResponse;
}


function eliminarMasivoTallerHorario(oParam) {
	var oResponse = {};

	var aCampos = [
				  '"UsuarioModificador" 	= ?',
				  '"FechaModificacion" 		= ?',
				  '"TerminalModificacion" 	= ?',
				  '"IdEstado" 				= ?'
				];
	
	var pathQuery;
	try {

		pathQuery = 'UPDATE  '+esquema+'."TallerHorario"  SET  '+aCampos.join(", ");
		var rs  =  conn.executeUpdate(pathQuery,
				oParam.oAuditRequest.sUsuario,
				oParam.oAuditRequest.dFecha,
				oParam.oAuditRequest.sTerminal,
				parseInt(oParam.oData.iIdEstado, 10)
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
			oResponse.sMessage = bundle.getText("msj.idt11",["aliminarMasivoTallerHorario"]);
		}else {
			oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
			oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: aliminarMasivoTallerHorario - " + e.toString()]);
		}
	}  
	return oResponse;
}