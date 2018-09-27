var textAccess = $.import("sap.hana.xs.i18n","text");
var bundle = textAccess.loadBundle("MitsuiAuditoriaPrd.I18n","messaje");
/**
 * @description Función crear un objeto oResponse para las respuestas correctas de los servicios xsjs
 * @creation David Villanueva 17/01/2018
 * @update 
 */
function sendResponse(sIdTransaccion, iCode, sMessage, oData) {
	var oResponse = {};
	oResponse.oAuditResponse = {};
	oResponse.oAuditResponse.sIdTransaction = sIdTransaccion;
	oResponse.oAuditResponse.iCode = iCode;
	oResponse.oAuditResponse.sMessage = sMessage;
	
	oResponse.oData = oData;
	$.response.status = $.net.http.OK;
	$.response.contentType = 'application/json';
	$.response.setBody(JSON.stringify(oResponse));
}

/**
 * @description Función crear un objeto oResponse para las respuestas con error de los servicios xsjs
 * @creation David Villanueva 17/01/2018
 * @update 
 */
function sendResponseError(sIdTransaccion, iCode, sMessage) {
	var oResponse = {};
	oResponse.oAuditResponse = {};
	oResponse.oAuditResponse.sIdTransaction = sIdTransaccion;
	oResponse.oAuditResponse.iCode = iCode;
	oResponse.oAuditResponse.sMessage = sMessage;
	
	$.response.status = $.net.http.OK;
	$.response.contentType = 'application/json';
	$.response.setBody(JSON.stringify(oResponse));
}

/**
 * @description Función para validar los parametros de auditoria enviados en el request al llamar los xsjs
 * @creation David Villanueva 01/10/2017
 * @update 
 */
function validarAuditRequest(contentType,bodyStr) {

	var oResponse = {};
	try {
		if ( contentType === null || contentType.startsWith("application/json") === false){
			 
			oResponse.iCode = parseInt(bundle.getText("code.idf5"), 10);
			oResponse.sMessage = bundle.getText("msj.idf5");
			return oResponse;
		}
		var bodyStrNew  = bodyStr ? bodyStr.asString() : undefined;
		if ( bodyStrNew === undefined ){
			oResponse.iCode = parseInt(bundle.getText("code.idf6"), 10);
			oResponse.sMessage = bundle.getText("msj.idf6");
			return oResponse;
		}
		var bodyJson = JSON.parse(bodyStrNew);
		if (bodyJson.oAuditRequest === undefined || bodyJson.oAuditRequest === '') {
			oResponse.iCode = parseInt(bundle.getText("code.idf4"), 10);
			oResponse.sMessage = bundle.getText("msj.idf4",["Falta el objeto de Auditoria"]);
			return oResponse;
		}
		if (bodyJson.oAuditRequest.sIdTransaccion === undefined || bodyJson.oAuditRequest.sIdTransaccion === '') {
			oResponse.iCode = parseInt(bundle.getText("code.idf4"), 10);
			oResponse.sMessage = bundle.getText("msj.idf4",["idTransaccion"]);
			return oResponse;
		}
		if (bodyJson.oAuditRequest.sAplicacion === undefined || bodyJson.oAuditRequest.sAplicacion === '') {
			oResponse.iCode = parseInt(bundle.getText("code.idf4"), 10);
			oResponse.sMessage = bundle.getText("msj.idf4",["aplicacion"]);
			return oResponse;
		}
		if (bodyJson.oAuditRequest.sUsuario === undefined || bodyJson.oAuditRequest.sUsuario === '') {
			oResponse.iCode = parseInt(bundle.getText("code.idf4"), 10);
			oResponse.sMessage = bundle.getText("msj.idf4",["usuario"]);
			return oResponse;
		}
		
		oResponse.iCode = parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
		return oResponse;
		
	} catch (e) {
		oResponse.iCode = parseInt(bundle.getText("code.idt4"), 10);
		oResponse.sMessage = bundle.getText("msj.idt4",[e.toString()]);
		return oResponse;
	}
}

/**
 * @description Función para convertir valores vacios en 1
 * @creation David Villanueva 18/01/2018
 * @update 
 */
function convertEmptyToOne(value) {
	if (isNaN(value)) {
		value = 1;
	}
	return value;
}

/**
 * @description Función para convertir valores vacios en 0
 * @creation David Villanueva 18/01/2018
 * @update 
 */
function convertEmptyToZero(value) {
	if (isNaN(value)) {
		value = 0;
	} 
	
	return value;
}

/**
 * @description Función para cortar palabras
 * @creation David Villanueva 13/02/2018
 * @update 
 */
function cortarPalabras(value, numero) {
	
	if(value.length > numero){
		value = value.substr(0,numero);
	}
	
	return value;
}