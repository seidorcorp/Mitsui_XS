	
	try {
		var serviceClient = $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.ActualizarCita","ActualizarEstadoCita");
		
		var oParam 				= {};
		oParam.sIdCita 			= '00163e6b-19a2-1ed8-ae8d-68fc3442fafb';
		oParam.iIdEstadoCita	= 6;	
		var res = serviceClient.actualizarEstadoCitaC4c(oParam);
		
		
		$.response.status = $.net.http.OK;
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());
	}