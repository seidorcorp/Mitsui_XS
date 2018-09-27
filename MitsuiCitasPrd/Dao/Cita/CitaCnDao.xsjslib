var textAccess 	= $.import("sap.hana.xs.i18n","text");
var bundle 		= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 		= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var esquema 	= config.getText("bd.esquema");
var conn 		= $.hdb.getConnection();

function consultarCitaxFiltro(oFiltro) {
	var rs;
	var oResponse 	= {};
	var aLsUsuario 	= [];
	var aParam 		= [];
	var aCampos 	= [ 
	                    '"Id"', 
					    '"IdEstado"',
					    '"IdCitaC4c"',
					    '"IdCita"',
					    '"Placa"',
					    '"FechaCita"',
					    '"HoraCita"',
					    '"CodTaller"',
					    '"IdUsuario"',
					    '"IdClienteC4c"',
					    '"Paquete"',
					    '"CodTipoServicio"',
					    '"CodServicioRealizar"',
					    '"Observacion"',
					    '"Express"',
					    '"Modelo"',
					    '"Marca"',
					    '"IdModelo"',
					    '"Taller"',
					    '"EmailCita"',
					    '"TipoServicio"',
					    '"ServicioRealizar"',
					    '"Nombre"',
					    '"Apellido"',
					    '"Telefono"',
					    '"NumIdentificacion"',
					    '"EnvioEmail"',
					    '"ExistePaquete"',
					    '"EnvioOferta"',
					    '"TipoValorTrabajo"',
					    '"MedioContacto"',
					    '"DescMedioContacto"',
					    '"CitaReprogramada"',
					    '"IdCitaReferencia"',
					    '"IdOfertaReferencia"',
					    '"CodFamilia"'
					    
				    ];	
	var pathQuery;
	try {
		pathQuery 	= 'select '+aCampos.join(", ")+'  from '+esquema+'."VCita" where 1=1 ';
		
		if(oFiltro.iEnvioEmail 			!== undefined 
				&& oFiltro.iEnvioEmail 	!== null 
				&& oFiltro.iEnvioEmail 	> -1)
		{
			pathQuery = pathQuery + 'and "EnvioEmail" = ? '; 
			aParam.push(oFiltro.iEnvioEmail);
		}
		
		if(oFiltro.sIdCitaC4c 			!== undefined 
				&& oFiltro.sIdCitaC4c 	!== null 
				&& oFiltro.sIdCitaC4c 	!=='')
		{
			pathQuery = pathQuery + 'and "IdCitaC4c" = ? '; 
			aParam.push(oFiltro.sIdCitaC4c);
		}
		
		if(oFiltro.iExistePaquete 			!== undefined 
				&& oFiltro.iExistePaquete 	!== null 
					&& oFiltro.iExistePaquete 	!=='')
		{
			pathQuery = pathQuery + 'and "ExistePaquete" = ? '; 
			aParam.push(oFiltro.iExistePaquete);
		}
		
		if(oFiltro.iEnvioOferta 			!== undefined 
				&& oFiltro.iEnvioOferta 	!== null 
					&& oFiltro.iEnvioOferta 	!=='')
		{
			pathQuery = pathQuery + 'and "EnvioOferta" = ? '; 
			aParam.push(oFiltro.iEnvioOferta);
		}
		
		
		aParam.unshift(pathQuery);
		rs  = conn.executeQuery.apply(conn, aParam);
		var result = rs.getIterator();
		var row;
		while(result.next()){
		    row = result.value();
		    
		    aLsUsuario.push({
				"iId" 					: row.Id,
				"iIdEstado"				: row.IdEstado,
				"sIdCitaC4c" 			: row.IdCitaC4c, 
				"sIdCita" 				: row.IdCita, 
				"sPlaca" 				: row.Placa, 
				"dFechaCita" 			: row.FechaCita, 
				"sHoraCita" 			: row.HoraCita, 
				"sCodTaller" 			: row.CodTaller, 
				"iIdUsuario" 			: row.IdUsuario,
				"iIdClienteC4c"			: row.IdClienteC4c,
				"sPaquete" 				: row.Paquete, 
				"sCodTipoServicio" 		: row.CodTipoServicio, 
				"sCodServicioRealizar" 	: row.CodServicioRealizar, 
				"sObservacion" 			: row.Observacion, 
				"iExpress" 			    : row.Express, 
				"sModelo" 				: row.Modelo, 
				"sMarca" 				: row.Marca, 
				"sIdModelo" 			: row.IdModelo, 
				"sTaller" 				: row.Taller, 
				"sEmailCita" 			: row.EmailCita, 
				"sTipoServicio" 		: row.TipoServicio, 
				"sServicioRealizar" 	: row.ServicioRealizar, 
				"sNombre" 				: row.Nombre, 
				"sApellido" 			: row.Apellido, 
				"sTelefono" 			: row.Telefono, 
				"sNumIdentificacion" 	: row.NumIdentificacion, 
				"iEnvioEmail" 			: row.EnvioEmail,
				"iExistePaquete"		: row.ExistePaquete,
				"iEnvioOferta" 			: row.EnvioOferta, 
				"sTipoValorTrabajo" 	: row.TipoValorTrabajo, 
				"sMedioContacto" 		: row.MedioContacto,
				"sDescMedioContacto"	: row.DescMedioContacto,
				"iCitaReprogramada"		: row.CitaReprogramada,
				"iIdCitaReferencia"		: row.IdCitaReferencia,
				"sIdOfertaReferencia"	: row.IdOfertaReferencia,
				"sCodFamilia"			: row.CodFamilia
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
		oResponse.sMessage 	= bundle.getText("msj.idt1",["Metodo: consultarCitaxFiltro - " + e.toString()]);
	} 
	return oResponse;
}
