	
	try {
		var serviceClient = $.import("MitsuiCitasPrd.ServiceClient.MitsuiSap.ClienteHistorialCitas","ClienteHistorialCitas");
		
		var oParam = {};
		oParam.sPlaca 	= 'F0S-443';
		var res = serviceClient.consultarClienteHistorialCitasSap(oParam);
		
		
		$.response.status = $.net.http.OK;
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());
	}