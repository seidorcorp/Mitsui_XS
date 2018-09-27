	
	try {
		var serviceClient 		= $.import("MitsuiCitasPrd.ServiceClient.UsuariosAutenticacion","UsuarioValidacion");
		var utils 				= $.import("MitsuiCitasPrd.Utils","Utils");

		//3 test para valida usuario
		var oUsuario={};
		oUsuario.sUserPassBase64 = utils.Base64Encode('esalcedo@seidor.com:Inicio01');
		var res = serviceClient.validarUsuario(oUsuario);

		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());
	}