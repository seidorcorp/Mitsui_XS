	
	try {
		var serviceClient = $.import("MitsuiCitasPrd.ServiceClient.EnvioCorreo","EnvioCorreo");
		var oRequest = {};
		oRequest.sCorreoDestino 		= "citasapp.mitsui@mitsuiautomotriz.com";
		oRequest.sTaller			 	= "TALLER MOLINA";
		oRequest.sNombre		 		= "Jose David Villanueva Villalobos";
		oRequest.sPlaca		 		= "APF-075";
		oRequest.sFecha				= "2018-09-12";
		oRequest.sHora			 	= "09:00";
		oRequest.sTipoServicio		= "Preventivo";
		oRequest.sServicioRealizar	= "20,000 KM";
		oRequest.sObservacion		= "Cambio de Aceite....";
		oRequest.sTelefono			= "978726640";
		oRequest.sCodCita			= "3456";
		var res = serviceClient.enviarCorreo(oRequest);
		$.response.status = $.net.http.OK;
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());

	}