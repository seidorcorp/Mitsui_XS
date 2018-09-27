	
	try {
		var serviceClient = $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.ListaProductos","ListaProductos");
		
		var oParam = {};
		oParam.sCodigo 	= 'M0720-040';
		var res = serviceClient.consultarProductosC4c(oParam);
		
		
		$.response.status = $.net.http.OK;
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());
	}