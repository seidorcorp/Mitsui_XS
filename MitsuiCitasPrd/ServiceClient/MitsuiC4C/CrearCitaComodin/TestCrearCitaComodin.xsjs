	
	try {
		var serviceClient = $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.CrearCitaComodin","CrearCitaComodin");
		
		var oParam = {};
		oParam.dFechaInicio = '2018-09-13T13:30:00Z';
		oParam.dFechaFin 	= '2018-09-13T13:44:00Z';
		oParam.sPlaca 		= 'ASF-075';
		oParam.sCodTaller   = 'M013';
		oParam.sNombreCliente = 'CLIENTE COMODIN PRUEBA';
		oParam.sObservacion	='Cambio de Aceite';
		var res = serviceClient.crearCitaComodinC4c(oParam);
		
		
		$.response.status = $.net.http.OK;
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());
	}