
/**
 * @description Función para convertir objetos xml a json fuente: https://drive.google.com/open?id=1OTaxIaqKCaiP6_tfCKJo68NWBSFwaShZ
 * @creation David Villanueva 17/02/2018
 * @update 
 */
function xml2toJsonConsultarProducto(xml){
	 var parser 		= new $.util.SAXParser();
	  var result 		= {};
	  var lastName 		= '';
	  var lastSetting 	= null;
	  var lastElement	= null;
	  var lsObject=[];
	  var settings 		= {};
	  settings.BOListaProductos						= { consider: true, parent: null, type: 'object' };
	  settings.SAP_UUID					 			= { consider: true, parent: 'BOListaProductos', type: 'property', mask:'SAP_UUID' };
	  settings.zID				 					= { consider: true, parent: 'BOListaProductos', type: 'property', mask:'zID' };
	  settings.zDescripcion							= { consider: true, parent: 'BOListaProductos', type: 'property', mask:'zDescripcion' };
	  settings.zTipoValorTrab		 				= { consider: true, parent: 'BOListaProductos', type: 'property', mask:'zTipoValorTrab' };
	  settings.zCanal 								= { consider: true, parent: 'BOListaProductos', type: 'property', mask:'zCanal' };
	  settings.zCanalName 							= { consider: true, parent: 'BOListaProductos', type: 'property', mask:'zCanalName' };
	  settings.zPACKAGE_TYPE 						= { consider: true, parent: 'BOListaProductos', type: 'property', mask:'zPACKAGE_TYPE' };
	  settings.zSector 								= { consider: true, parent: 'BOListaProductos', type: 'property', mask:'zSector' };
	  settings.zSectorName							= { consider: true, parent: 'BOListaProductos', type: 'property', mask:'zSectorName' };

	  settings.ProductosVinculados			= { consider: true, parent: 'BOListaProductos', type: 'array' };
	  settings.zIDPadreProductoVinc			= { consider: true, parent: 'ProductosVinculados', type: 'property', mask:'zIDPadreProductoVinc' };
	  settings.zIDPadre						= { consider: true, parent: 'ProductosVinculados', type: 'property', mask:'zIDPadre' };
	  settings.zIDProductoVinculado			= { consider: true, parent: 'ProductosVinculados', type: 'property', mask:'zIDProductoVinculado' };
	  settings.zTipoPosicion				= { consider: true, parent: 'ProductosVinculados', type: 'property', mask:'zTipoPosicion' };
	  settings.zCantidad					= { consider: true, parent: 'ProductosVinculados', type: 'property', mask:'zCantidad' };
	  settings.zPOSNR						= { consider: true, parent: 'ProductosVinculados', type: 'property', mask:'zPOSNR' };
	  settings.zMatnr						= { consider: true, parent: 'ProductosVinculados', type: 'property', mask:'zMatnr' };
	  settings.zZMENG						= { consider: true, parent: 'ProductosVinculados', type: 'property', mask:'zZMENG' };
	  
//	  settings.ProcessingConditions 		= { consider: true, parent: null, type: 'object'  };
//	  settings.ReturnedQueryHitsNumberValue = { consider: true, parent: 'ProcessingConditions', type: 'property', mask:'ReturnedQueryHitsNumberValue' };
//	  settings.MoreHitsAvailableIndicator 	= { consider: true, parent: 'ProcessingConditions', type: 'property', mask:'MoreHitsAvailableIndicator' };
	  
	  parser.startElementHandler = function(name, attrs){
		    lastName = name;
		   
		    lastSetting = settings[lastName];
		    
		    if(!lastSetting || (lastSetting.consider === false && lastSetting.type === 'object')){
		        return;
		    }  
		    
		    if(lastElement === null){
		    	lastElement = result;
		    }
		    
		    if (lastSetting.type === 'object' && lastSetting.parent === null){
		    	lastElement[lastName] = {};
		    }
		    
		    if (lastSetting.type === 'array' && lastSetting.parent === 'BOListaProductos'){
		    	lsObject.push(lastName);
		    	if(lsObject.length < 2){
		    		lastElement[lastName]=[];
					lastElement[lastName].push({});
		    	}else{
		    		lastElement[lastName].push({});
		    	}
		    }
		    
		  };
		  
		  parser.characterDataHandler = function(value){
			  //mostramos solomente los de tipo property
			  if(lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.consider === true && lastSetting.parent === 'BOListaProductos'){
				  	lastElement[lastSetting.parent][lastSetting.mask] = value;
				 
			  }
			  
			  if(lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.parent === "ProductosVinculados"){
				  lastElement[lastSetting.parent][lsObject.length - 1][lastSetting.mask]=value;
			  }
		  };
	  parser.parse(xml);
	  
	  return result;
}