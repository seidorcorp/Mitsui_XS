var textAccess 	= $.import("sap.hana.xs.i18n","text");
var bundle 		= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 		= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var esquema 	= config.getText("bd.esquema");
var conn 		= $.hdb.getConnection();

function consultarNoticiaInternaxFiltro(oFiltro) {
	var rs;
	var oResponse 	= {};
	var aLsUsuario 	= [];
	var aParam 		= [];
	var aCampos 	= [ '"Id"', 
					    '"IdEstado"',
					    '"UsuarioCreador"',
					    '"FechaCreacion"',
					    '"TerminalCreacion"',
					    '"UsuarioModificador"',
					    '"FechaModificacion"',
					    '"TerminalModificacion"',
					    '"IdTransaccion"',
					    '"Titulo"',
					    '"Resumen"',
					    '"Imagen"',
					    '"FechaPublicacion"',
					    '"FechaExpiracion"',
					    '"Contenido"'
				    ];	
	var pathQuery;
	var filtroQuery = '';
	try {
		pathQuery 	= 'select '+aCampos.join(", ")+'  from '+esquema+'."NoticiaInterna" ';
		
		if(oFiltro.iIdEstado 			!== undefined 
				&& oFiltro.iIdEstado 	!== null 
				&& oFiltro.iIdEstado 	=== 23)
		{
			filtroQuery = filtroQuery + 'and  "IdEstado" = 23 ';
		}
		
		if(oFiltro.iId 			!== undefined 
				&& oFiltro.iId 	!== null 
				&& oFiltro.iId 	> 0)
		{
			filtroQuery = filtroQuery + 'and "Id"= ? ';
			aParam.push(oFiltro.iId);
		}
		
		if(oFiltro.sUsuario 			!== undefined 
				&& oFiltro.sUsuario 	!== null 
				&& oFiltro.sUsuario 	!== '')
		{
			filtroQuery = filtroQuery + 'and "UsuarioCreador"= ? ';
			aParam.push(oFiltro.sUsuario);
		}
		
		if(oFiltro.sNumIdentificacion 			!== undefined 
				&& oFiltro.sNumIdentificacion 	!== null 
				&& oFiltro.sNumIdentificacion 	!== '')
		{
			filtroQuery = filtroQuery + 'and "FechaCreacion"= ? ';
			aParam.push(oFiltro.sNumIdentificacion);
		}
		
		if(oFiltro.sNombre 			!== undefined 
				&& oFiltro.sNombre 	!== null 
				&& oFiltro.sNombre 	!== '')
		{
			filtroQuery = filtroQuery + 'and "TerminalCreacion"= ? ';
			aParam.push(oFiltro.sNombre);
		}
		
		if(oFiltro.sApellido 			!== undefined 
				&& oFiltro.sApellido 	!== null 
				&& oFiltro.sApellido 	!== '')
		{
			filtroQuery = filtroQuery + 'and "UsuarioModificador"= ? ';
			aParam.push(oFiltro.sApellido);
		}
		
		if(oFiltro.sEmail 			!== undefined 
				&& oFiltro.sEmail 	!== null 
				&& oFiltro.sEmail 	!== '')
		{
			filtroQuery = filtroQuery + 'and "FechaModificacion"= ? ';
			aParam.push(oFiltro.sEmail);
		}
		
		if(oFiltro.iIdTipoUsuario 			!== undefined 
				&& oFiltro.iIdTipoUsuario 	!== null 
				&& oFiltro.iIdTipoUsuario 	> 0)
		{
			filtroQuery = filtroQuery + 'and "TerminalModificacion"= ? ';
			aParam.push(oFiltro.iIdTipoUsuario);
		}
		
		pathQuery 	= pathQuery + 'where  "IdEstado" != 25 ' + filtroQuery; 
		aParam.unshift(pathQuery);
		rs  = conn.executeQuery.apply(conn, aParam);
		var result = rs.getIterator();
		var row;
		while(result.next()){
		    row = result.value();
		    
		    aLsUsuario.push({
				"iId" 					: row.Id,
				"iIdEstado"				: row.IdEstado,
				"sEstado"				: row.Estado,
				"sUsuario"				: row.Usuario,
				"sNumIdentificacion" 	: row.NumIdentificacion,
				"sNombre" 				: row.Nombre, 
				"sApellido" 			: row.Apellido, 
				"sEmail" 				: row.Email, 
				"dFechaNacimiento" 		: row.FechaNacimiento, 
				"iIdTipoUsuario" 		: row.IdTipoUsuario, 
				"sTipoUsuario" 			: row.TipoUsuario
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
		oResponse.sMessage 	= bundle.getText("msj.idt1",["Metodo: consultarUsuarioxFiltro - " + e.toString()]);
	} 
	return oResponse;
}
