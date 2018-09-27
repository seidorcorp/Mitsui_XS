	
	try {
		var serviceClient = $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.ConsultarCitasClienteDni","CitasClienteDni");
		
		var oParam = {};
		oParam.sClienteDni 	= '43690500';
		var res = serviceClient.consultarCitasClienteDniC4C(oParam);
		
		
		$.response.status = $.net.http.OK;
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());
	}