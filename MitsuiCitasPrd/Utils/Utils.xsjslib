var textAccess 	= $.import("sap.hana.xs.i18n","text");
var bundle 		= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 		= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var keyStr 		= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function utf8_encode(string) {
	string = string.replace(/\r\n/g,"\n");
	var utftext = "";
	for (var n = 0; n < string.length; n++) {
		var c = string.charCodeAt(n);
		if (c < 128) {
			utftext += String.fromCharCode(c);
		} else if((c > 127) && (c < 2048)) {
			utftext += String.fromCharCode((c >> 6) | 192);
			utftext += String.fromCharCode((c & 63) | 128);
		} else {
			utftext += String.fromCharCode((c >> 12) | 224);
			utftext += String.fromCharCode(((c >> 6) & 63) | 128);
			utftext += String.fromCharCode((c & 63) | 128);
		}
	}
	return utftext;
}

function utf8_decode(utftext) {
	var string = "";
	var i = 0;
	var c = 0;
	var c1 = 0;
	var c2 = 0;
	var c3 = 0;

	while ( i < utftext.length ) {

		c = utftext.charCodeAt(i);

		if (c < 128) {
			string += String.fromCharCode(c);
			i++;
		}
		else if((c > 191) && (c < 224)) {
			c2 = utftext.charCodeAt(i+1);
			string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
			i += 2;
		}
		else {
			c2 = utftext.charCodeAt(i+1);
			c3 = utftext.charCodeAt(i+2);
			string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
			i += 3;
		}

	}

	return string;
}

function encode(input) {
	var output = "";
	var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	var i = 0;

	input = utf8_encode(input);

	while (i < input.length) {

		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);

		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;

		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		} else if (isNaN(chr3)) {
			enc4 = 64;
		}

		output = output +
		this.keyStr.charAt(enc1) + this.keyStr.charAt(enc2) +
		this.keyStr.charAt(enc3) + this.keyStr.charAt(enc4);

	}

	return output;
}

function decode(input) {
	var output = "";
	var chr1, chr2, chr3;
	var enc1, enc2, enc3, enc4;
	var i = 0;
	input = input.substr(4,input.length);
	input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

	while (i < input.length) {

		enc1 = this.keyStr.indexOf(input.charAt(i++));
		enc2 = this.keyStr.indexOf(input.charAt(i++));
		enc3 = this.keyStr.indexOf(input.charAt(i++));
		enc4 = this.keyStr.indexOf(input.charAt(i++));

		chr1 = (enc1 << 2) | (enc2 >> 4);
		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		chr3 = ((enc3 & 3) << 6) | enc4;

		output = output + String.fromCharCode(chr1);

		if (enc3 != 64) {
			output = output + String.fromCharCode(chr2);
		}
		if (enc4 != 64) {
			output = output + String.fromCharCode(chr3);
		}

	}

	output = utf8_decode(output);
	
	return output;
}

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
	
	oResponse.oResults = oData;
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
 * @description Función crear un objeto de Auditoria
 * @creation David Villanueva 26/07/2018
 * @update 
 */
function datosAuditoria(headers) {
	var oAuditoriaRequest = {};
	oAuditoriaRequest.sIdTransaccion 	= headers.get("sIdTransaccion");
	oAuditoriaRequest.sTerminal 		= headers.get("X-FORWARDED-FOR") + ' ';
	oAuditoriaRequest.sUsuario			= utils.decode(headers.get("sToken"));
	oAuditoriaRequest.sAplicacion 		= headers.get("sAplicacion");
	oAuditoriaRequest.dFecha			= new Date();
	
	return oAuditoriaRequest;
}

/**
 * @description Función para validar los parametros de request para los metodos post
 * @creation David Villanueva 27/07/2018
 * @update 
 */
