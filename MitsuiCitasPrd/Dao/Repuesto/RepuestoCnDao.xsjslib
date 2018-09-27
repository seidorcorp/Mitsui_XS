var textAccess 	= $.import("sap.hana.xs.i18n","text");
var bundle 		= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 		= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var esquema 	= config.getText("bd.esquema");
var conn 		= $.hdb.getConnection();

function consultarAccesorioxFiltro(oFiltro) {
	var rs;
	var oResponse 	= {};
	var aLsUsuario 	= [];
	var aParam 		= [];
	var aCampos 	= [ '"Id"', 
					    '"IdEstado"',
					    '"Estado"',
					    '"CodigoSap"',
					    '"Descripcion"',
					    '"Precio"',
					    '"IdMarca"',
					    '"Marca"',
					    '"Modelo"',
					    '"AnioInicio"',
					    '"AnioFin"',
					    '"Descuento"',
					    '"Imagen"',
					    '"IdTipo"',
					    '"Tipo"',
					    '"NombreImagen"',
					    '"LinkInformacion"'
				    ];	
	var pathQuery;
	var filtroQuery = '';
	try {
		pathQuery 	= 'select '+aCampos.join(", ")+'  from '+esquema+'."VAccesorio" where 1=1 ';
		
		if(oFiltro.iIdEstado 			!== undefined 
				&& oFiltro.iIdEstado 	!== null 
				&& oFiltro.iIdEstado 	=== 23)
		{
			filtroQuery = filtroQuery + 'and  "IdEstado" = 23 ';
		}
		
		if(oFiltro.iIdMarca !== undefined && oFiltro.iIdMarca !== null && oFiltro.iIdMarca !== ''){
			pathQuery = pathQuery + 'and "IdMarca" = ? '; 
			aParam.push(oFiltro.iIdMarca);
		}
		
		if(oFiltro.sCodMarca !== undefined && oFiltro.sCodMarca !== null && oFiltro.sCodMarca !== ''){
			pathQuery = pathQuery + 'and "Marca" = ? '; 
			aParam.push(oFiltro.sCodMarca);
		}
		
		if(oFiltro.iIdTipo !== undefined && oFiltro.iIdTipo !== null && oFiltro.iIdTipo !== ''){
			pathQuery = pathQuery + 'and "IdTipo" = ? '; 
			aParam.push(oFiltro.iIdTipo);
		}
		
		if(oFiltro.sCodTipo !== undefined && oFiltro.sCodTipo !== null && oFiltro.sCodTipo !== ''){
			pathQuery = pathQuery + 'and "Tipo" = ? '; 
			aParam.push(oFiltro.sCodTipo);
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
				"sEstado"				: row.Estado,
				"sCodigoSap"			: row.CodigoSap,
				"sDescripcion" 			: row.Descripcion,
				"fPrecio" 				: row.Precio, 
				"iIdMarca" 				: row.IdMarca, 
				"sMarca" 				: row.Marca, 
				"sModelo" 				: row.Modelo, 
				"iAnioInicio" 			: row.AnioInicio, 
				"iAnioFin" 				: row.AnioFin, 
				"fDescuento" 			: row.Descuento, 
				"sImagen" 				: row.Imagen, 
				"iIdTipo" 				: row.IdTipo, 
				"sTipo" 				: row.Tipo, 
				"sNombreImagen" 		: row.NombreImagen,
				"sLinkInformacion" 		: row.LinkInformacion
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
		oResponse.sMessage 	= bundle.getText("msj.idt1",["Metodo: consultarAccesorioxFiltro - " + e.toString()]);
	} 
	return oResponse;
}

function consultarRepuestoxFiltro(oFiltro) {
	var rs;
	var oResponse 	= {};
	var aLsUsuario 	= [];
	var aParam 		= [];
	var aCampos 	= [ '"Id"', 
					    '"IdEstado"',
					    '"Estado"',
					    '"CodigoSap"',
					    '"Descripcion"',
					    '"Precio"',
					    '"IdMarca"',
					    '"Marca"',
					    '"IdModelo"',
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
	var filtroQuery = '';
	try {
		pathQuery 	= 'select '+aCampos.join(", ")+'  from '+esquema+'."VRepuesto" where 1=1 ';
		
		if(oFiltro.iIdEstado 			!== undefined 
				&& oFiltro.iIdEstado 	!== null 
				&& oFiltro.iIdEstado 	=== 23)
		{
			filtroQuery = filtroQuery + 'and  "IdEstado" = 23 ';
		}
		
		if(oFiltro.iIdMarca !== undefined && oFiltro.iIdMarca !== null && oFiltro.iIdMarca !== ''){
			pathQuery = pathQuery + 'and "IdMarca" = ? '; 
			aParam.push(oFiltro.iIdMarca);
		}
		
		if(oFiltro.iIdModelo !== undefined && oFiltro.iIdModelo !== null && oFiltro.iIdModelo !== ''){
			pathQuery = pathQuery + 'and "IdModelo" = ? '; 
			aParam.push(oFiltro.iIdModelo);
		}
		
		if(oFiltro.sCodModelo !== undefined && oFiltro.sCodModelo !== null && oFiltro.sCodModelo !== ''){
			pathQuery = pathQuery + 'and "Modelo" = ? '; 
			aParam.push(oFiltro.sCodModelo);
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
				"sEstado"				: row.Estado,
				"sCodigoSap"			: row.CodigoSap,
				"sDescripcion" 			: row.Descripcion,
				"fPrecio" 				: row.Precio, 
				"iIdMarca" 				: row.IdMarca, 
				"sMarca" 				: row.Marca, 
				"iIdModelo" 			: row.IdModelo, 
				"sModelo" 				: row.Modelo, 
				"iAnioInicio" 			: row.AnioInicio, 
				"iAnioFin" 				: row.AnioFin, 
				"fDescuento" 			: row.Descuento, 
				"sImagen" 				: row.Imagen, 
				"sTipo" 				: row.Tipo, 
				"sNombreImagen" 		: row.NombreImagen,
				"sLinkInformacion" 		: row.LinkInformacion
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
		oResponse.sMessage 	= bundle.getText("msj.idt1",["Metodo: consultarRepuestoxFiltro - " + e.toString()]);
	} 
	return oResponse;
}