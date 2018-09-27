	
	try {
		var serviceClient = $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.CalendarioTallerExcepcion","CalendarioTallerEx");
		
		var oParam = {};
		oParam.sCodigoCentro 	= 'M313';
		var res = serviceClient.consultarCalendarioTallerExcC4c(oParam);
		
		
		$.response.status = $.net.http.OK;
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());
	}