	
	try {
		var serviceClient = $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.CrearCitaReferencia","CrearCitaReferencia");
		
		var oParam = {};
		oParam.dFechaInicio = '2018-09-16T13:30:00Z';
		oParam.dFechaFin 	= '2018-09-16T13:44:00Z';
		oParam.sPlaca 		= 'OPL-098';
		oParam.sCodTaller   = 'M013';
		oParam.sIdCitaC4c	= '00163e6b-19a2-1ed8-adc6-9c3cc45812f0';
		var res = serviceClient.crearCitaReferenciaC4c(oParam);
		
		
		$.response.status = $.net.http.OK;
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());
	}