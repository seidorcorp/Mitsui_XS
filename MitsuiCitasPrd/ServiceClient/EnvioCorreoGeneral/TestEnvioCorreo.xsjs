	
	try {
		var serviceClient 			= $.import("MitsuiCitasPrd.ServiceClient.EnvioCorreoGeneral","EnvioCorreoGeneral");
		var oRequest 				= {};
		oRequest.sCorreoDestino 	= "atoledo@mitsuiautomotriz.com";
		oRequest.sAsunto			= "[CITAS-APP] - TALLER CANADÁ";
		oRequest.sCuerpo		 	=  "<font color=\"#888181\" size=\"3\" face=\"MS Sans Serif\">"+
										"<h4><b>Cita generada para el taller: TALLER MITSUI </b></h4>"+ 
										"<i><b style=\"color: #546494\"> Información del Cliente: </b></i><br><ul>" +
										"<li><strong style=\" color: #807777;\">Nombre:</strong> Prueba</li>" +
										"<li><strong style=\" color: #807777;\">Placa:</strong> Prueba</li></ul>" +
										"<i><b style=\"color: #546494\">Información del Servicio:</b></i><br> <ul>" +
										"<li><strong style=\" color: #807777;\">Codigo Cita:</strong> Prueba </li>" +
										"<li><strong style=\" color: #807777;\">Fecha:</strong> Prueba </li>" +
										"<li><strong style=\" color: #807777;\">Hora:</strong> Prueba </li>" +
										"<li><strong style=\" color: #807777;\">Tipo Servicio:</strong> Prueba </li>" +
										"<li><strong style=\" color: #807777;\">Servicio a realizar:</strong> Prueba </li>" +
										"<li><strong style=\" color: #807777;\">Observación:</strong> Prueba </li>" +
										"<li><strong style=\" color: #807777;\">Telefono:</strong> Prueba </li> " +
										"<li><strong style=\" color: #807777;\">Express</strong></li> " +
										"</ul>" +
										"</font>";
		var res = serviceClient.enviarCorreo(oRequest);
		$.response.status = $.net.http.OK;
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());

	}