	
	try {
		var serviceClient = $.import("MitsuiCitasPrd.ServiceClient.Usuarios","MantUsuarios");
		
		// 1. Para buscar usuario
		var param = {};
		param.sUserName = 'jalvarado@mitsuiautomotriz.com';
		var res = serviceClient.buscarUsuario(param);
		
		//2. para crear usuario
//		var oUsuario={};
//		oUsuario.sUsuarioSap = "jodavivi";
//		oUsuario.sNombre = "Jose David";
//		oUsuario.sApellido = "Villanueva Villalobos";
//		oUsuario.sCorreo = "jodavivi@gmail.com";
//		var res = serviceClient.registrarUsuario(oUsuario);
//		
		//3 para bloquear usuario
//		var oUsuario={};
//		oUsuario.id = 'P000130';
//		oUsuario.active = true;
//		var res = serviceClient.bloquearUsuario(oUsuario);
		
//		var oUsuario={};
//		oUsuario.iId = 'P000007';
//		oUsuario.bEstado = true;
//		var res = serviceClient.actualizarUsuario(oUsuario);
		
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());
	}