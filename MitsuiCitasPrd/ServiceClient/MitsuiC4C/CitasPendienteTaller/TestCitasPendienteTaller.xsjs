	
	try {
		var serviceClient = $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.CitasPendienteTaller","CitasPendienteTaller");
		
		var oParam = {};
		oParam.sCodigoTaller 	= 'M013';
		oParam.dFechaInicio 	= '2018-09-25';
		oParam.dFechaFin	 	= '2018-09-25';
		var res = serviceClient.consultarCitasTallerC4C(oParam);
		
		$.response.status = $.net.http.OK;
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());
	}