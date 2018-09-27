var textAccess 			= $.import("sap.hana.xs.i18n","text");
var utils 				= $.import("MitsuiAuditoriaPrd.Utils","Utils");
var bundle 				= textAccess.loadBundle("MitsuiAuditoriaPrd.I18n","messaje");
var auditoriaBussines 	= $.import("MitsuiAuditoriaPrd.Business.Auditoria","AuditoriaCnBusiness");
var oBodyJson;
var oAuditoriaRequest;
var oDataRequest;
var sIdTransaccion;
function handlePost(){
	var oParam = {};
	oParam.oData={};
	try{
		oBodyJson 				= {};
		oAuditoriaRequest 		= {};
//		oAuditoriaRequest.sTerminal = $.request.headers.get("X-FORWARDED-FOR") + ' ';
		sIdTransaccion 			= '1212121212';
		oParam.oAuditRequest 	= {};
		oParam.oData 			= {};
		
		var output = "";
		var cookies = $.request.cookies;
		var name;
		for (name in cookies) {
		     output += "name:" + name + ",value" + JSON.stringify(cookies[name]) + "<br>";
		}
		
		//var responseRegistrarAuditoria = auditoriaBussines.consultarAuditoria(oParam);
		
		//if(responseRegistrarAuditoria.iCode === parseInt(bundle.getText("code.idf1"), 10)){
			utils.sendResponse(
					sIdTransaccion,
					parseInt(bundle.getText("code.idf1"), 10), 
					$.request.headers.get("cookie") , 
					output );
		//}else{
			//utils.sendResponseError(
				//	sIdTransaccion,
					//responseRegistrarAuditoria.iCode, 
					//responseRegistrarAuditoria.sMessage 
					//);
	//	}
		
	}catch(e){
		utils.sendResponseError(
				sIdTransaccion,
				parseInt(bundle.getText("code.idt3"), 10), 
				bundle.getText("msj.idt3" , [e.toString()])
				);
	}
	
}

function processRequest(){
	try {
		//var validarAudit  = utils.validarAuditRequest($.request.contentType, $.request.body);
		//if(validarAudit.iCode === parseInt(bundle.getText("code.idf1"), 10)){
			switch ( $.request.method ) {
	        case $.net.http.POST:
	        	handlePost();
	        	break;
	        default:
	        	utils.sendResponseError(
	        			sIdTransaccion,
	    				parseInt(bundle.getText("code.idt5"), 10), 
	    				bundle.getText("msj.idt5")
	    				);		        
	            break;
	    }    
	//	}else{
		//	utils.sendResponseError(
			//		sIdTransaccion,
				//	validarAudit.iCode, 
					//validarAudit.sMessage
					//);
		//}
		
	} catch (e) {
		utils.sendResponseError(
				sIdTransaccion,
				parseInt(bundle.getText("code.idt3"), 10), 
				bundle.getText("msj.idt3" , [e.toString()])
				);
	}
}
processRequest();