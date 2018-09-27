
/**
 * @description Función para convertir objetos xml a json fuente: https://drive.google.com/open?id=1OTaxIaqKCaiP6_tfCKJo68NWBSFwaShZ
 * @creation David Villanueva 17/08/2018
 * @update 
 */
function xml2Object(xml){
  var parser = new $.util.SAXParser();
  var result = {};
  var lastName = '';
  var lastSetting = null;
  var lastElement = null;
  var settings = {};
  settings.TCliente = { consider: true, parent: null, type: 'object' };
  settings.item = { consider: true, parent: 'TCliente', type: 'object' };
 
  settings.Stcd2 = { consider: true, parent: 'item', type: 'property', mask:'Stcd2' };
  settings.Kunnr = { consider: true, parent: 'item', type: 'property', mask:'Kunnr' };
  settings.PuntLibre = { consider: true, parent: 'item', type: 'property', mask:'PuntLibre'  };

  parser.startElementHandler = function(name, attrs){
	    lastName = name;
	   
	    lastSetting = settings[lastName];
	    
	    if(!lastSetting || (lastSetting.consider === false && lastSetting.type === 'object')){
	        return;
	    }  
	    
	    if(lastElement === null){
	    	lastElement = result;
	    }
	    
	    if (lastSetting.type === 'object' && lastName !== "item" ){
	    	lastElement[lastName] = {};
	    }
	    
		if(lastName === "item"){
			lastElement[lastSetting.parent]["item"] = {};
		}  
	  };
	  
	  parser.characterDataHandler = function(value){
		  //mostramos solomente los de tipo property
		  if(lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.consider === true && lastSetting.parent === "item"){
			  lastElement["TCliente"]["item"][lastSetting.mask]=value;
		  }else{
			  lastElement[lastSetting.mask]=value;
		  }
		  
	  };
  parser.parse(xml);
  
  return result;
}
