	
	try {
		var serviceClient = $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.ConsultarCitasClienteId","CitasClienteId");
		
		var oParam = {};
		oParam.iIdCliente 	= '1200152328';
		var res = serviceClient.consultarCitasClienteIdC4C(oParam);
		
		
		$.response.status = $.net.http.OK;
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());
	}