var textAccess = $.import("sap.hana.xs.i18n","text");
var bundle = textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config = textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var esquema = config.getText("bd.esquema");
var conn = $.hdb.getConnection();

function consultarTabla(oFiltro) {
	var rs;
	var oResponse = {};
	var aLsGenerica = [];
	var aParam = [];
	var paramTabla = 'T';
	var aCampos = [ 'G."Id"', 
				    'G."IdEstado"',
				    'G."CodigoTabla"',
				    'G."DescripcionTabla"'
				];
	var pathQuery;
	try {
		pathQuery = 'select '+aCampos.join(", ")+'  from '+esquema+'."Generica" G  ' +
				'where 1=1 and G."IdEstado" != 25 and G."Tipo" = ? ';
		aParam.push(paramTabla);
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
		aParam.unshift(pathQuery);
		rs  = conn.executeQuery.apply(conn, aParam);
		var result = rs.getIterator();
		var row;
		while(result.next()){
		    row = result.value();
		    aLsGenerica.push({
				"Id" : row.Id,
				"IdEstado":row.IdEstado,
				"CodigoTabla":row.CodigoTabla,
				"DescripcionTabla" : row.DescripcionTabla
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
		oResponse.sMessage = bundle.getText("msj.idt1",["Metodo: consultarTabla - " + e.toString()]);
	} 
	return oResponse;
}