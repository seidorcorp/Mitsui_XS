var textAccess 	= $.import("sap.hana.xs.i18n","text");
var bundle 		= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 		= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var esquema 	= config.getText("bd.esquema");
var conn 		= $.hdb.getConnection();

function consultarNoticiaExternaxFiltro(oFiltro) {
	var rs;
	var oResponse 	= {};
	var aLsUsuario 	= [];
	var aParam 		= [];
	var aCampos 	= [ '"Id"', 
						'"IdEstado"',
					    '"Titulo"',
					    '"Resumen"',
					    '"Url"',
					    '"FechaFuente"',
					    '"FechaPublicacion"',
					    '"FechaExpiracion"',
					    '"Imagen"',
					    '"NombreImagen"'
				    ];	
	var pathQuery;
	try {
		pathQuery 	= 'select '+aCampos.join(", ")+'  from '+esquema+'."NoticiaExterna" where "IdEstado" != 25 ';
		
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
				"sResumen"				: row.Resumen,
				"sUrl"			    	: row.Url,
				"dFechaFuente" 			: row.FechaFuente,
				"dFechaPublicacion" 	: row.FechaPublicacion, 
				"dFechaExpiracion" 		: row.FechaExpiracion, 
				"sImagen" 				: row.Imagen, 
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
		oResponse.sMessage 	= bundle.getText("msj.idt1",["Metodo: consultarNoticiaExternaxFiltro - " + e.toString()]);
	} 
	return oResponse;
}
