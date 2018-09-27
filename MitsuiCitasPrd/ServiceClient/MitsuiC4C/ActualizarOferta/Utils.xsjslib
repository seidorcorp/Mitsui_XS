
/**
 * @description Función para convertir objetos xml a json fuente: https://drive.google.com/open?id=1OTaxIaqKCaiP6_tfCKJo68NWBSFwaShZ
 * @creation David Villanueva 17/02/2018
 * @update 
 */
function xml2toJsonActualizarEstadoCita(xml){
	 var parser 		= new $.util.SAXParser();
	  var result 		= {};
	  var lastName 		= '';
	  var lastSetting 	= null;
	  var lastElement	= null;
	  var settings 		= {};
	  settings.CustomerQuote						= { consider: true, parent: null, type: 'object' };
	  settings.ChangeStateID 						= { consider: true, parent: 'CustomerQuote', type: 'property', mask:'ChangeStateID'};
	  settings.UUID 								= { consider: true, parent: 'CustomerQuote', type: 'property', mask:'UUID' };
	  settings.ID 									= { consider: true, parent: 'CustomerQuote', type: 'property', mask:'ID' };
	  settings.Log									= { consider: true, parent: null, type: 'object' };
	  settings.MaximumLogItemSeverityCode 			= { consider: true, parent: 'Log', type: 'property', mask:'MaximumLogItemSeverityCode' };
	  settings.Item 								= { consider: true, parent: 'Log', type: 'object' };
	  settings.TypeID 								= { consider: true, parent: 'Item', type: 'property', mask:'TypeID' };
	  settings.SeverityCode 						= { consider: true, parent: 'Item', type: 'property', mask:'SeverityCode' };
	  settings.Note 								= { consider: true, parent: 'Item', type: 'property', mask:'Note' };

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
		    if (lastSetting.type === 'object' && lastSetting.parent === 'AppointmentActivity'){
		    	lastElement[lastSetting.parent][lastName] = {};
		    }
		    
		    if (lastSetting.type === 'object' && lastSetting.parent === 'Log'){
		    	lastElement[lastSetting.parent][lastName] = {};
		    }
		    
		  };
		  
		  parser.characterDataHandler = function(value){
			  //mostramos solomente los de tipo property
			  if(lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.parent === "Log"){
				  lastElement[lastSetting.parent][lastSetting.mask] = value;
			  }
			  if(lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.parent === "AppointmentActivity"){
				  lastElement[lastSetting.parent][lastSetting.mask] = value;
			  }
			  if(lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.parent === "Item"){
				  lastElement['Log'][lastSetting.parent][lastSetting.mask] = value;
			  }
		  };
	  parser.parse(xml);
	  
	  return result;
}