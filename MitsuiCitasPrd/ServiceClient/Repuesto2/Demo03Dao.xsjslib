// 	Librería principal para servicios de xsjs
// El chiste de esto que revisaamos la lógica antes de mandarlo al SQL


// Utilitarios 
//var utilSQL = $.import("upcdb.Business.Demo03","SQL");
//var mainUtil = $.import("upcdb.Business.Demo03", "Util");

var utilSQL = $.import("MitsuiCitasPrd.ServiceClient.Repuesto2","SQL");
var mainUtil = $.import("MitsuiCitasPrd.ServiceClient.Repuesto2","Util");

// Posterior pasar a libreria @@Hecho

// @@ Es necesario definir la base de datos (sí, con comillas)
// @@ Cristian Flowersss
//@@ Básico no mover
var db = {Schema :  '"MITSUI_CITAS_PRD"'};

// @@ Dependiente de las tablas;
//@@ Tabla cliente
db.Cliente =  '"upcdb.Entities::Cliente.Clientes"';
db.Repuesto = '"Repuesto"';
db.RepuestoSequence = '"MITSUI_CITAS_PRD"."RepuestoSEQ".NEXTVAL';
db.ClienteSequence = '"upcdb"."ClienteSEQ".NEXTVAL';

//@@Tabla Cargo
//db.Cargo = '"upcdb.Entities::Cargo.Cargo"';
//db.CargoSequence = '"upcdb"."upcdb.Entities::CargoSeq".NEXTVAL';

function insertarRepuesto(arreglo)
{
    	
	var dbDummy = {};
	dbDummy.Schema = db.Schema;
	dbDummy.Tabla = db.Repuesto;
	dbDummy.Sequence = db.RepuestoSequence;
	
	var response = utilSQL.insertItemsWithoutId(dbDummy, arreglo);	
	mainUtil.setBodyResponse(response);
    
}

function getSingleItem(query)
{
	
	// @@ ¿Debería hacer 2 querys distintos o simplemente hago el mismo query y luego lo parseo? 
	// NO POS MISMO QUERY FOREVER
}

/* @@ Hecho por Cristian Florett */ 
/* @@ Agradecimientos a Franz Portocarrero por cubrirme en el trabajo mientras yo investigaba */ 


function insertarClientes(arreglo)
{
	// @@ Permite ingresar uno o muchos
	
	// @parametros
	// db.Cliente= la tabla de clientes
	// db.Schema
	
	var dbDummy = {};
	dbDummy.Schema = db.Schema;
	
	//@@Si o sí tiene que llamarse Tabla porque se usa en la fx
	dbDummy.Tabla = db.Cliente;
	dbDummy.Sequence = db.ClienteSequence;
	
	var response = utilSQL.insertItemsWithoutId(dbDummy, arreglo);	
	mainUtil.setBodyResponse(response);
}

function insertarCargo(arreglo)
{
	// @@ Permite ingresar uno o muchos cargos
	// @parametros
	// db.Cargo = la tabla de clientes
	// db.Schema
	
	var dbDummy = {};
	dbDummy.Schema = db.Schema;
	dbDummy.Tabla = db.Cargo;
	dbDummy.Sequence = db.CargoSequence;
	
	var response = utilSQL.insertItemsWithoutId(dbDummy, arreglo);	
	mainUtil.setBodyResponse(response);
	
	
}


function insertListItems()
{
		
	
}

// Funciones generales


function buscarClientesConId(id)
{
	var query = 'SELECT * FROM "upcdb"."upcdb.Entities::Cliente.Clientes" WHERE "upcdb.Entities::Cliente.Clientes"."Id" = '+id;
	var response = utilSQL.getListItem(query);
	mainUtil.setBodyResponse(response);	
	//handleError(id)
	}

function buscarClientes(){	
	var query = 'SELECT * FROM \"upcdb\".\"upcdb.Entities::Cliente.Clientes\"';
	var body = utilSQL.getListItems(query);
	mainUtil.setBodyResponse(body);
}

function borrarCliente(id)
{
	var query = 'DELETE FROM "upcdb"."upcdb.Entities::Cliente.Clientes" WHERE "upcdb.Entities::Cliente.Clientes"."Id" = '+id;
	var body = utilSQL.deleteItem(query);
	mainUtil.setBodyResponse(body);	
	
}

function handleError(message)
{
	 $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
	 $.response.setBody(message);
	 
}
