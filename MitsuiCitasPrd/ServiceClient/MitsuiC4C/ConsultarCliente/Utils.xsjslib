
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
	  var settings 		= {};
	  settings.Customer 				= { consider: true, parent: null, type: 'object' };
	  settings.ChangeStateID 			= { consider: true, parent: 'Customer', type: 'property', mask:'ChangeStateID' };
//	  settings.UUID 					= { consider: true, parent: 'Customer', type: 'property', mask:'UUID' };
	  settings.InternalID 				= { consider: true, parent: 'Customer', type: 'property', mask:'InternalID' };
	  settings.SystemAdministrativeData	= { consider: true, parent: 'Customer', type: 'object' };
	  settings.CreationDateTime 		= { consider: true, parent: 'SystemAdministrativeData', type: 'property', mask:'CreationDateTime' };
	  settings.CreationIdentityUUID 	= { consider: true, parent: 'SystemAdministrativeData', type: 'property', mask:'CreationIdentityUUID' };
	  settings.LastChangeDateTime 		= { consider: true, parent: 'SystemAdministrativeData', type: 'property', mask:'LastChangeDateTime' };
	  settings.LastChangeIdentityUUID 	= { consider: true, parent: 'SystemAdministrativeData', type: 'property', mask:'LastChangeIdentityUUID' };
	  
	  settings.CategoryCode 				= { consider: true, parent: 'Customer', type: 'property', mask:'CategoryCode' };
	  settings.ProspectIndicator 			= { consider: true, parent: 'Customer', type: 'property', mask:'ProspectIndicator' };
	  settings.LifeCycleStatusCode 			= { consider: true, parent: 'Customer', type: 'property', mask:'LifeCycleStatusCode' };
	  settings.Organisation					= { consider: true, parent: 'Customer', type: 'object' };
	  settings.FirstLineName 				= { consider: true, parent: 'Organisation', type: 'property', mask:'FirstLineName' };
	  
	  settings.LegalCompetenceIndicator 	= { consider: true, parent: 'Customer', type: 'property', mask:'LegalCompetenceIndicator' };
	  
	  settings.AddressInformation			= { consider: true, parent: 'Customer', type: 'object' };
	 // settings.UUID 						= { consider: true, parent: 'AddressInformation', type: 'property', mask:'UUIDs' };
	  settings.CurrentAddressSnapshotUUID 	= { consider: true, parent: 'AddressInformation', type: 'property', mask:'CurrentAddressSnapshotUUID' };
	  
	  settings.AddressUsage					= { consider: true, parent: 'AddressInformation', type: 'object' };
	  settings.AddressUsageCode 			= { consider: true, parent: 'AddressUsage', type: 'property', mask:'AddressUsageCode' };
	  
	  settings.Role							= { consider: true, parent: 'Customer', type: 'object' };
	  settings.RoleCode 					= { consider: true, parent: 'Role', type: 'property', mask:'RoleCode' };
	  
	  settings.RoleDescription 				= { consider: true, parent: 'Customer', type: 'property', mask:'RoleDescription' };
	  
	  
	  settings.DirectResponsibility			= { consider: true, parent: 'Customer', type: 'object' };
	  settings.PartyRoleCode 				= { consider: true, parent: 'DirectResponsibility', type: 'property', mask:'PartyRoleCode' };
	  settings.EmployeeID 					= { consider: true, parent: 'DirectResponsibility', type: 'property', mask:'EmployeeID' };
	  settings.EmployeeUUID 				= { consider: true, parent: 'DirectResponsibility', type: 'property', mask:'EmployeeUUID' };
	  settings.DefaultIndicator 			= { consider: true, parent: 'DirectResponsibility', type: 'property', mask:'DefaultIndicator' };
	  
	  settings.ProcessingConditions 		= { consider: true, parent: null, type: 'object' };
	  settings.ReturnedQueryHitsNumberValue = { consider: true, parent: 'ProcessingConditions', type: 'property', mask:'ReturnedQueryHitsNumberValue' };
	  settings.MoreHitsAvailableIndicator 	= { consider: true, parent: 'ProcessingConditions', type: 'property', mask:'MoreHitsAvailableIndicator' };
	  settings.LastReturnedObjectID 		= { consider: true, parent: 'ProcessingConditions', type: 'property', mask:'LastReturnedObjectID' };
	  
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
		    
		    if (lastSetting.type === 'object' && lastSetting.parent === "Customer"){
		    	lastElement["Customer"][lastName] = {};
		    }
		    
		    if (lastSetting.type === 'object' && lastSetting.parent === "ProcessingConditions"){
		    	lastElement["ProcessingConditions"][lastName] = {};
		    }
		    
		    if (lastSetting.type === 'object' && lastSetting.parent === "AddressInformation"){
		    	lastElement["Customer"]["AddressInformation"][lastName] = {};
		    }
		    
		    if (lastSetting.type === 'object' && lastSetting.parent === "AddressUsage"){
		    	lastElement["Customer"]["AddressInformation"][lastName] = {};
		    }
		    
		  };
		  
		  parser.characterDataHandler = function(value){
			  //mostramos solomente los de tipo property
			  if(lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.parent === "Customer"){
					  lastElement[lastSetting.parent][lastSetting.mask] = value;
			  }
			  
			  if(lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.parent === "SystemAdministrativeData"){
				  lastElement["Customer"][lastSetting.parent][lastSetting.mask] = value;
			  }
			  
			  if(lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.parent === "Organisation"){
				  lastElement["Customer"][lastSetting.parent][lastSetting.mask] = value;
			  }
			  
			  if(lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.parent === "AddressInformation"){
				  lastElement["Customer"][lastSetting.parent][lastSetting.mask] = value;
			  }
			  
			  if(lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.parent === "AddressUsage"){
				  lastElement["Customer"]["AddressInformation"][lastSetting.parent][lastSetting.mask] = value;
			  }
			  
//			  if(lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.parent === "Role"){
//				  lastElement["Customer"][lastSetting.parent][lastSetting.mask] = value;
//			  }
//			  
			  if(lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.parent === "DirectResponsibility"){
				  lastElement["Customer"][lastSetting.parent][lastSetting.mask] = value;
			  }
			  
			  if(lastSetting !== undefined && lastSetting.type === 'property' && lastSetting.parent === "ProcessingConditions"){
				  lastElement[lastSetting.parent][lastSetting.mask] = value;
			  }
		  };
	  parser.parse(xml);
	  
	  return result;
}