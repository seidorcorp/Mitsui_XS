var textAccess 	= $.import("sap.hana.xs.i18n","text");
var bundle 		= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 		= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var esquema 	= config.getText("bd.esquema");
var conn 		= $.hdb.getConnection();

function consultarTallerxFiltro(oFiltro) {
	var rs;
	var oResponse 	= {};
	var aLsUsuario 	= [];
	var aParam 		= [];
	var aCampos 	= [ 
                	    '"Id"', 
                	    '"IdEstado"', 
                	    '"Estado"', 
                	    '"CentroSap"', 
                	    '"Direccion"', 
                	    '"Central"', 
                	    '"Express"', 
                	    '"ServicioMantenimiento"', 
                	    '"Email"', 
                	    '"Latitud"', 
                	    '"Longitud"', 
                	    '"Horario1"', 
                	    '"Horario2"', 
                	    '"Horario3"',
                	    '"Imagen"',
                	    '"Descripcion"',
                	    '"EmailCita"',
                	    '"Marcas"'
				    ];	
	var pathQuery;
	var filtroQuery = '';
	try {
		pathQuery 	= 'select '+aCampos.join(", ")+'  from '+esquema+'."VTaller" where 1=1 ';
		
		if(oFiltro.iIdEstado 			!== undefined 
				&& oFiltro.iIdEstado 	!== null 
				&& oFiltro.iIdEstado 	=== 23)
		{
			filtroQuery = filtroQuery + 'and  "IdEstado" = 23 ';
		}
		if(oFiltro.sMarca 			!== undefined 
				&& oFiltro.sMarca 	!== null 
				&& oFiltro.sMarca 	!== "")
		{
			filtroQuery = filtroQuery + 'and  "Marcas" like ? ';
			aParam.push('%' +oFiltro.sMarca + '%');
		}
		
		
		pathQuery 	= pathQuery + filtroQuery + ' order by "Id" desc '; 
		aParam.unshift(pathQuery);
		rs  = conn.executeQuery.apply(conn, aParam);
		var result = rs.getIterator();
		var row;
		while(result.next()){
		    row = result.value();
		    
		    aLsUsuario.push({
				"iId" 						: row.Id,
				"iIdEstado"					: row.IdEstado,
				"sEstado"					: row.Estado,
				"sCentroSap" 				: row.CentroSap, 
				"sDireccion" 				: row.Direccion, 
				"sCentral" 					: row.Central, 
				"iExpress" 			    	: row.Express, 
				"sJerarquia" 				: row.Jerarquia, 
				"sServicioMantenimiento" 	: row.ServicioMantenimiento, 
				"sEmail" 		        	: row.Email,
				"fLatitud" 					: row.Latitud,
				"fLongitud" 		       	: row.Longitud,
				"sHorario1" 				: row.Horario1,
				"sHorario2" 		        : row.Horario2,
				"sHorario3" 		        : row.Horario3,
				"sImagen" 		        	: row.Imagen,
				"sDescripcion" 		        : row.Descripcion,
				"sEmailCita" 		        : row.EmailCita,
				"sMarcas" 		        	: row.Marcas
				
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
		oResponse.sMessage 	= bundle.getText("msj.idt1",["Metodo: consultarTallerxFiltro - " + e.toString()]);
	} 
	return oResponse;
}
