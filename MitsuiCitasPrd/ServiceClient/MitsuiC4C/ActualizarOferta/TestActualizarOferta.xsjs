	
	try {
		var serviceClient = $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.ActualizarOferta","ActualizarOferta");
		
		var oParam 				= {};
		oParam.iIdCita 			= '4358';
		var res = serviceClient.CambiarEstadoOfertaC4c(oParam);
		
		$.response.status = $.net.http.OK;
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());
	}