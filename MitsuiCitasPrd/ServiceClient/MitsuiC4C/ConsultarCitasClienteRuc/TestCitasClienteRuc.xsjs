	
	try {
		var serviceClient = $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.ConsultarCitasClienteRuc","CitasClienteRuc");
		
		var oParam = {};
		oParam.sClienteRuc 	= '20100114187';
		var res = serviceClient.consultarCitasClienteRucC4C(oParam);
		
		
		$.response.status = $.net.http.OK;
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());
	}