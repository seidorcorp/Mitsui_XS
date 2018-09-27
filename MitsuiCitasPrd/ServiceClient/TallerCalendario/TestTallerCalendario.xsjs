	
	try {
		var serviceClient 			= $.import("MitsuiCitasPrd.ServiceClient.TallerCalendario","TallerCalendario");
		var oRequest 				= {};
		oRequest.oData				= {};
		oRequest.oData.sCodigoCentro = "M013";
		var res = serviceClient.consultarTallerCalendario(oRequest);
		$.response.status = $.net.http.OK;
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());

	}