var textAccess 	= $.import("sap.hana.xs.i18n","text");
var bundle 		= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 		= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var esquema 	= config.getText("bd.esquema");
var conn 		= $.hdb.getConnection();

function consultarNoticiaxFiltro(oFiltro) {
	var rs;
	var oResponse 	= {};
	var aLsUsuario 	= [];
	var aParam 		= [];
	var aCampos 	= [ '"Id"', 
						'"IdCorrelativo"',
					    '"Titulo"',
					    '"Resumen"',
					    '"Imagen"',
					    '"FechaPublicacion"',
					    '"FechaExpiracion"',
					    '"TipoNoticia"',
					    '"Contenido"',
					    '"Url"',
					    '"FechaFuente"'
				    ];	
	var pathQuery;
	var filtroQuery = '';
	try {
		pathQuery 	= 'select '+aCampos.join(", ")+'  from '+esquema+'."VNoticias" where 1=1 ';
		
		
		pathQuery 	= pathQuery + filtroQuery + ' order by "FechaPublicacion" desc '; 
		aParam.unshift(pathQuery);
		rs  = conn.executeQuery.apply(conn, aParam);
		var result = rs.getIterator();
		var row;
		while(result.next()){
		    row = result.value();
		    
		    aLsUsuario.push({
				"iId" 					: row.Id,
				"iIdCorrelativo"		: parseInt(row.IdCorrelativo, 10),
				"sTitulo"				: row.Titulo,
				"sResumen"				: row.Resumen,
				"sImagen"			    : row.Imagen,
				"dFechaPublicacion" 	: row.FechaPublicacion,
				"dFechaExpiracion" 		: row.FechaExpiracion, 
				"sTipoNoticia" 			: row.TipoNoticia, 
				"sContenido" 			: row.Contenido, 
				"sUrl" 			        : row.Url, 
				"dFechaFuente" 			: row.FechaFuente
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
		oResponse.sMessage 	= bundle.getText("msj.idt1",["Metodo: consultarNoticiasxFiltro - " + e.toString()]);
	} 
	return oResponse;
}
