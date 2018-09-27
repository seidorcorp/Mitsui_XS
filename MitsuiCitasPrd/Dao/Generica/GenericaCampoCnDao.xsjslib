var textAccess = $.import("sap.hana.xs.i18n","text");
var bundle = textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config = textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var esquema = config.getText("bd.esquema");
var conn = $.hdb.getConnection();

function consultarCampo(oFiltro) {
	var rs;
	var oResponse = {};
	var aLsGenerica = [];
	var tipoCampo = 'C';
	var aParam = [];
	var aCampos = [ 'G."Id"', 
				    'G."IdEstado"',
				    'G."CodigoTabla"',
				    'G."Campo"',
				    'G."CodigoSap"'
				];
	try {
		var pathQuery = 'select '+aCampos.join(",")+'  from '+esquema+'."Generica" G  ' +
				'where 1=1 and G."IdEstado" != 25 and G."Tipo" = ? ';
		
		aParam.push(tipoCampo);
		if(oFiltro.iId !== undefined && oFiltro.iId !== null && oFiltro.iId > 0){
			pathQuery = pathQuery + 'and G."Id" = ? '; 
			aParam.push(oFiltro.iId);
		}
		if(oFiltro.iNotId !== undefined && oFiltro.iNotId !== null && oFiltro.iNotId > 0){
			pathQuery = pathQuery + 'and G."Id" != ? '; 
			aParam.push(oFiltro.iNotId);
		}
		if(oFiltro.sCodigoTabla !== undefined && oFiltro.sCodigoTabla !== null && oFiltro.sCodigoTabla !== ''){
			pathQuery = pathQuery + 'and G."CodigoTabla" = ? '; 
			aParam.push(oFiltro.sCodigoTabla);
		}
		if(oFiltro.sCampo !== undefined && oFiltro.sCampo !== null && oFiltro.sCampo !== ''){
			pathQuery = pathQuery + 'and G."Campo" = ? '; 
			aParam.push(oFiltro.sCampo);
		}
		
		if(oFiltro.sDescripcionCampo !== undefined && oFiltro.sDescripcionCampo !== null && oFiltro.sDescripcionCampo !== ''){
			pathQuery = pathQuery + 'and G."DescripcionCampo" = ? '; 
			aParam.push(oFiltro.sDescripcionCampo);
		}
		
		aParam.unshift(pathQuery);
		rs  = conn.executeQuery.apply(conn, aParam);
		var result = rs.getIterator();
		var row;
		while(result.next()){
		    row = result.value();
		    aLsGenerica.push({ 
				"iId" : row.Id,
				"iIdEstado":row.IdEstado,
				"sCodigoTabla":row.CodigoTabla,
				"sCampo" : row.Campo,
				"sCodigo" : row.CodigoSap,
				"sDescripcionCampo" : row.DescripcionCampo
			});
		}
		
		if(aLsGenerica.length > 0){
			oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
			oResponse.sMessage = bundle.getText("msj.idf1");
			oResponse.oData = aLsGenerica;
		}else{
			oResponse.iCode = parseInt(bundle.getText("code.idf2"), 10);
			oResponse.sMessage = bundle.getText("msj.idf2");
		}
	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
		oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: consultarCampo - " + e.toString()]);
	} 
	return oResponse;
}

function consultarCampoActivos(oFiltro) {
	var rs;
	var oResponse = {};
	var aLsGenerica = [];
	var tipoCampo = 'C';
	var sFuente =  'SAP';
//	var idTransaccion = '0000000000000';
	var aParam = [];
	var aCampos = [ 'G."Id"', 
				    'G."IdEstado"',
				    'G."CodigoTabla"',
				    'G."Campo"',
				    'G."CodigoSap"',
				    'G."DescripcionCampo"'
				];
	try {
		var pathQuery = 'select '+aCampos.join(",")+'  from '+esquema+'."Generica" G  ' +
				'where  G."Tipo" = ?  and G."Fuente" = ? ';
	
		aParam.push(tipoCampo);
		aParam.push(sFuente);
	
		if(oFiltro.sCodigoTabla !== undefined && oFiltro.sCodigoTabla !== null && oFiltro.sCodigoTabla !== ''){
			pathQuery = pathQuery + 'and G."CodigoTabla" = ? '; 
			aParam.push(oFiltro.sCodigoTabla);
		}
		
		if(oFiltro.sCodigoSap !== undefined && oFiltro.sCodigoSap !== null && oFiltro.sCodigoSap !== ''){
			pathQuery = pathQuery + 'and G."CodigoSap" = ? '; 
			aParam.push(oFiltro.sCodigoSap);
		}
		
		pathQuery = pathQuery + 'order by G."Id" desc '; 
		
		aParam.unshift(pathQuery);
		rs  = conn.executeQuery.apply(conn, aParam);
		var result = rs.getIterator();
		var row;
		while(result.next()){
		    row = result.value();
		    aLsGenerica.push({
				"Id" : row.Id,
				"CodigoTabla":row.CodigoTabla,
				"Campo" : row.Campo,
				"CodigoSap" : row.CodigoSap,
				"DescripcionCampo" : row.DescripcionCampo
			});
		}
		
		if(aLsGenerica.length > 0){
			oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
			oResponse.sMessage = bundle.getText("msj.idf1");
			oResponse.oData = aLsGenerica;
		}else{
			oResponse.iCode = parseInt(bundle.getText("code.idf2"), 10);
			oResponse.sMessage = bundle.getText("msj.idf2");
		}
	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
		oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: consultarCampoActivos - " + e.toString()]);
	} 
	return oResponse;
}

