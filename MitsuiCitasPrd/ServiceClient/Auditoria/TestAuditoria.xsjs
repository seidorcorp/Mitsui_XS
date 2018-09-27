	
	try {
		var serviceClient = $.import("MitsuiCitasPrd.ServiceClient.Auditoria","Auditoria");
		var param = {};
		var res = serviceClient.registrarAuditoria("{}");
		$.response.status = $.net.http.OK;
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());

	}