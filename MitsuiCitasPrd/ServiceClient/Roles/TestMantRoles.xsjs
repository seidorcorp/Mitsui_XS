	
	try {
		var serviceClient = $.import("MitsuiCitasPrd.ServiceClient.Roles","MantRoles");
		
		var oParam = {};
		oParam.sRol = 'taller-analista';
		oParam.sUsuario= 'jose.villanueva@seidor.com';
		// 1. Para generar token
		var res = serviceClient.asignarRol(oParam);
		
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());
	}