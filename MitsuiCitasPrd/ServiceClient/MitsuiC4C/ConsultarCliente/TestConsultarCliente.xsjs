	
	try {
		var serviceClient = $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.ConsultarCliente","ConsultarCliente");
		
		var oParam = {};
		oParam.sNumDni 	= '40641241';
		var res = serviceClient.consultarClienteC4c(oParam);
		
		
		$.response.status = $.net.http.OK;
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());
	}