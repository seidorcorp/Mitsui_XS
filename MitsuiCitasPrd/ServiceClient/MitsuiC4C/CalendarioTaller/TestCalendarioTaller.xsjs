	
	try {
		var serviceClient = $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.CalendarioTaller","CalendarioTaller");
		
		var oParam = {};
		oParam.sCodigoCentro 	= 'L013';
		var res = serviceClient.consultarCalendarioTallerC4c(oParam);
		
		
		$.response.status = $.net.http.OK;
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());
	}