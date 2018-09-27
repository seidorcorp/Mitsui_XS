	
	try {
		var serviceClient = $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.EstadoCita","EstadoCita");
		
		var oParam 				= {};
		oParam.sIdCita 			= '00163e10-02f9-1ee8-a2f6-07310c56ea17';
		var res = serviceClient.CambiarEstadoCitaC4c(oParam);
		
		$.response.status = $.net.http.OK;
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());
	}