function validarPostRequest(contentType,bodyStr, headers) {
	var oResponse = {};
	try {
		if ( contentType === null || contentType.startsWith("application/json") === false){
			oResponse.iCode = parseInt(bundle.getText("code.idf5"), 10);
			oResponse.sMessage = bundle.getText("msj.idf5");
			return oResponse;
		}
		
		if ( headers.get('sToken') === undefined || headers.get('sToken') === null){
			oResponse.iCode = parseInt(bundle.getText("code.idf4"), 10);
			oResponse.sMessage = bundle.getText("msj.idf4");
			return oResponse;
		}
		
		if ( headers.get('sAplicacion') === undefined || headers.get('sAplicacion') === null){
			oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
			oResponse.sMessage = bundle.getText("msj.idf10",["aplicacion"]);
			return oResponse;
		}
		
		if ( headers.get('sIdTransaccion') === undefined || headers.get('sIdTransaccion') === null){
			oResponse.iCode = parseInt(bundle.getText("code.idf12"), 10);
			oResponse.sMessage = bundle.getText("msj.idf12");
			return oResponse;
		}
		
		var bodyStrNew  = bodyStr ? bodyStr.asString() : undefined;
		if ( bodyStrNew === undefined ){
			oResponse.iCode = parseInt(bundle.getText("code.idf6"), 10);
			oResponse.sMessage = bundle.getText("msj.idf6");
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
 * @description Función para validar los parametros de request para los metodos post
 * @creation David Villanueva 27/07/2018
 * @update 
 */
function validarGetRequest(contentType, headers) {
	var oResponse = {};
	try {
//		if ( contentType === null || contentType.startsWith("application/json") === false){
//			oResponse.iCode = parseInt(bundle.getText("code.idf5"), 10);
//			oResponse.sMessage = bundle.getText("msj.idf5");
//			return oResponse;
//		}

		if ( headers.get('sToken') === undefined || headers.get('sToken') === null){
			oResponse.iCode = parseInt(bundle.getText("code.idf4"), 10);
			oResponse.sMessage = bundle.getText("msj.idf4");
			return oResponse;
		}
		
		if ( headers.get('sAplicacion') === undefined || headers.get('sAplicacion') === null){
			oResponse.iCode = parseInt(bundle.getText("code.idf10"), 10);
			oResponse.sMessage = bundle.getText("msj.idf10",["aplicacion"]);
			return oResponse;
		}
		
		if ( headers.get('sIdTransaccion') === undefined || headers.get('sIdTransaccion') === null){
			oResponse.iCode = parseInt(bundle.getText("code.idf12"), 10);
			oResponse.sMessage = bundle.getText("msj.idf12");
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
 * @description Función para convertir valores undefined a vacios
 * @creation David Villanueva 13/02/2018
 * @update 
 */
function convertEmptyToVacio(value) {
	if (!value) {
		value = '';
	} 
	return value;
}


/**
 * @description Función para convertir valores undefined y null a vacios
 * @creation David Villanueva 11/06/2018
 * @update 
 */
function convertEmptyNullToVacio(value) {
	if (!value) {
		value = '';
	} 
	
	if (value === null) {
		value = '';
	} 
	return value;
}

var Logging = function(){
    this.startTimer = function() {
        this.start = new Date().getTime();
    };
 
    this.stopTimer = function() {
        return (new Date().getTime()) - this.start;
    };
};


/**
 * @description Función para retardar el servicio
 * @creation David Villanueva 01/02/2018
 * @update 
 */
function wait(ms){
	   var start = new Date().getTime();
	   var end = start;
	   while(end < start + ms) {
	     end = new Date().getTime();
	  }
}

/**
 * @description Función para buscar el valor de un tag en xml
 * @creation David Villanueva 06/02/2018
 * @update 
 */
function getValue(tag,xmlString){
    var value;
    var tempString;
    var startTag,endTag;
    var startPos,endPos;
    startTag = "<"+tag+">";
    endTag = "</"+tag+">";
    tempString=xmlString;
    startPos = tempString.search(startTag) + startTag.length;
    endPos = tempString.search(endTag);
    value = tempString.slice(startPos,endPos);
    return value;
}

/**
 * @description Función para convertir String a fecha
 * @creation David Villanueva 06/02/2018
 * @update 
 */
function convertStringtoDate1(sDate){
	
	var fechaNew = sDate.substring(0, 4) + "/";
	fechaNew = fechaNew + sDate.substring(4, 6) + "/";
	fechaNew = fechaNew + sDate.substring(6, 8);
	
	return new Date(fechaNew);
}

/**
 * @description Función para obtener formato de fecha segun formato: dd/mm/yyyy ---- dd/mm/yyyy h:m:s
 * @creation David Villanueva 08/02/2018
 * @update 
 */
function formatDate(date, format){
	
	var nuevoFormat='';
	if(date !== undefined && date !== null ){
		if(date.getFullYear() !== -1){
		    var dd = (date.getDate() <= 9 ? '0' + date.getDate() : date.getDate());
		    var mm = (date.getMonth() + 1<=9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1));
		    var yyyy = date.getFullYear();
		    var hour = (date.getHours() <= 9 ? '0' + date.getHours() : date.getHours());
		    var minut = (date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes());
		    var segund = (date.getSeconds() <= 9 ? '0' + date.getSeconds() : date.getSeconds());
		    nuevoFormat = format.replace('dd',dd)
								    .replace('mm',mm)
								    .replace('yyyy',yyyy)
								    .replace('h',hour)
								    .replace('m', minut)
								    .replace('s',segund);
		}
	}
    return  nuevoFormat;
}

/**
 * @description Función para obtener un Id unico
 * @creation David Villanueva 08/02/2018
 * @update 
 */
function generarIdTransaccion(){
	var fecha			=	new Date();
	var fechaIso		=	fecha.toISOString();
	var fechaString		=	fechaIso.toString().replace(/:/g,"").replace(/-/g,"").replace(".","").replace("Z","").replace("T","");
	var randon			=	Math.floor((Math.random() * 1000000) + 1);
	var idTransaccion	=	fechaString + randon;
	return idTransaccion;		
}

/**
 * @description Función para obtener una fecha Iso
 * @creation David Villanueva 08/02/2018
 * @update 
 */
function obtenerFechaIso(){
	var d       	=	new Date();
	var fechaIso	=	d.toISOString();
	return fechaIso.toString();
}

/**
 * @description Función para transformar xml a json
 * @creation David Villanueva 14/02/2018
 * @update 
 */
function xml2Object(xml){
	  var parser = new $.util.SAXParser();
	  var result = {};
	  var lastPropertyName = '';
	  parser.startElementHandler = function(name, attrs){
	    lastPropertyName = name;
	  
	    if(name === 'root'){
	        return;
	    }
	  
	    result[name] = '';
	  };
	  parser.characterDataHandler = function(value){
	      result[lastPropertyName] = value;
	  };
	  parser.parse(xml);
	  return result;
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

/**
 * @description Función para validar si existe el numero y es mayor a 0
 * @creation David Villanueva 26/04/2018
 * @update 
 */
function existeNumero(value) {
	
	if(value !== undefined && 
			value !== null && 
				value !== '' && 
					value > 0 ){
		return true;
	}
	return false;
}

/**
 * @description Función para validar si existe el string
 * @creation David Villanueva 26/04/2018
 * @update 
 */
function existeString(value) {
	
	if(value !== undefined && 
			value !== null && 
				value !== ''){
		return true;
	}
	return false;
}

/**
 * @description Función para convertir string a base64
 * @creation David Villanueva 26/02/2018
 * @update 
 */
function Base64Encode(str) {
    if (/([^\u0000-\u00ff])/.test(str)) throw Error('String must be ASCII');

    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, bits, h1, h2, h3, h4, e=[], pad = '', c;

    c = str.length % 3;  // pad string to length of multiple of 3
    if (c > 0) { while (c++ < 3) { pad += '='; str += '\0'; } }
    // note: doing padding here saves us doing special-case packing for trailing 1 or 2 chars

    for (c=0; c<str.length; c+=3) {  // pack three octets into four hexets
        o1 = str.charCodeAt(c);
        o2 = str.charCodeAt(c+1);
        o3 = str.charCodeAt(c+2);

        bits = o1<<16 | o2<<8 | o3;

        h1 = bits>>18 & 0x3f;
        h2 = bits>>12 & 0x3f;
        h3 = bits>>6 & 0x3f;
        h4 = bits & 0x3f;

        // use hextets to index into code string
        e[c/3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    }
    str = e.join('');  // use Array.join() for better performance than repeated string appends

    // replace 'A's from padded nulls with '='s
    str = str.slice(0, str.length-pad.length) + pad;

    return str;
}

/**
 * @description Función para convertir  base64 a string 
 * @creation David Villanueva 26/02/2018
 * @update 
 */
function Base64Decode(str) {
    if (!(/^[a-z0-9+/]+={0,2}$/i.test(str)) || str.length%4 != 0) throw Error('Not base64 string');

    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, d=[];

    for (var c=0; c<str.length; c+=4) {  // unpack four hexets into three octets
        h1 = b64.indexOf(str.charAt(c));
        h2 = b64.indexOf(str.charAt(c+1));
        h3 = b64.indexOf(str.charAt(c+2));
        h4 = b64.indexOf(str.charAt(c+3));

        bits = h1<<18 | h2<<12 | h3<<6 | h4;

        o1 = bits>>>16 & 0xff;
        o2 = bits>>>8 & 0xff;
        o3 = bits & 0xff;

        d[c/4] = String.fromCharCode(o1, o2, o3);
        // check for padding
        if (h4 == 0x40) d[c/4] = String.fromCharCode(o1, o2);
        if (h3 == 0x40) d[c/4] = String.fromCharCode(o1);
    }
    str = d.join('');  // use Array.join() for better performance than repeated string appends

    return str;
}

/**
 * @description Función para cortar  palabras 
 * @creation David Villanueva 04/04/2018
 * @update 
 */
function cortarString(campo, num){
	
	return campo.substring(campo.length-num, campo.length);
	
}

/**
 * @description Función para validar una hora entre 2 horas
 * @creation David Villanueva 01/09/2018
 * @update 
 */
function validarHora(horas, horaValidar){
	var inputCheck  = horaValidar.replace(/ /gi,"");
	var aList 		= horas.replace(/ /gi,"").split("-");
	var fecha1 		= new Date('1/1/1990 '+aList[0]);
	var fecha2 		= new Date('1/1/1990 '+aList[1]);
	var fechaCheck 	= new Date('1/1/1990 '+inputCheck);
	
	if((fechaCheck >= fecha1) && (fechaCheck < fecha2)){
		return true;
	}else{
		return false;
	}
}

/**
 * @description Función para validar una fecha entre 2 fechas
 * @creation David Villanueva 05/09/2018
 * @update 
 */
function validarFechaBetween(fechaCheck, fechaInicio, FechaFin){
	
	if((fechaCheck >= fechaInicio) && (fechaCheck <= FechaFin)){
		return true;
	}else{
		return false;
	}
}

/**
 * @description Función para validar fechas
 * @creation David Villanueva 05/09/2018
 * @update 
 */
function validarFechaMayor(fechaCheck, fechaFin){
	
	if((fechaCheck > fechaFin)){
		return true;
	}else{
		return false;
	}
}

/**
 * @description Función para validar fechas
 * @creation David Villanueva 26/09/2018
 * @update 
 */
function validarFechaMenorString(fechaCheck, fechaActual){
	
	if((new Date(fechaCheck + "T00:00:00") < new Date(fechaActual + "T00:00:00"))){
		return true;
	}else{
		return false;
	}
}

/**
 * @description Función para validar fechas
 * @creation David Villanueva 05/09/2018
 * @update 
 */
function validarFechaMenor(fechaCheck, fechaFin){
	
	if((fechaCheck <= fechaFin)){
		return true;
	}else{
		return false;
	}
}
/**
 * @description Función para validar fechas
 * @creation David Villanueva 05/09/2018
 * @update 
 */
function validarFechaIguales(fechaCheck, fechaFin){
	
	if(fechaCheck === fechaFin){
		return true;
	}else{
		return false;
	}
}