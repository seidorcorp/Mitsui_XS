
/**
 * @description Función para convertir objetos xml a json fuente: https://drive.google.com/open?id=1OTaxIaqKCaiP6_tfCKJo68NWBSFwaShZ
 * @creation David Villanueva 17/02/2018
 * @update 
 */
function xml2toJsonConsultarDetalleMat(xml){
	 var parser 		= new $.util.SAXParser();
	  var result 		= {};
	  var lastName 		= '';
	  var lastSetting 	= null;
	  var lastElement	= null;
	  var lsObject=[];
	  var settings 		= {};
	  settings.BODetalleMaterialesLabores		= { consider: true, parent: null, type: 'object' };
	  settings.SAP_UUID					 		= { consider: true, parent: 'BODetalleMaterialesLabores', type: 'property', mask:'SAP_UUID' };
	  settings.Clave					 		= { consider: true, parent: 'BODetalleMaterialesLabores', type: 'property', mask:'Clave' };
	  settings.LBRCAT				 			= { consider: true, parent: 'BODetalleMaterialesLabores', type: 'property', mask:'LBRCAT' };
	  settings.LABVAL							= { consider: true, parent: 'BODetalleMaterialesLabores', type: 'property', mask:'LABVAL' };
	  settings.LABVAL_TYPE		 				= { consider: true, parent: 'BODetalleMaterialesLabores', type: 'property', mask:'LABVAL_TYPE' };
	  settings.VALUE 							= { consider: true, parent: 'BODetalleMaterialesLabores', type: 'property', mask:'VALUE' };
	  settings.Descripcion 						= { consider: true, parent: 'BODetalleMaterialesLabores', type: 'property', mask:'Descripcion' };
	  
	  settings.ProcessingConditions 		= { consider: true, parent: null, type: 'object'  };
	  settings.ReturnedQueryHitsNumberValue = { consider: true, parent: 'ProcessingConditions', type: 'property', mask:'ReturnedQueryHitsNumberValue' };
	  settings.MoreHitsAvailableIndicator 	= { consider: true, parent: 'ProcessingConditions', type: 'property', mask:'MoreHitsAvailableIndicator' };
	  
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
			  if(lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.consider === true && lastSetting.parent === 'BODetalleMaterialesLabores'){
				  	lastElement[lastSetting.parent][lastSetting.mask] = value;
				 
			  }
			  
			  if(lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.consider === true && lastSetting.parent === 'ProcessingConditions'){
				  	lastElement[lastSetting.parent][lastSetting.mask] = value;
				 
			  }
		  };
	  parser.parse(xml);
	  
	  return result;
}