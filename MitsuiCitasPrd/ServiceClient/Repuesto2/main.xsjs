var Demo03Dao = $.import("MitsuiCitasPrd.ServiceClient.Repuesto2","Demo03Dao");

function queryById()
{
	var id = $.request.parameters.get("id");
	if (!id) {
		var message = "Te falta especificar el id";
		Demo03Dao.handleError(message);
	}
	else
		{
		Demo03Dao.buscarClientesConId(id);
		}
}

function insertRepuesto()
{
	var vBody = $.request.body;

	if ((!vBody))
		{
		var message = "El archivo Data es incorrecto";
		Demo03Dao.handleError(message);
		}
	else
		{
		var oBody = JSON.parse(vBody.asString());
		var userArray = oBody.data;
		Demo03Dao.insertarRepuesto(userArray);
		}
}

function insertCargo()
{
	var vBody = $.request.body;

	if ((!vBody))
		{
		var message = "El archivo Data es incorrecto";
		Demo03Dao.handleError(message);
		}
	else
		{
		var oBody = JSON.parse(vBody.asString());
		var userArray = oBody.data;
		Demo03Dao.insertarCargo(userArray);
		}
	}

function deleteClient()
{
    var id = $.request.parameters.get("id");
    if (!id) {
		var message = "Te falta especificar el id";
		Demo03Dao.handleError(message);
	}
	else
		{
		Demo03Dao.borrarCliente(id);
		}
    
}

	var db = {
			Cliente : '"upcdb.Entities::Cliente.Clientes"',
			Schema : '"upcdb"'
	};
var aCmd = $.request.parameters.get('type');

// @@ Este xsjs recibirá la información de la aplicación
switch (aCmd) {
		// @@ Este caso es para buscar toda la información de los clientes
		case "queryAll":
			queryAll();
        break;
        
        // @@ Permite buscar a traves del campo Id
    case "queryById":
    		queryById();
    break;
    
    case "insertRepuesto":
        insertRepuesto();
        break;
    	
    case "insertClient":
    		insertClient();
    	break;
    	
    	case "deleteClient":
    	    deleteClient();
    	    break;
    	    
    	case "insertCargo":
    		insertCargo();
    		break;
    	
    	// @@ En caso no hayamos encontrado nada se referencia acá
    default:
    	var message = "El comando type especificado no es correcto: "+aCmd;
    Demo03Dao.handleError(message);
        //$.response.setBody('El comando especificado no es correcto', aCmd);
}





	    