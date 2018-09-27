	
	try {
		var serviceClient = $.import("MitsuiCitasPrd.ServiceClient.MitsuiSap.ClientePuntos","ClientePuntos");
		
		var oParam = {};
		oParam.sNumIdentificacion 	= '42344248';
		var res = serviceClient.consultarClientePuntosSap(oParam);
		
		
//		var oParam = {};
//		oParam.sZidCliInt 	= '';
//		oParam.sZgruCta 	= 'ZCLI';
//		oParam.sZsoci  		= '1200';
//		oParam.sZorgVta 	= '1200';
//		oParam.sZcanal  	= '20';
//		oParam.sZsector  	= '00';
//		oParam.sZtrata 		= '';
//		oParam.sZnombre 	= 'JOSEFINA TORREALVA';
//		oParam.sZcalle  	= 'CALLE CINCUENTA 500';
//		oParam.sZnumero 	= '';
//		oParam.sZdistri  	= 'LIMA LIMA';
//		oParam.sZpais  		= 'PE';
//		oParam.sZregion 	= '';
//		oParam.sZnif1 		= '09199945';
//		oParam.sZtipNif1  	= '01';
//		oParam.sZnif2 		= '';
//		oParam.sZclaImp  	= '01';
//		oParam.sZperFis  	= 'X';
//		oParam.sZctaAso 	= 'ES';
//		oParam.sZspras 		= 'ES';
//		oParam.sZtipOpe  	= '01';
//		oParam.sZzonaTran 	= 'Z000000001';
//		oParam.sZzonaRegs  	= '10';
//		oParam.sZconPago  	= 'C000';
//		oParam.sZviaPago 	= '';
//		oParam.sZresultado  = '';
//		oParam.sZcodCliSap 	= '';
//		oParam.sZindEstado	= '';
//		oParam.sTelNumber  	= '';
//		oParam.sSmtpAddr  	= 'jtorrealva@gmail.com';
//		var res = serviceClient.crearClienteSap(oParam);
		
		$.response.status = $.net.http.OK;
		$.response.contentType = 'application/json';
		$.response.setBody(JSON.stringify(res));
	} catch (e) {
		$.response.setBody(e.toString());
	}