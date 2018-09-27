var textAccess 			= $.import("sap.hana.xs.i18n","text");
var bundle 				= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var config 				= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var destination_package = config.getText("package.project")+".ServiceClient.MitsuiC4C.DetalleMaterial";
var utils 				= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.DetalleMaterial","Utils");
var destination_name 	= "Conexion";
var oResponse			= {};

/**
 * @description Servicio que permite consultar información del detalle de material en C4C
 * @creation David Villanueva 25/08/2018
 * @update
 */
function detalleMaterialC4c(oParam){
		var responseClient;
		var oRequest = {};
		oRequest.oData = {};
		var bodyJson ='';
		try{
			var dest = $.net.http.readDestination(destination_package, destination_name);
			var client = new $.net.http.Client();
			var req = new $.net.http.Request($.net.http.POST, "/sap/bc/srt/scs/sap/yyaxzzowoy_wsdmatlabv2?sap-vhost=my330968.crm.ondemand.com");
			var requestGenerica = '<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:glob="http://sap.com/xi/SAPGlobal20/Global">'+
				   '<soap:Header/>' +
			   			'<soap:Body>' +
					   		  '<glob:BODetalleMaterialesLaboresqryDetalleMaterialLaboresSimpleByRequest_sync>' +
						            '<BODetalleMaterialesLaboresSimpleSelectionBy>' +
						            	'<SelectionByLABVAL>' +
						                  '<InclusionExclusionCode>I</InclusionExclusionCode>' +
						                  '<IntervalBoundaryTypeCode>1</IntervalBoundaryTypeCode>' +
						                  '<LowerBoundaryLABVAL schemeID="?" schemeVersionID="?" schemeAgencyID="?" schemeAgencySchemeID="?" schemeAgencySchemeAgencyID="?">'+oParam.sIDProductoVinculado+'</LowerBoundaryLABVAL>' +
						                  '<UpperBoundaryLABVAL schemeID="?" schemeVersionID="?" schemeAgencyID="?" schemeAgencySchemeID="?" schemeAgencySchemeAgencyID="?"></UpperBoundaryLABVAL>' +
						               '</SelectionByLABVAL>' +
						               '<SelectionByLABVAL_TYPE>' +
						                  '<InclusionExclusionCode>I</InclusionExclusionCode>' +
						                  '<IntervalBoundaryTypeCode>1</IntervalBoundaryTypeCode>' +
						                  '<LowerBoundaryLABVAL_TYPE>'+oParam.sTipoValorTrabajo+'</LowerBoundaryLABVAL_TYPE>' +
						                  '<UpperBoundaryLABVAL_TYPE></UpperBoundaryLABVAL_TYPE>' +
						               '</SelectionByLABVAL_TYPE>' +
						            '</BODetalleMaterialesLaboresSimpleSelectionBy>' +
						         '</glob:BODetalleMaterialesLaboresqryDetalleMaterialLaboresSimpleByRequest_sync>'+
					     '</soap:Body>'+
		   			'</soap:Envelope>';
			req.headers.set("Content-Type", "application/soap+xml");
			req.headers.set("Authorization","Basic "+config.getText("clave.ws.c4c"));
			req.setBody(requestGenerica);
			client.request(req, dest);
			responseClient = client.getResponse();
			bodyJson = responseClient.body.asString();
			var usuarioSap = utils.xml2toJsonConsultarDetalleMat(bodyJson);
		
			if(usuarioSap.ProcessingConditions.ReturnedQueryHitsNumberValue === undefined 
					|| usuarioSap.ProcessingConditions.ReturnedQueryHitsNumberValue === null 
						|| parseInt(usuarioSap.ProcessingConditions.ReturnedQueryHitsNumberValue,10) === 0){
				oResponse.iCode = parseInt(bundle.getText("code.idf2"), 10);
				oResponse.sMessage = bundle.getText("msj.idf2");
			} else {
				oResponse.iCode 	= parseInt(bundle.getText("code.idf1"), 10);
				oResponse.sMessage 	= bundle.getText("msj.idf1");
				oResponse.oData 	= usuarioSap;
			}
			
			return oResponse;
			
		}catch(e){
			oResponse.iCode = parseInt(bundle.getText("code.idt10"), 10);
			oResponse.sMessage = bundle.getText("msj.idt10",["detalleMaterialC4c",e.toString() + " : " +bodyJson]);
		}
		return oResponse;
}
