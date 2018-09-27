var textAccess 			= $.import("sap.hana.xs.i18n","text");
var bundle 				= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 				= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var destination_package = config.getText("package.project")+".ServiceClient.MitsuiC4C.ListaProductos";
var utils 				= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.ListaProductos","Utils");
var destination_name 	= "Conexion";
var oResponse			= {};

/**
 * @description Servicio que permite consultar información de productos en C4C
 * @creation David Villanueva 25/08/2018
 * @update
 */
function consultarProductosC4c(oParam){
		var responseClient;
		var oRequest = {};
		oRequest.oData = {};
		var bodyJson ='';
		try{
			var dest = $.net.http.readDestination(destination_package, destination_name);
			var client = new $.net.http.Client();
			var req = new $.net.http.Request($.net.http.POST, "/sap/bc/srt/scs/sap/yyaxzzowoy_wslistaproductos?sap-vhost=my330968.crm.ondemand.com");
			var requestGenerica = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:glob="http://sap.com/xi/SAPGlobal20/Global">'+
				   '<soap:Header/>' +
			   			'<soap:Body>' +
					   		  '<glob:BOListaProductosBOVListaProductosReadByIDQuery_sync>' +
						            '<BOListaProductos>' +
						            '<zID>'+oParam.sCodigo+'</zID>' +
						         '</BOListaProductos>' +
						      '</glob:BOListaProductosBOVListaProductosReadByIDQuery_sync>'+
					     '</soap:Body>'+
		   			'</soap:Envelope>';
			req.headers.set("Content-Type", "application/soap+xml");
			req.headers.set("Authorization","Basic "+config.getText("clave.ws.c4c"));
			req.setBody(requestGenerica);
			client.request(req, dest);
			responseClient = client.getResponse();
			bodyJson = responseClient.body.asString();
			var usuarioSap = utils.xml2toJsonConsultarProducto(bodyJson);
		
			if(usuarioSap.BOListaProductos === undefined 
					|| usuarioSap.BOListaProductos === null 
						||  usuarioSap.BOListaProductos === ''){
				oResponse.iCode = parseInt(bundle.getText("code.idf2"), 10);
				oResponse.sMessage = bundle.getText("msj.lista.productos.error",[" --- Trama Enviada: "+ requestGenerica]);
			} else {
				oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
				oResponse.sMessage 	= bundle.getText("msj.idf1");
				oResponse.oData 	= usuarioSap;
			}
			
			return oResponse;
			
		}catch(e){
			oResponse.iCode = parseInt(bundle.getText("code.idt10"), 10);
			oResponse.sMessage = bundle.getText("msj.idt10",["consultarProductosC4c",e.toString() + " : " +bodyJson]);
		}
		return oResponse;
}
