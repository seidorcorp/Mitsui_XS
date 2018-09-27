var textAccess 	= $.import("sap.hana.xs.i18n","text");
var bundle 		= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 		= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var esquema 	= config.getText("bd.esquema");
var conn 		= $.hdb.getConnection();

function consultarTallerHorarioxFiltro(oFiltro) {
	var rs;
	var oResponse 	= {};
	var aLsUsuario 	= [];
	var aParam 		= [];
	var aCampos 	= [ 
                	    '"Id"', 
                	    '"IdEstado"', 
                	    '"CodTaller"', 
                	    '"NumDia"', 
                	    '"Hora"', 
                	    '"Disponible"', 
                	    '"FechaInicioValidez"', 
                	    '"FechaFinValidez"'
				    ];	
	var pathQuery;
	var filtroQuery = '';
	try {
		pathQuery 	= 'select '+aCampos.join(", ")+'  from '+esquema+'."TallerHorario" where 1=1 ';
		
		if(oFiltro.iIdEstado 			!== undefined 
				&& oFiltro.iIdEstado 	!== null 
				&& oFiltro.iIdEstado 	=== 23)
		{
			filtroQuery = filtroQuery + 'and  "IdEstado" = 23 ';
		}
		if(oFiltro.sCodTaller 			!== undefined 
				&& oFiltro.sCodTaller 	!== null 
				&& oFiltro.sCodTaller 	!== "")
		{
			filtroQuery = filtroQuery + 'and  "CodTaller" = ? ';
			aParam.push(oFiltro.sCodTaller);
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
				"sCodTaller"			: row.CodTaller,
				"iNumDia" 				: row.NumDia, 
				"sHora" 				: row.Hora, 
				"iDisponible" 			: row.Disponible, 
				"sFechaInicioValidez" 	: row.FechaInicioValidez, 
				"sFechaFinValidez" 		: row.FechaFinValidez
				
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
		oResponse.sMessage 	= bundle.getText("msj.idt1",["Metodo: consultarTallerHorarioxFiltro - " + e.toString()]);
	} 
	return oResponse;
}
