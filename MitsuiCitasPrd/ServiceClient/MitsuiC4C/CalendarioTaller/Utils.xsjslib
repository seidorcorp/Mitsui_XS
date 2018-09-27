
/**
 * @description Función para convertir objetos xml a json fuente: https://drive.google.com/open?id=1OTaxIaqKCaiP6_tfCKJo68NWBSFwaShZ
 * @creation David Villanueva 17/02/2018
 * @update 
 */
function xml2toJsonConsultarCliente(xml){
	 var parser 		= new $.util.SAXParser();
	  var result 		= {};
	  var lastName 		= '';
	  var lastSetting 	= null;
	  var lastElement	= null;
	  var lsObject=[];
	  var settings 		= {};
	  settings.BOCitasPorLocal			= { consider: true, parent: null, type: 'array' };
	  settings.SAP_UUID 				= { consider: true, parent: 'BOCitasPorLocal', type: 'property', mask:'SAP_UUID' };
	  settings.zItem 					= { consider: true, parent: 'BOCitasPorLocal', type: 'property', mask:'zItem' };
	  settings.zIDCentro 				= { consider: true, parent: 'BOCitasPorLocal', type: 'property', mask:'zIDCentro' };
	  settings.zDia 					= { consider: true, parent: 'BOCitasPorLocal', type: 'property', mask:'zDia' };
	  settings.zHoraInicio 				= { consider: true, parent: 'BOCitasPorLocal', type: 'property', mask:'zHoraInicio' };
	  settings.zTope 					= { consider: true, parent: 'BOCitasPorLocal', type: 'property', mask:'zTope' };
	  settings.zDuracion 				= { consider: true, parent: 'BOCitasPorLocal', type: 'property', mask:'zDuracion' };
	  settings.zFechaInicioValidez 		= { consider: true, parent: 'BOCitasPorLocal', type: 'property', mask:'zFechaInicioValidez' };
	  settings.zFechaFinValidez 		= { consider: true, parent: 'BOCitasPorLocal', type: 'property', mask:'zFechaFinValidez' };
	  settings.zEstado 					= { consider: true, parent: 'BOCitasPorLocal', type: 'property', mask:'zEstado' };

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
			  if(lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.consider === true){
				  lastElement["BOCitasPorLocal"][lsObject.length - 1][lastSetting.mask]=value;
			  }
			  
			  if(lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.parent === "ProcessingConditions"){
				  lastElement[lastSetting.parent][lastSetting.mask] = value;
			  }
		  };
	  parser.parse(xml);
	  
	  return result;
}