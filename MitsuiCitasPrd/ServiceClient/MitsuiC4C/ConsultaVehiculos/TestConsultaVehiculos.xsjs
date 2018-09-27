	
	try {
		var serviceClient = $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.ConsultaVehiculos","ConsultarVehiculos");
		
		var oParam = {};
		oParam.sIdCliente 	= '1200051530';
		var res = serviceClient.consultarVehiculosC4c(oParam);
		
		$.response.status = $.net.http.OK;
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());
	}