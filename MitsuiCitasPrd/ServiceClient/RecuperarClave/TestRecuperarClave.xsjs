	
	try {
		var serviceClient 		= $.import("MitsuiCitasPrd.ServiceClient.RecuperarClave","RecuperarClave");
		var utils 				= $.import("MitsuiCitasPrd.Utils","Utils");

		//3 test para valida usuario
		var oUsuario={};
		oUsuario.oData  =  {};
		oUsuario.oData.sUsuario = 'jose.villanueva@seidor.com';
		var res = serviceClient.recuperarClave(oUsuario);

		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());
	}