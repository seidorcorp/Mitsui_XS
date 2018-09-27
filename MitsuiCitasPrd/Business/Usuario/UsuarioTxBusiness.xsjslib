var textAccess 					= $.import("sap.hana.xs.i18n","text");
var config 						= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var usuarioCnDao 				= $.import("MitsuiCitasPrd.Dao.Usuario","UsuarioCnDao");
var usuarioTxDao 				= $.import("MitsuiCitasPrd.Dao.Usuario","UsuarioTxDao");
var genericaCampoCnDao 			= $.import("MitsuiCitasPrd.Dao.Generica","GenericaCampoCnDao");
var serviceClientMantUsuarios 	= $.import("MitsuiCitasPrd.ServiceClient.Usuarios","MantUsuarios");
var serviceClientMantRoles	 	= $.import("MitsuiCitasPrd.ServiceClient.Roles","MantRoles");
var serviceClientAuditoria 		= $.import("MitsuiCitasPrd.ServiceClient.Auditoria","Auditoria");
var oResponse					= {};

/**
 * @description Función que permite registrar un usuario para el portal
 * @creation David Villanueva 25/07/2018
 * @update
 */
function registrarUsuarioPortal(oParam){
	
	var oFiltro2 		= {};
	var tiempo			= 0;
	oFiltro2.oData 		= {};
	try {
		tiempo = new Date().getTime();

		//1. registramos el usuario en el identiy provider
		var oParamUsuario 			= {};
		oParamUsuario.sUsuario	 	= oParam.oData.sEmail;
		oParamUsuario.sNombre 		= oParam.oData.sNombre;
		oParamUsuario.sApellido 	= oParam.oData.sApellido;
		oParamUsuario.sCorreo 		= oParam.oData.sEmail;
		
		
		var registrarUsuarioSapResponse 		= serviceClientMantUsuarios.registrarUsuario(oParamUsuario);
		if(registrarUsuarioSapResponse.iCode 	=== parseInt(bundle.getText("code.idt1"), 10)){
			throw new TypeError(registrarUsuarioSapResponse.sMessage,'',registrarUsuarioSapResponse.iCode);			
		}
		
		//2 consultamos el codigo del tipo de usuario
		var oFiltro = {};
		oFiltro.iId = oParam.oData.iIdTipoUsuario;
		var consultarCampoResponse = genericaCampoCnDao.consultarCampo(oFiltro);
		if(consultarCampoResponse.iCode 	!== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarCampoResponse.sMessage,'',consultarCampoResponse.iCode);			
		}
		
		//3.Asignamos el rol
		var oParamRol = {};
		oParamRol.sRol = consultarCampoResponse.oData[0].sCampo;
		oParamRol.sUsuario= oParam.oData.sEmail;
		var asignarRolResponse = serviceClientMantRoles.asignarRol(oParamRol);
		if(asignarRolResponse.iCode 	!== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(asignarRolResponse.sMessage,'',asignarRolResponse.iCode);			
		}
		
		//4. Registramos el usuario en la BD
		oFiltro2.oAuditRequest 		= oParam.oAuditRequest;
		oFiltro2.oData 				= oParam.oData;
		oFiltro2.oData.sUsuario		= oParam.oData.sEmail;
		oFiltro2.oData.iIdEstado 	= parseInt(config.getText("id.estado.activo"), 10);
		oFiltro2.oData.sAplicacion 	= 'BO';
		
		var registrarUsuarioResponse 		= usuarioTxDao.registrarUsuario(oFiltro2);
		if(registrarUsuarioResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(registrarUsuarioResponse.sMessage,'',registrarUsuarioResponse.iCode);			
		}
		
		oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage 	= bundle.getText("msj.idf1");
		
	}catch(e){
		if (e instanceof TypeError) {
			oResponse.iCode 	= e.lineNumber;
			oResponse.sMessage 	= e.message;
		}else{
			oResponse.iCode 	= parseInt(bundle.getText("code.idt2"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt2",[e.toString()]);
		}	
	}finally{
		try{
			var oRequest 				= {};
			oRequest.oAuditRequest 		= oParam.oAuditRequest;
			oRequest.sNombreProceso 	= "RegistrarUsuarioPortal";
			oRequest.iProcesoPrincipal 	= 1;
			oRequest.iProcesoOrden 		= 0;
			oRequest.iTiempoProceso 	= ((new Date().getTime()) - tiempo);
			oRequest.sEntradaProceso 	= JSON.stringify(oParam.oData);
			oRequest.sRespuestaProceso 	= JSON.stringify(oResponse);
			oRequest.sMetadata 			= "";
			oRequest.sEstado 			= (oResponse.iCode === 1) ? "OK" : "ERROR";
			serviceClientAuditoria.registrarAuditoria(oRequest);
		} finally {
			
		}
	}
	return oResponse;
}

/**
 * @description Función que permite registrar un usuario para el movil
 * @creation David Villanueva 25/07/2018
 * @update
 */
function registrarUsuarioMovil(oParam){
	
	var oFiltro2 		= {};
	var tiempo			= 0;
	oFiltro2.oData 		= {};
	try {
		tiempo = new Date().getTime();

		//1. registramos el usuario en el identiy provider
		var oParamUsuario 			= {};
		oParamUsuario.sUsuario	 	= oParam.oData.sUsuario;
		oParamUsuario.sNombre 		= oParam.oData.sNombre;
		oParamUsuario.sApellido 	= oParam.oData.sApellido;
		oParamUsuario.sCorreo 		= oParam.oData.sEmail;
		
		
		var registrarUsuarioSapResponse 		= serviceClientMantUsuarios.registrarUsuario(oParamUsuario);
		if(registrarUsuarioSapResponse.iCode 	=== parseInt(bundle.getText("code.idt1"), 10)){
			throw new TypeError(registrarUsuarioSapResponse.sMessage,'',registrarUsuarioSapResponse.iCode);			
		}
		
		//2. Registramos el usuario en la BD
		oFiltro2.oAuditRequest 		= oParam.oAuditRequest;
		oFiltro2.oData 				= oParam.oData;
		oFiltro2.oData.sUsuario		= oParam.oData.sEmail;
		oFiltro2.oData.iIdEstado 	= parseInt(config.getText("id.estado.activo"), 10);
		oFiltro2.oData.sAplicacion 	= 'MO';
		var registrarUsuarioResponse 		= usuarioTxDao.registrarUsuario(oFiltro2);
		if(registrarUsuarioResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(registrarUsuarioResponse.sMessage,'',registrarUsuarioResponse.iCode);			
		}
			
		oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage 	= bundle.getText("msj.crear.usuario.idf1");
		
	}catch(e){
		if (e instanceof TypeError) {
			oResponse.iCode 	= e.lineNumber;
			oResponse.sMessage 	= e.message;
		}else{
			oResponse.iCode 	= parseInt(bundle.getText("code.idt2"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt2",[e.toString()]);
		}	
	}finally{
		try{
			var oRequest 				= {};
			oRequest.oAuditRequest 		= oParam.oAuditRequest;
			oRequest.sNombreProceso 	= "registrarUsuarioMovil";
			oRequest.iProcesoPrincipal 	= 1;
			oRequest.iProcesoOrden 		= 0;
			oRequest.iTiempoProceso 	= ((new Date().getTime()) - tiempo);
			oRequest.sEntradaProceso 	= JSON.stringify(oParam.oData);
			oRequest.sRespuestaProceso 	= JSON.stringify(oResponse);
			oRequest.sMetadata 			= "";
			oRequest.sEstado 			= (oResponse.iCode === 1) ? "OK" : "ERROR";
			serviceClientAuditoria.registrarAuditoria(oRequest);
		} finally {
			
		}
	}
	return oResponse;
}


/**
 * @description Función que permite actualizar un usuario
 * @creation David Villanueva 01/02/2018
 * @update
 */
function actualizarUsuario(oParam){
	
	var tiempo	= 0;
	var oFiltro = {};
	try {
		tiempo 	= new Date().getTime();
		
		//1. buscamos el usuario en identity provider 
		var oParamBuscarUsuario = {};
		oParamBuscarUsuario.sUserName = oParam.oData.sEmail;
		var buscarUsuarioResponse = serviceClientMantUsuarios.buscarUsuario(oParamBuscarUsuario);
		if(buscarUsuarioResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(buscarUsuarioResponse.sMessage,'',parseInt(buscarUsuarioResponse.iCode,10));
		}
		
		//2. Buscamos al usuario en BD
		var oFiltroUsuario = {};
		oFiltroUsuario.iId = oParam.oData.iId;
		var buscarUsuarioxFiltroResponse = usuarioCnDao.consultarUsuarioxFiltro(oFiltroUsuario);
		if(buscarUsuarioxFiltroResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(buscarUsuarioxFiltroResponse.sMessage,'',parseInt(buscarUsuarioxFiltroResponse.iCode,10));
		}
		
		
		if(parseInt(buscarUsuarioxFiltroResponse.oData[0].iIdtipoUsuario,10) !== parseInt(oParam.oData.iIdTipoUsuario,10)){
			//3. eliminamos el rol
			var oParamRol = {};
			oParamRol.sRol = buscarUsuarioxFiltroResponse.oData[0].sTipoUsuario;
			oParamRol.sUsuario= oParam.oData.sEmail;
			var eliminarRolResponse = serviceClientMantRoles.eliminarRol(oParamRol);
			if(eliminarRolResponse.iCode 	=== parseInt(bundle.getText("code.idt1"), 10)){
				throw new TypeError(eliminarRolResponse.sMessage,'',eliminarRolResponse.iCode);			
			}
			
			//4. consultamos el codigo del tipo de usuario
			var oFiltro2 = {};
			oFiltro2.iId = oParam.oData.iIdTipoUsuario;
			var consultarCampoResponse = genericaCampoCnDao.consultarCampo(oFiltro2);
			if(consultarCampoResponse.iCode 	!== parseInt(bundle.getText("code.idf1"), 10)){
				throw new TypeError(consultarCampoResponse.sMessage,'',consultarCampoResponse.iCode);			
			}
			//5.Asignamos el nuevo rol
			var oParamRolNuevo 	= {};
			oParamRolNuevo.sRol = consultarCampoResponse.oData[0].sCampo;
			oParamRolNuevo.sUsuario= oParam.oData.sEmail;
			var asignarRolResponse = serviceClientMantRoles.asignarRol(oParamRolNuevo);
			if(asignarRolResponse.iCode 	!== parseInt(bundle.getText("code.idf1"), 10)){
				throw new TypeError(asignarRolResponse.sMessage,'',asignarRolResponse.iCode);			
			}
		}
		
		var oParamActUsuario = {};
		if(oParam.oData.iIdEstado === 23){
			oParamActUsuario.bEstado 	= true;
		}
		
		if(oParam.oData.iIdEstado === 24){
			oParamActUsuario.bEstado 	= false;
		}
		
		oParamActUsuario.iId		= buscarUsuarioResponse.oData[0].id;
		oParamActUsuario.sNombre 	= oParam.oData.sNombre;
		oParamActUsuario.sApellido 	= oParam.oData.sApellido;
		
		var actualizarUsuarioIdPrResponse = serviceClientMantUsuarios.actualizarUsuario(oParamActUsuario);
		if(actualizarUsuarioIdPrResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(actualizarUsuarioIdPrResponse.sMessage,'',parseInt(actualizarUsuarioIdPrResponse.iCode,10));
		}
		
//		//6. Actualizamos el usuario
		oFiltro.oAuditRequest  				=  oParam.oAuditRequest;
		oFiltro.oData 						= oParam.oData;
		var actualizarUsuarioResponse 		= usuarioTxDao.actualizarUsuario(oFiltro);
		if(actualizarUsuarioResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(actualizarUsuarioResponse.sMessage,'',actualizarUsuarioResponse.iCode);
		}
		
		oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage 	= bundle.getText("msj.idf1");
		
	}catch(e){
		if (e instanceof TypeError) {
			oResponse.iCode 	= e.lineNumber;
			oResponse.sMessage 	= e.message;
		}else{
			oResponse.iCode 	=  parseInt(bundle.getText("code.idt2"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt2",[e.toString()]);
		}	
	} finally {
		try{
			var oRequest 				= {};
			oRequest.oAuditRequest 		= oParam.oAuditRequest;
			oRequest.sNombreProceso 	= "ActualizarUsuario";
			oRequest.iProcesoPrincipal 	= 1;
			oRequest.iProcesoOrden 		= 0;
			oRequest.iTiempoProceso 	= ((new Date().getTime()) - tiempo);
			oRequest.sEntradaProceso 	= JSON.stringify(oParam.oData);
			oRequest.sRespuestaProceso 	= JSON.stringify(oResponse);
			oRequest.sMetadata 			= "";
			oRequest.sEstado 			= (oResponse.iCode === 1) ? "OK" : "ERROR";
			serviceClientAuditoria.registrarAuditoria(oRequest);
		} finally {
			
		}
	}
	return oResponse;
}

/**
 * @description Función que permite actualizar un usuario (Token de Firebase)
 * @creation Franz Portocarrero 20/09/2018
 * @update
 */
function actualizarTokenFirebase(oParam){
	
	var tiempo	= 0;
	var oFiltro = {};
	try {
		tiempo 	= new Date().getTime();
		
		//1. Buscamos al usuario en BD
		var oFiltroUsuario = {};
		oFiltroUsuario.iId = oParam.oData.iId;
		var buscarUsuarioxFiltroResponse = usuarioCnDao.consultarUsuarioxFiltro(oFiltroUsuario);
		if(buscarUsuarioxFiltroResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(buscarUsuarioxFiltroResponse.sMessage,'',parseInt(buscarUsuarioxFiltroResponse.iCode,10));
		}
		
		//2. Actualizamos el usuario (Token de Firebase)
		oFiltro.oAuditRequest  				=  oParam.oAuditRequest;
		oFiltro.oData 						= oParam.oData;
		var actualizarUsuarioResponse 		= usuarioTxDao.actualizarUsuarioToken(oFiltro);
		if(actualizarUsuarioResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(actualizarUsuarioResponse.sMessage,'',actualizarUsuarioResponse.iCode);
		}
		
		oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage 	= bundle.getText("msj.idf1");
		
	}catch(e){
		if (e instanceof TypeError) {
			oResponse.iCode 	= e.lineNumber;
			oResponse.sMessage 	= e.message;
		}else{
			oResponse.iCode 	=  parseInt(bundle.getText("code.idt2"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt2",[e.toString()]);
		}	
	} finally {
		try{
			var oRequest 				= {};
			oRequest.oAuditRequest 		= oParam.oAuditRequest;
			oRequest.sNombreProceso 	= "actualizarTokenFirebase";
			oRequest.iProcesoPrincipal 	= 1;
			oRequest.iProcesoOrden 		= 0;
			oRequest.iTiempoProceso 	= ((new Date().getTime()) - tiempo);
			oRequest.sEntradaProceso 	= JSON.stringify(oParam.oData);
			oRequest.sRespuestaProceso 	= JSON.stringify(oResponse);
			oRequest.sMetadata 			= "";
			oRequest.sEstado 			= (oResponse.iCode === 1) ? "OK" : "ERROR";
			serviceClientAuditoria.registrarAuditoria(oRequest);
		} finally {
			
		}
	}
	return oResponse;
}

/**
 * @description Función que permite eliminar usuarios
 * @creation David Villanueva 01/02/2018
 * @update
 */
function eliminarUsuario(oParam){
	
	var tiempo		= 0;
	var oFiltro 	= {};
	oFiltro.oData 	= {};
	try {
		tiempo 				= new Date().getTime();
		var oParamUsuario 	= {};
		oParam.oData.aItems.forEach(function(e){
			if(e.sEmail !== undefined && e.sEmail !== null && e.sEmail !== ''){
				oParamUsuario.sUserName = e.sEmail;
				//1. Buscamos el usuario en el identity provider
				var buscarUsuarioResponse 		= serviceClientMantUsuarios.buscarUsuario(oParamUsuario);
				if(buscarUsuarioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
					//2. si encontramos el usuario lo eliminamos
					var oParaUsuario 		= {};
					oParaUsuario.iId 		= buscarUsuarioResponse.oData[0].id;
					serviceClientMantUsuarios.eliminarUsuario(oParaUsuario);
				}
				
				//3. consultamos el codigo del tipo de usuario
				var oFiltro2 = {};
				oFiltro2.iId = e.iIdTipoUsuario;
				var consultarCampoResponse = genericaCampoCnDao.consultarCampo(oFiltro2);
				if(consultarCampoResponse.iCode 	!== parseInt(bundle.getText("code.idf1"), 10)){
					throw new TypeError(consultarCampoResponse.sMessage,'',consultarCampoResponse.iCode);			
				}
				
				//4. Eliminamos el Rol
				var oParamRol 		= {};
				oParamRol.sRol 		= consultarCampoResponse.oData[0].sCampo;
				oParamRol.sUsuario	= e.sEmail;
				var eliminarRolResponse = serviceClientMantRoles.eliminarRol(oParamRol);
				if(eliminarRolResponse.iCode 	=== parseInt(bundle.getText("code.idt1"), 10)){
					throw new TypeError(eliminarRolResponse.sMessage,'',eliminarRolResponse.iCode);			
				}
			}
		});
	
		//5. Eliminamos  el usuario en la Base de datos
		oFiltro.oAuditRequest = oParam.oAuditRequest;
		oParam.oData.aItems.forEach(function(e){
			e.iIdEstado = parseInt(config.getText("id.estado.eliminado"), 10);
		});
		oFiltro.oData 						= oParam.oData;
		var eliminarUsuarioResponse 		= usuarioTxDao.eliminarUsuario(oFiltro);
		if(eliminarUsuarioResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(eliminarUsuarioResponse.sMessage,'',eliminarUsuarioResponse.iCode);			
		}
		
		oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage 	= bundle.getText("msj.idf1");
		
	}catch(e){
		if (e instanceof TypeError) {
			oResponse.iCode 	= e.lineNumber;
			oResponse.sMessage 	= e.message;
		}else{
			oResponse.iCode 	= parseInt(bundle.getText("code.idt2"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt2",[e.toString()]);
		}	
	}finally {
		try{
			var oRequest 				= {};
			oRequest.oAuditRequest 		= oParam.oAuditRequest;
			oRequest.sNombreProceso 	= "EliminarUsuario";
			oRequest.iProcesoPrincipal 	= 1;
			oRequest.iProcesoOrden 		= 0;
			oRequest.iTiempoProceso 	= ((new Date().getTime()) - tiempo);
			oRequest.sEntradaProceso 	= JSON.stringify(oParam.oData);
			oRequest.sRespuestaProceso 	= JSON.stringify(oResponse);
			oRequest.sMetadata 			= "";
			oRequest.sEstado 			= (oResponse.iCode === 1) ? "OK" : "ERROR";
			serviceClientAuditoria.registrarAuditoria(oRequest);
		} finally {
			
		}
	}
	return oResponse;
}

/**
 * @description Función que permite Activar o Desactivar Usuario
 * @creation David Villanueva 01/02/2018
 * @update
 */
function ActivarDesactivarUsuario(oParam){
	
	var tiempo		= 0;
	var oFiltro 	= {};
	oFiltro.oData 	= {};
	try {
		tiempo 					= new Date().getTime();
		//1. buscamos el usuario en el identity provider
		var oParamBuscarUsuario = {};
		var respuestaIdentity;
//		oParam.oData.aItems.forEach(function(e){
//			if(e.sUsuarioSap !== undefined && e.sUsuarioSap !== null && e.sUsuarioSap !== ''){
//				
//				oParamBuscarUsuario.sUserName = e.sUsuarioSap;
//				//1. Buscamos el usuario en el identity provider
//				var buscarUsuarioResponse = serviceClientMantUsuarios.buscarUsuario(oParamBuscarUsuario);
//				if(buscarUsuarioResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
//					
//					//2. si encontramos el usuario lo bloqueamos  en el identity provider
//					var oParamBloquearUsuario = {};
//					oParamBloquearUsuario.iId = buscarUsuarioResponse.oData[0].id;
//					if(e.iIdEstado === 23){
//						oParamBloquearUsuario.bEstado = true;
//					}
//					if(e.iIdEstado === 24){
//						oParamBloquearUsuario.bEstado = false;
//					}
//					respuestaIdentity = serviceClientMantUsuarios.bloquearUsuario(oParamBloquearUsuario);
//					
//					if(respuestaIdentity.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
//						throw new TypeError(respuestaIdentity.sMessage,'',respuestaIdentity.iCode);			
//					}
//				}
//			}
//		});
		
		//3. Activamos o bloqueamos  un usuario en la base de datos
		oFiltro.oAuditRequest 	= oParam.oAuditRequest;
		oFiltro.oData 			= oParam.oData;
		
		var activarBloquearUsuarioResponse 		= usuarioTxDao.activarBloquearUsuario(oFiltro);
		if(activarBloquearUsuarioResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(activarBloquearUsuarioResponse.sMessage,'',activarBloquearUsuarioResponse.iCode);			
		}
		
		oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage 	= bundle.getText("msj.idf1");
		
	}catch(e){
		if (e instanceof TypeError) {
			oResponse.iCode 	= e.lineNumber;
			oResponse.sMessage 	= e.message;
		}else{
			oResponse.iCode 	= parseInt(bundle.getText("code.idt2"), 10);
			oResponse.sMessage 	= bundle.getText("msj.idt2",[e.toString()]);
		}	
	}finally {
		try{
			var oRequest 				= {};
			oRequest.oAuditRequest 		= oParam.oAuditRequest;
			oRequest.sNombreProceso 	= "ActivarDesactivarUsuario";
			oRequest.iProcesoPrincipal 	= 1;
			oRequest.iProcesoOrden 		= 0;
			oRequest.iTiempoProceso 	= ((new Date().getTime()) - tiempo);
			oRequest.sEntradaProceso 	= JSON.stringify(oParam.oData);
			oRequest.sRespuestaProceso	= JSON.stringify(oResponse);
			oRequest.sMetadata 			= "";
			oRequest.sEstado 			= (oResponse.iCode === 1) ? "OK" : "ERROR";
			serviceClientAuditoria.registrarAuditoria(oRequest);
		} finally {
			
		}
	}
	return oResponse;
}