var utils 	= $.import("MitsuiCitasPrd.Utils","Utils");
/**
 * @description Función para convertir objetos xml a json fuente: https://drive.google.com/open?id=1OTaxIaqKCaiP6_tfCKJo68NWBSFwaShZ
 * @creation David Villanueva 17/02/2018
 * @update 
 */
function xml2ObjectHistorial(xml){
  var parser = new $.util.SAXParser();
  var result = {};
  var lastName = '';
  var lastSetting = null;
  var lastElement = null;
  var numItem =[];
  var lsObject=[];
  var settings = {};
  settings.EtOrdVlc			 	= { consider: true, parent: null, type: 'object' };
  settings.item        			= { consider: true, parent: null, type: 'array' };
  settings.Placa       			= { consider: true, parent: null, type: 'property', mask:'Placa' };
  settings.Orden   				= { consider: true, parent: null, type: 'property', mask:'Orden' };
  settings.Cliente 				= { consider: true, parent: null, type: 'property', mask:'Cliente' };
  settings.AnioModelo			= { consider: true, parent: null, type: 'property', mask:'AnioModelo' };
  settings.Modelo 				= { consider: true, parent: null, type: 'property', mask:'Modelo' };
  settings.DescModelo 			= { consider: true, parent: null, type: 'property', mask:'DescModelo' };
  settings.Kilometraje			= { consider: true, parent: null, type: 'property', mask:'Kilometraje' };
  settings.Um	 				= { consider: true, parent: null, type: 'property', mask:'Um'  };
  settings.Asesor 				= { consider: true, parent: null, type: 'property', mask:'Asesor' };
  settings.AsesorDesc 			= { consider: true, parent: null, type: 'property', mask:'AsesorDesc' };
  settings.Codservicio 			= { consider: true, parent: null, type: 'property', mask:'Codservicio' };
  settings.Servicio 			= { consider: true, parent: null, type: 'property', mask:'Servicio' };
  settings.Taller 				= { consider: true, parent: null, type: 'property', mask:'Taller' };
  settings.TallerDesc 			= { consider: true, parent: null, type: 'property', mask:'TallerDesc' };
  settings.Observacion 			= { consider: true, parent: null, type: 'property', mask:'Observacion' };
  settings.FechaServ 			= { consider: true, parent: null, type: 'property', mask:'FechaServ' };
  settings.HoraServ 			= { consider: true, parent: null, type: 'property', mask:'HoraServ' };
  
  parser.startElementHandler = function(name, attrs){
	    lastName = name;
	   
	    lastSetting = settings[lastName];
	    
	    if(!lastSetting || (lastSetting.consider === false && lastSetting.type === 'object')){
	        return;
	    }  
	    
	    if(lastElement === null){
	    	lastElement = result;
	    }
	    
	    if (lastSetting.type === 'object'){
	    	lsObject.push(lastName);
	    	lastElement[lsObject[lsObject.length -1]]={};
	    	numItem = [];
	    }
	    
		if(lastName === "item"){
			numItem.push(lastName);
			if(numItem.length < 2){
				lastElement[lsObject[lsObject.length -1]][lastName]=[];
				lastElement[lsObject[lsObject.length -1]][lastName].push({});
			}else{
				lastElement[lsObject[lsObject.length -1]][lastName].push({});
			}
		}  
	  };
	  	 
	  parser.characterDataHandler = function(value){
		  
		  var valor = value;
		  //mostramos solomente los de tipo property
//		  if(lastSetting.mask === 'Servicio'){
//			  valor = value.substring(5, value.length);
//		  }
		  
		  if(lastSetting.mask === 'FechaServ'){
			  var fecha = new Date(value+'T00:00:00');
			  valor = utils.formatDate(fecha, "dd/mm/yyyy");
		  }
		  
		  if(lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.consider === true){
			  lastElement[lsObject[lsObject.length -1]]["item"][numItem.length - 1][lastSetting.mask]=valor;
		  }
	  };
	  
parser.parse(xml);

return result;
}