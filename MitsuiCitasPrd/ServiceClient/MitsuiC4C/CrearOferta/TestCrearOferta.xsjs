	
	try {
		var serviceClient = $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.CrearCita","CrearCita");
		
		var oParam = {};
		oParam.dFechaInicio = '2018-09-08T13:30:00Z';
		oParam.dFechaFin 	= '2018-09-08T13:44:00Z';
		oParam.sPlaca 		= 'LOK-153';
		oParam.sCodTaller   = 'M013';
		var res = serviceClient.crearCitaC4c(oParam);
		
		
		$.response.status = $.net.http.OK;
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());
	}