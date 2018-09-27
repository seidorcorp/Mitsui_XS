
/**
 * @description Función para convertir objetos xml a json fuente: https://drive.google.com/open?id=1OTaxIaqKCaiP6_tfCKJo68NWBSFwaShZ
 * @creation David Villanueva 17/02/2018
 * @update 
 */
function xml2toJsonConsultarClienteVeh(xml){
	 var parser 		= new $.util.SAXParser();
	  var result 		= {};
	  var lastName 		= '';
	  var lastSetting 	= null;
	  var lastElement	= null;
	  var lsObject=[];
	  var settings 		= {};
	  settings.BOVehiculo					= { consider: true, parent: null, type: 'array' };
	  settings.zIDLote 						= { consider: true, parent: 'BOVehiculo', type: 'property', mask:'zIDLote' };
	  settings.zIDMarca 					= { consider: true, parent: 'BOVehiculo', type: 'property', mask:'zIDMarca' };
	  settings.zIDModelo 					= { consider: true, parent: 'BOVehiculo', type: 'property', mask:'zIDModelo' };
	  settings.zVIN 						= { consider: true, parent: 'BOVehiculo', type: 'property', mask:'zVIN' };
	  settings.zPlaca 						= { consider: true, parent: 'BOVehiculo', type: 'property', mask:'zPlaca' };
	  settings.zMotor 						= { consider: true, parent: 'BOVehiculo', type: 'property', mask:'zMotor' };
	  settings.zKatashiki 					= { consider: true, parent: 'BOVehiculo', type: 'property', mask:'zKatashiki' };
	  settings.zAnnio 						= { consider: true, parent: 'BOVehiculo', type: 'property', mask:'zAnnio' };
	  settings.zAnnioModelo 				= { consider: true, parent: 'BOVehiculo', type: 'property', mask:'zAnnioModelo' };
	  settings.zIDCliente 					= { consider: true, parent: 'BOVehiculo', type: 'property', mask:'zIDCliente' };
	  settings.zColor 						= { consider: true, parent: 'BOVehiculo', type: 'property', mask:'zColor' };
	  settings.zFamiliaModelo				= { consider: true, parent: 'BOVehiculo', type: 'property', mask:'zFamiliaModelo' };
//	  settings.zDescFamiliaModelo 			= { consider: true, parent: 'BOVehiculo', type: 'property', mask:'zDescFamiliaModelo' };
	  settings.zDescripcion					= { consider: true, parent: 'BOVehiculo', type: 'property', mask:'zDescFamiliaModelo' };
	  settings.zOrganizacionVentas 			= { consider: true, parent: 'BOVehiculo', type: 'property', mask:'zOrganizacionVentas' };
	  settings.zCanal 						= { consider: true, parent: 'BOVehiculo', type: 'property', mask:'zCanal' };
	  settings.zCanalName 					= { consider: true, parent: 'BOVehiculo', type: 'property', mask:'zCanalName' };
	  settings.zCentro 						= { consider: true, parent: 'BOVehiculo', type: 'property', mask:'zCentro' };
	  settings.zTipoValorTrabajo 			= { consider: true, parent: 'BOVehiculo', type: 'property', mask:'zTipoValorTrabajo' };

	  settings.ProcessingConditions 		= { consider: true, parent: null, type: 'object'  };
	  settings.ReturnedQueryHitsNumberValue = { consider: true, parent: 'ProcessingConditions', type: 'property', mask:'ReturnedQueryHitsNumberValue' };
	  settings.MoreHitsAvailableIndicator 	= { consider: true, parent: 'ProcessingConditions', type: 'property', mask:'MoreHitsAvailableIndicator' };
	  
	  parser.startElementHandler = function(name, attrs){
		    lastName = name;
		   
		    lastSetting = settings[lastName];
		    
		    if(!lastSetting || (lastSetting.consider === false)){
		        return;
		    }  
		    
		    if(lastElement === null){
		    	lastElement = result;
		    }
		    
		    if (lastSetting.type === 'object' && lastSetting.parent === null){
		    	lastElement[lastName] = {};
		    }
		    
		    if (lastSetting.type === 'array' && lastSetting.parent === null){
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
			  if(lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.consider === true  && lastSetting.parent === "BOVehiculo"){
				  lastElement["BOVehiculo"][lsObject.length - 1][lastSetting.mask]=value;
			  }
			  
			  if(lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.parent === "ProcessingConditions"){
				  lastElement[lastSetting.parent][lastSetting.mask] = value;
			  }
		  };
	  parser.parse(xml);
	  
	  return result;
}