function consultarCampoxTabla(oFiltro) {
	var rs;
	var oResponse = {};
	var aLsGenerica = [];
	var aParam = [];
	var aCampos = [ 'G."Id"', 
				    'G."IdEstado"',
				    'G."CodigoTabla"',
				    'G."Campo"',
				    'G."DescripcionCampo"',
				    'G."CodigoSap"',
				    'G."Orden"',
				    'G."IdPadre"'
				];
	try {
		var pathQuery = 'select '+aCampos.join(",")+'  from '+esquema+'."VGenericaCampo" G  ' +
				'where 1=1  ';
		
		if(oFiltro.sCodigoTabla !== undefined && oFiltro.sCodigoTabla !== null && oFiltro.sCodigoTabla !== ''){
			pathQuery = pathQuery + 'and G."CodigoTabla" = ? '; 
			aParam.push(oFiltro.sCodigoTabla);
		}
		if(oFiltro.sCampo !== undefined && oFiltro.sCampo !== null && oFiltro.sCampo !== ''){
			pathQuery = pathQuery + 'and G."Campo" = ? '; 
			aParam.push(oFiltro.sCampo);
		}
		if(oFiltro.iIdEstado !== undefined && oFiltro.iIdEstado !== null && oFiltro.iIdEstado !== ''){
			pathQuery = pathQuery + 'and G."IdEstado" = ? '; 
			aParam.push(oFiltro.iIdEstado);
		}
		if(oFiltro.sCodigoSap !== undefined && oFiltro.sCodigoSap !== null && oFiltro.sCodigoSap !== ''){
			pathQuery = pathQuery + 'and G."CodigoSap" = ? '; 
			aParam.push(oFiltro.sCodigoSap);
		}
		if(oFiltro.sDescripcion !== undefined && oFiltro.sDescripcion !== null && oFiltro.sDescripcion !== ''){
			pathQuery = pathQuery + 'and G."DescripcionCampo" like ? '; 
			aParam.push('%' +oFiltro.sDescripcion + '%');
		}
		if(oFiltro.iIdPadre !== undefined && oFiltro.iIdPadre !== null && oFiltro.iIdPadre !== ''){
			pathQuery = pathQuery + 'and G."IdPadre" = ? '; 
			aParam.push(oFiltro.iIdPadre);
		}
		pathQuery = pathQuery + 'order by G."Id" desc '; 
		aParam.unshift(pathQuery);
		rs  = conn.executeQuery.apply(conn, aParam);
		var result = rs.getIterator();
		var row;
		while(result.next()){
		    row = result.value();
		    aLsGenerica.push({
				"iId" 			: row.Id,
				"iIdEstado"		:row.IdEstado,
				"sCodigoTabla"	:row.CodigoTabla,
				"sCampo" 		: row.Campo,
				"sDescripcion" 	: row.DescripcionCampo,
				"sCodigoSap" 	: row.CodigoSap,
				"iOrden" 		: row.Orden,
				"iIdPadre" 		: row.IdPadre
			});
		}
		
		if(aLsGenerica.length > 0){
			oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
			oResponse.sMessage = bundle.getText("msj.idf1");
			oResponse.oData = aLsGenerica;
		}else{
			oResponse.iCode = parseInt(bundle.getText("code.idf2"), 10);
			oResponse.sMessage = bundle.getText("msj.idf2");
		}
	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt1"), 10);
		oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: consultarCampoxTabla - " + e.toString()]);
	} 
	return oResponse;
}