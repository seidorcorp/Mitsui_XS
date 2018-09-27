/* tslint:disable:no-empty */
var textAccess 					= $.import("sap.hana.xs.i18n","text");
var config 						= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var usuarioCnDao 				= $.import("MitsuiCitasPrd.Dao.Usuario","UsuarioCnDao");
var serviceClientAutenticacion 	= $.import("MitsuiCitasPrd.ServiceClient.UsuariosAutenticacion","UsuarioValidacion");
var serviceClientPuntos		 	= $.import("MitsuiCitasPrd.ServiceClient.MitsuiSap.ClientePuntos","ClientePuntos");
var serviceClientInfoCliente 	= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.ConsultarCliente","ConsultarCliente");

var oResponse					= {};

/**
 * @description Función que permite buscar usuarios segun filtros
 * @creation David Villanueva 03/02/2018
 * @update
 */
function buscarUsuarioxFiltro(oParam){
	var oFiltro = {};
	try {
		oFiltro.sUsuario 		 		= oParam.oData.sUsuario;
		oFiltro.sUsuarioSap		 		= oParam.oData.sUsuarioSap;
		oFiltro.sNumIdentificacion	 	= oParam.oData.sNumIdentificacion;
		oFiltro.sNombre 		 		= oParam.oData.sNombre;
		oFiltro.sApellido 		 		= oParam.oData.sApellido;
		oFiltro.sEmail 		 			= oParam.oData.sEmail;
		oFiltro.iIdTipoUsuario 			= oParam.oData.iIdTipoUsuario;
		oFiltro.iId 					= oParam.oData.iId;
		//1. Buscamos los usuarios segun filtro
		var consultarUsuarioResponse = usuarioCnDao.consultarUsuarioxFiltro(oFiltro);
		
		if(consultarUsuarioResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarUsuarioResponse.sMessage,'',consultarUsuarioResponse.iCode);
		}
		
		oResponse.oData = consultarUsuarioResponse.oData;
		oResponse.iCode =  parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
		
	}catch(e){
		if (e instanceof TypeError) {
			oResponse.iCode = e.lineNumber;
			oResponse.sMessage = e.message;
		}else{
			oResponse.iCode =  parseInt(bundle.getText("code.idt2"), 10);
			oResponse.sMessage = bundle.getText("msj.idt2",[e.toString()]);
		}	
	}
	return oResponse;
}

/**
 * @description Función que permite autenticar usuarios 
 * @creation David Villanueva 15/08/2018
 * @update
 */
function autenticarUsuario(oParam){
	var oFiltro = {};
	var oUsuario = {};
	try {
		oFiltro.sUserPassBase64 		 		= oParam.oData.sAcceso;
		//1. Validamos el usuario en el Identity provider
		var consultarUsuarioResponse = serviceClientAutenticacion.validarUsuarioBase64(oFiltro);
		
		if(consultarUsuarioResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarUsuarioResponse.sMessage,'',consultarUsuarioResponse.iCode);
		}
		
		var oFiltroUsuario = {};
		oFiltroUsuario.sEmail 		 			= consultarUsuarioResponse.oData.mail;
		//2. Buscamos los usuarios segun filtro
		var consultarUsuarioxFiltroResponse = usuarioCnDao.consultarUsuarioxFiltro(oFiltroUsuario);
		
		if(consultarUsuarioxFiltroResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarUsuarioxFiltroResponse.sMessage,'',consultarUsuarioxFiltroResponse.iCode);
		}
		
		var oParamPuntos = {};
		oParamPuntos.sNumIdentificacion = consultarUsuarioxFiltroResponse.oData[0].sNumIdentificacion;
	
		//3. Obtener Puntaje del cliente en SAP ERP
		var consultarClientePuntosSapResponse = serviceClientPuntos.consultarClientePuntosSap(oParamPuntos);
		oUsuario.iPuntos 		= 0;

		if(consultarClientePuntosSapResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
			oUsuario.iPuntos 	= parseInt(consultarClientePuntosSapResponse.oData.TCliente.item.PuntLibre, 10);
		}
		
		var oParamCliente = {};
		oParamCliente.sNumDni = consultarUsuarioxFiltroResponse.oData[0].sNumIdentificacion;
		//4. Obtenemos informacion del cliente en C4C
		var consultarClienteC4cResponse = serviceClientInfoCliente.consultarClienteC4c(oParamCliente);
		oUsuario.iIdC4C 		= 0;

		if(consultarClienteC4cResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
			oUsuario.iIdC4C 	= parseInt(consultarClienteC4cResponse.oData.Customer.InternalID, 10);
		}
		
		oUsuario.iIdScp 			= consultarUsuarioResponse.oData.uid;
		oUsuario.iIdHana 			= consultarUsuarioxFiltroResponse.oData[0].iId;
		oUsuario.sUsuario 			= consultarUsuarioxFiltroResponse.oData[0].sUsuario;
		oUsuario.sEmail 			= consultarUsuarioResponse.oData.mail;
		oUsuario.sNombre 			= consultarUsuarioxFiltroResponse.oData[0].sNombre;
		oUsuario.sApellido 			= consultarUsuarioxFiltroResponse.oData[0].sApellido;
		oUsuario.sNumIdentificacion = consultarUsuarioxFiltroResponse.oData[0].sNumIdentificacion;
		oUsuario.dFechaNacimiento 	= consultarUsuarioxFiltroResponse.oData[0].dFechaNacimiento;
		
		oResponse.oData 			= oUsuario;
		oResponse.iCode 			= parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage 			= bundle.getText("msj.idf1");
		
	}catch(e){
		if (e instanceof TypeError) {
			oResponse.iCode = e.lineNumber;
			oResponse.sMessage = e.message;
		}else{
			oResponse.iCode =  parseInt(bundle.getText("code.idt2"), 10);
			oResponse.sMessage = bundle.getText("msj.idt2",[e.toString()]);
		}	
	}
	return oResponse;
}
