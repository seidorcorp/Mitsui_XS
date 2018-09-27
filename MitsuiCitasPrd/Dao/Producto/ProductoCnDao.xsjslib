var textAccess 	= $.import("sap.hana.xs.i18n","text");
var bundle 		= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 		= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var esquema 	= config.getText("bd.esquema");
var conn 		= $.hdb.getConnection();

function consultarProductoxFiltro(oFiltro) {
	var rs;
	var oResponse 	= {};
	var aLsUsuario 	= [];
	var aParam 		= [];
	var aCampos 	= [ 
                	    '"Id"', 
                	    '"IdEstado"', 
                	    '"Estado"', 
                	    '"CodigoSap"', 
                	    '"Descripcion"', 
                	    '"Puntos"', 
                	    '"Precio"', 
                	    '"Jerarquia"', 
                	    '"NombreImagen1"', 
                	    '"Imagen1"', 
                	    '"NombreImagen2"', 
                	    '"Imagen2"', 
                	    '"NombreImagen3"', 
                	    '"Imagen3"'
				    ];	
	var pathQuery;
	var filtroQuery = '';
	try {
		pathQuery 	= 'select '+aCampos.join(", ")+'  from '+esquema+'."VProducto" where 1=1 ';
		
		if(oFiltro.iIdEstado 			!== undefined 
				&& oFiltro.iIdEstado 	!== null 
				&& oFiltro.iIdEstado 	=== 23)
		{
			filtroQuery = filtroQuery + 'and  "IdEstado" = 23 ';
		}
		if(oFiltro.sJerarquia 			!== undefined 
				&& oFiltro.sJerarquia 	!== null 
				&& oFiltro.sJerarquia 	!== "")
		{
			filtroQuery = filtroQuery + 'and  "Jerarquia" = ? ';
			aParam.push(oFiltro.sJerarquia);
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
				"sCodigoSap" 			: row.CodigoSap, 
				"sDescripcion" 			: row.Descripcion, 
				"iPuntos" 				: row.Puntos, 
				"fPrecio" 			    : row.Precio, 
				"sJerarquia" 			: row.Jerarquia, 
				"sNombreImagen1" 		: row.NombreImagen1, 
				"sImagen1" 		        : row.Imagen1,
				"sNombreImagen2" 		: row.NombreImagen2,
				"sImagen2" 		        : row.Imagen2,
				"sNombreImagen3" 		: row.NombreImagen3,
				"sImagen3" 		        : row.Imagen3
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
		oResponse.sMessage 	= bundle.getText("msj.idt1",["Metodo: consultarProductoxFiltro - " + e.toString()]);
	} 
	return oResponse;
}
