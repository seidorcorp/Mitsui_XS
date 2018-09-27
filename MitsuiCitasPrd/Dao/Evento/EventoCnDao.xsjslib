var textAccess 	= $.import("sap.hana.xs.i18n","text");
var bundle 		= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 		= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var esquema 	= config.getText("bd.esquema");
var conn 		= $.hdb.getConnection();

function consultarEventoxFiltro(oFiltro) {
	var rs;
	var oResponse 	= {};
	var aLsUsuario 	= [];
	var aParam 		= [];
	var aCampos 	= [ 
	                    '"Id"', 
					    '"IdEstado"',
					    '"Titulo"',
					    '"Locacion"',
					    '"Direccion"',
					    '"FechaPublicacion"',
					    '"FechaInicio"',
					    '"FechaFin"',
					    '"dFechaInicio"',
					    '"dFechaFin"',
					    '"HoraInicio"',
					    '"HoraFin"',
					    '"Imagen"',
					    '"Latitud"',
					    '"Longitud"',
					    '"NombreImagen"'
				    ];	
	var pathQuery;
	var filtroQuery = '';
	try {
		pathQuery 	= 'select '+aCampos.join(", ")+'  from '+esquema+'."VEvento" where 1=1 ';
		
		if(oFiltro.iIdEstado 			!== undefined 
				&& oFiltro.iIdEstado 	!== null 
				&& oFiltro.iIdEstado 	=== 23)
		{
			filtroQuery = filtroQuery + 'and  "IdEstado" = 23 ';
		}
		
		pathQuery 	= pathQuery + filtroQuery + ' order by "Id" desc '; 
		aParam.unshift(pathQuery);
		rs  = conn.executeQuery.apply(conn, aParam);
		var result = rs.getIterator();
		var row;
		while(result.next()){
		    row = result.value();
		    
		    aLsUsuario.push({
				"iId" 					: row.Id,
				"iIdEstado"				: row.IdEstado,
				"sTitulo" 				: row.Titulo, 
				"sLocacion" 			: row.Locacion, 
				"sDireccion" 			: row.Direccion, 
				"sFechaPublicacion" 	: row.FechaPublicacion, 
				"sFechaInicio" 			: row.FechaInicio, 
				"sFechaFin" 			: row.FechaFin,
				"dFechaInicio" 			: row.dFechaInicio, 
				"dFechaFin" 			: row.dFechaFin, 
				"sHoraInicio" 			: row.HoraInicio, 
				"sHoraFin" 				: row.HoraFin, 
				"sImagen" 			    : row.Imagen, 
				"iLatitud" 				: row.Latitud, 
				"iLongitud" 			: row.Longitud, 
				"sNombreImagen" 		: row.NombreImagen
			});
		}
		
		if(aLsUsuario.length > 0){
			oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idf1");
			oResponse.oData 	= aLsUsuario;
		}else{
			oResponse.iCode 	= parseInt(bundle.getText("code.idf2"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idf2");
		}
	} catch (e) {
		oResponse.iCode 	= parseInt(bundle.getText("code.idt1"), 10);
		oResponse.sMessage 	= bundle.getText("msj.idt1",["Metodo: consultarEventoxFiltro - " + e.toString()]);
	} 
	return oResponse;
}


function consultarEventoxFiltro2(oFiltro) {
	var rs;
	var oResponse 	= {};
	var aLsUsuario 	= [];
	var aParam 		= [];
	var aCampos 	= [ '"Id"', 
						'"IdEstado"',
					    '"Titulo"',
					    '"Locacion"',
					    '"Direccion"',
					    '"FechaPublicacion"',
					    '"FechaInicio"',
					    '"FechaFin"'
				    ];	
	var pathQuery;
	try {
		pathQuery 	= 'select '+aCampos.join(", ")+'  from '+esquema+'."Evento" where "IdEstado" != 25 ';
		
		if(oFiltro.iIdEstado !== undefined && oFiltro.iIdEstado !== null && oFiltro.iIdEstado > 0){
			pathQuery = pathQuery + 'and "IdEstado" = ? '; 
			aParam.push(oFiltro.iIdEstado);
		}
		aParam.unshift(pathQuery);
		rs  = conn.executeQuery.apply(conn, aParam);
		var result = rs.getIterator();
		var row;
		while(result.next()){
		    row = result.value();
		    
		    aLsUsuario.push({
				"iId" 					: row.Id,
				"iIdEstado"				: parseInt(row.IdEstado, 10),
				"sTitulo"				: row.Titulo,
				"sLocacion"				: row.Resumen,
				"sDireccion"			: row.Direccion,
				"dFechaPublicacion" 	: row.FechaPublicacion,
				"dFechaInicio" 			: row.FechaInicio, 
				"dFechaFin" 			: row.FechaFin
			});
		}
		
		if(aLsUsuario.length > 0){
			oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idf1");
			oResponse.oData 	= aLsUsuario;
		}else{
			oResponse.iCode 	= parseInt(bundle.getText("code.idf2"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idf2");
		}
	} catch (e) {
		oResponse.iCode 	= parseInt(bundle.getText("code.idt1"), 10);
		oResponse.sMessage 	= bundle.getText("msj.idt1",["Metodo: consultarEventoxFiltro2 - " + e.toString()]);
	} 
	return oResponse;
}
