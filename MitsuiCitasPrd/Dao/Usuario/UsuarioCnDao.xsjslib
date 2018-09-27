var textAccess 	= $.import("sap.hana.xs.i18n","text");
var bundle 		= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 		= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var esquema 	= config.getText("bd.esquema");
var conn 		= $.hdb.getConnection();

function consultarUsuarioxFiltro(oFiltro) {
	var rs;
	var oResponse 	= {};
	var aLsUsuario 	= [];
	var aParam 		= [];
	var aCampos 	= [ 'U."Id"', 
					    'U."IdEstado"',
					    'U."Estado"',
					    'U."Usuario"',
					    'U."NumIdentificacion"',
					    'U."Nombre"',
					    'U."Apellido"',
					    'U."Email"',
					    'U."FechaNacimientoString"',
					    'U."IdTipoUsuario"',
					    'U."TipoUsuario"'
				    ];	
	var pathQuery;
	var filtroQuery = '';
	try {
		pathQuery 	= 'select '+aCampos.join(", ")+'  from '+esquema+'."VUsuario" U  ';
		
		if(oFiltro.iIdEstado 			!== undefined 
				&& oFiltro.iIdEstado 	!== null 
				&& oFiltro.iIdEstado 	=== 23)
		{
			filtroQuery = filtroQuery + 'and  U."IdEstado" = 23 ';
		}
		
		if(oFiltro.iId 			!== undefined 
				&& oFiltro.iId 	!== null 
				&& oFiltro.iId 	> 0)
		{
			filtroQuery = filtroQuery + 'and U."Id"= ? ';
			aParam.push(oFiltro.iId);
		}
		
		if(oFiltro.sUsuario 			!== undefined 
				&& oFiltro.sUsuario 	!== null 
				&& oFiltro.sUsuario 	!== '')
		{
			filtroQuery = filtroQuery + 'and U."Usuario"= ? ';
			aParam.push(oFiltro.sUsuario);
		}
		
		if(oFiltro.sNumIdentificacion 			!== undefined 
				&& oFiltro.sNumIdentificacion 	!== null 
				&& oFiltro.sNumIdentificacion 	!== '')
		{
			filtroQuery = filtroQuery + 'and U."NumIdentificacion"= ? ';
			aParam.push(oFiltro.sNumIdentificacion);
		}
		
		if(oFiltro.sNombre 			!== undefined 
				&& oFiltro.sNombre 	!== null 
				&& oFiltro.sNombre 	!== '')
		{
			filtroQuery = filtroQuery + 'and U."Nombre"= ? ';
			aParam.push(oFiltro.sNombre);
		}
		
		if(oFiltro.sApellido 			!== undefined 
				&& oFiltro.sApellido 	!== null 
				&& oFiltro.sApellido 	!== '')
		{
			filtroQuery = filtroQuery + 'and U."Apellido"= ? ';
			aParam.push(oFiltro.sApellido);
		}
		
		if(oFiltro.sEmail 			!== undefined 
				&& oFiltro.sEmail 	!== null 
				&& oFiltro.sEmail 	!== '')
		{
			filtroQuery = filtroQuery + 'and U."Email"= ? ';
			aParam.push(oFiltro.sEmail);
		}
		
		if(oFiltro.iIdTipoUsuario 			!== undefined 
				&& oFiltro.iIdTipoUsuario 	!== null 
				&& oFiltro.iIdTipoUsuario 	> 0)
		{
			filtroQuery = filtroQuery + 'and U."IdTipoUsuario"= ? ';
			aParam.push(oFiltro.iIdTipoUsuario);
		}
		
		pathQuery 	= pathQuery + 'where  U."IdEstado" != 25 ' + filtroQuery; 
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
				"dFechaNacimiento" 		: row.FechaNacimientoString, 
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
