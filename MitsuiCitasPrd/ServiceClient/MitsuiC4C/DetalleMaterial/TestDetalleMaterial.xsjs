	
	try {
		var serviceClient = $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.DetalleMaterial","DetalleMaterial");
		
		var oParam = {};
		oParam.sTipoValorTrabajo 	= 'YARIS-0720';
		oParam.sIDProductoVinculado = 'Z01_SRV_A_P040';
		var res = serviceClient.detalleMaterialC4c(oParam);
		
		
		$.response.status = $.net.http.OK;
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());
	}