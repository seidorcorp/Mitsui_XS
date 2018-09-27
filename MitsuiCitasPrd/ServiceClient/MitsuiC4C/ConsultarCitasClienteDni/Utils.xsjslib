
/**
 * @description Función para convertir objetos xml a json fuente: https://drive.google.com/open?id=1OTaxIaqKCaiP6_tfCKJo68NWBSFwaShZ
 * @creation David Villanueva 17/02/2018
 * @update 
 */
function xml2toJsonConsultarCitasDni(xml){
	 var parser 		= new $.util.SAXParser();
	  var result 		= {};
	  var lastName 		= '';
	  var lastSetting 	= null;
	  var lastElement	= null;
	  var lsObject=[];
	  var settings 		= {};
	  settings.Activity					= { consider: true, parent: null, type: 'array' };
	  settings.zFecha 					= { consider: true, parent: 'Activity', type: 'property', mask:'zFecha' };
	  settings.zEstadoCita 				= { consider: true, parent: 'Activity', type: 'property', mask:'zEstadoCita' };
	  settings.zEstadoCitaName 			= { consider: true, parent: 'Activity', type: 'property', mask:'zEstadoCitaName' };
	  settings.zHoraInicio 				= { consider: true, parent: 'Activity', type: 'property', mask:'zHoraInicio' };
	  settings.zPlaca 					= { consider: true, parent: 'Activity', type: 'property', mask:'zPlaca' };

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
			  if(lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.consider === true && lastSetting.parent === "Activity"){
				  lastElement["Activity"][lsObject.length - 1][lastSetting.mask]=value;
			  }
			  
			  if(lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.parent === "ProcessingConditions"){
				  lastElement[lastSetting.parent][lastSetting.mask] = value;
			  }
		  };
	  parser.parse(xml);
	  
	  return result;
}