// @@ Referenciando otros utilitarios

var mainUtil = $.import("MitsuiCitasPrd.ServiceClient.Repuesto2", "Util");

// @@ Función creada por Cristian Florett
// @@ Iteración automática para poder hacer los querys más rápido
 
function getTableInfo(db)
{
	
	 var oTablaInfo = {items : [], db: db}; 
	var dbWithoutStrings = {};
	var conn;
	var query;
	var rs;
	
		dbWithoutStrings.Schema = db.Schema.replace(/"/g, '');
		dbWithoutStrings.Tabla = db.Tabla.replace(/"/g, '');
		try
	{
	conn = $.db.getConnection();
	query = conn.prepareStatement("SELECT COLUMN_NAME, POSITION, DATA_TYPE_NAME "+
	"FROM SYS.COLUMNS "+
	"WHERE SCHEMA_NAME = '"+dbWithoutStrings.Schema+"' AND TABLE_NAME = '"+dbWithoutStrings.Tabla+"' "+
	"ORDER BY POSITION");
	rs = query.executeQuery();	
  
    // $.trace.debug("Type your log comments here");
    while(rs.next())
    	{
    	oTablaInfo.items.push(
    			{
    				name: rs.getString(1),
    				position: rs.getString(2),
    				type: rs.getString(3)
    			});
	 }
    oTablaInfo.numColumnas = oTablaInfo.items.length; 
    }
	
	catch (e)
	{
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
        $.response.setBody(e.message);
        return;
	}
	
	return oTablaInfo;
}

function executeInsertWithoutId(oTableInfo, aDatos, query)
{
	var conn;
	var pstmt;
	var BatchSize;
	var isIdentity;
	var test;
	             try
            {
	   conn = $.db.getConnection();
	   pstmt = conn.prepareStatement(query);
	   BatchSize = aDatos.length;
       pstmt.setBatchSize(Object.keys(aDatos[0]).length);
       isIdentity = true;
       test = "";
        
        for (var i=0;i<BatchSize; i++)
        {
            for (var j=0; j<oTableInfo.items.length; j++)
            {
                if (oTableInfo.items[j].type === "INTEGER")
                {
                    if ((j==0) && (!isIdentity))
                    {
                    var name = oTableInfo.items[j].name;
                    //$.response.setBody(name);
                    var text = aDatos[i][name];
                    test = test + " setInt " + (j+1) + name + " "+ text+ " indice "+ j + " ";
                    pstmt.setInt(j, parseInt(text,10));
                    }
                }
                else if (oTableInfo.items[j].type === "NVARCHAR")
                {
                    var name = oTableInfo.items[j].name;
                    var text = aDatos[i][name];
                    test = test + " setString" + (j) +" " + name + " "+ text+ " indice "+ j + " ";
                     //$.response.setBody(test);
                    pstmt.setString(j, text);
                }
            }
         pstmt.addBatch();
        }
        
            if (BatchSize > 0) {
          pstmt.executeBatch();
          conn.commit();
          conn.close();
          
         // $.response.setBody("exito");
        //  pstmt.close();
        
            }
            }
            catch (e)
            {
            	handleError(e.message);
        		return;
            }
        
            return 200;
	    
}

function insertItemsWithoutId(db, aDatos)
{
	var metaTabla;
	// @@Trae información de la tabla
	metaTabla = getTableInfo(db);
	// @@ Crea el query con información de la tabla
	var query = mainUtil.createInsertQueryWithoutId(metaTabla);
	// @@ Ejecuta el query
//	var result = executeInsertWithoutId(metaTabla, aDatos, query);
	
	var body = {
			   response : query,
			   message: "Exito en la tx"
		};	 

	return body;
}

function getListItems(query)
{	
	
	
	var conn = $.db.getConnection();
	var pstmt;
	var rs;
	var output = {results : [], creador: mainUtil.getCreator(), response: 200};
    var record = {}; // Record representa un registro
    var metadata;  // La información encontrada de cada registro
	try
	{		
	        pstmt = conn.prepareStatement(query);
	        rs = pstmt.executeQuery();
	        while (rs.next()) {
	               record = {};
	               metadata = rs.getMetaData();
	               for (var columnaInicial=1; columnaInicial<=metadata.getColumnCount(); columnaInicial++)
	            	  {
	            	   // Tenemos que empezar el arreglo con 1 porque en hana
						// xs es así.
	            	   switch (metadata.getColumnTypeName(columnaInicial))
	            	   {
	            	   case ("INTEGER"):
	            	   record[metadata.getColumnName(columnaInicial)] = rs.getInteger(columnaInicial);
	            	   break;
	            	   case ("NVARCHAR"):
	            		   record[metadata.getColumnName(columnaInicial)] = rs.getString(columnaInicial);
	            	   break;
	            	   default:
	            		   record[metadata.getColumnName(columnaInicial)] = rs.getString(columnaInicial) + metadata.getColumnTypeName(columnaInicial);
	            	   break;
	            	   }
	            	  }          
	                output.results.push(record);
	        }
	        // rs.close();
	        pstmt.close();
	        conn.close();
	}
	catch(e)
	{
		handleError(e.message);
		return;
	}
    return output;

}

function getListItem(query)
{
	var conn = $.db.getConnection();
	var pstmt;
	var rs;
	var output = {creador: mainUtil.getCreator(), response: 200};
    var record = {}; // Record representa un registro
    var metadata;  // La información encontrada de cada registro
	try
	{		
	        pstmt = conn.prepareStatement(query);
	        rs = pstmt.executeQuery();
	        while (rs.next()) {
	               record = {};
	               metadata = rs.getMetaData();
	               for (var columnaInicial=1; columnaInicial<=metadata.getColumnCount(); columnaInicial++)
	            	  {
	            	   // Tenemos que empezar el arreglo con 1 porque en hana
						// xs es así.
	            	   switch (metadata.getColumnTypeName(columnaInicial))
	            	   {
	            	   case ("INTEGER"):
	            	   record[metadata.getColumnName(columnaInicial)] = rs.getInteger(columnaInicial);
	            	   break;
	            	   case ("NVARCHAR"):
	            		   record[metadata.getColumnName(columnaInicial)] = rs.getString(columnaInicial);
	            	   break;
	            	   default:
	            		   record[metadata.getColumnName(columnaInicial)] = rs.getString(columnaInicial) + metadata.getColumnTypeName(columnaInicial);
	            	   break;
	            	   }
	            	  }          
	                output.results = record;
	        }
	        rs.close();
	        pstmt.close();
	        conn.close();
	}
	catch(e)
	{
		handleError(e.message);
		return;
	}
    return output;	
	}

function deleteItem(query)
{
	var conn = $.db.getConnection();
	var pstmt;
	var rs;
	var body = {creador: mainUtil.getCreator(), response: 200};
    var record = {}; // Record representa un registro
    var metadata;  // La información encontrada de cada registro
	try
	{		
	        pstmt = conn.prepareStatement(query);
	        rs = pstmt.execute();	    
	        conn.commit();
	       
	}
	catch(e)
	{
		handleError(e.message);
		return;
	}
	finally
	{
		 pstmt.close();
	        conn.close();	
		 
	}
    return ;	
	}



// @@ F U N C I O N E S @@@@ D E P R E C A D A S

// @@ Función olvidada porque fue reemplazada por una hermana menor que está
// automatizada

// @@ Se guarda para el recuerdo
// @@ Cristian Florett Vera


function getDataFromTable2(){
  
	var query;
    query = 'SELECT * FROM \"upcdb\".\"upcdb.Entities::Cliente.Clientes\"';
    
    var output = {results: [] };
    try {
    	  var conn = $.db.getConnection();
    	  var pstmt;
    	  var rs;    	
    	  pstmt = conn.prepareStatement(query);
    	  rs = pstmt.executeQuery();

        while (rs.next()) {
               var record = {};
                record.ClienteID = rs.getString(1);
                record.TipoDocumento = rs.getString(2);
                record.NroDocumento = rs.getString(3);
                record.Nombre = rs.getString(4);
                record.Apellidos = rs.getString(5);
                record.FechaNacimiento = rs.getString(6);
                record.Direccion = rs.getString(7);
                record.Correo = rs.getString(8);
                record.Celular = rs.getString(9);
                record.Empresa = rs.getString(10);                
                output.results.push(record);
        }
        rs.close();
        pstmt.close();
        conn.close();
                } 
    catch (e) {
        $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
        $.response.setBody(e.message);
        return;
    }
    var body = JSON.stringify(output);
    $.response.contentType = 'application/json';
    $.response.setBody(body);
    $.response.status = $.net.http.OK;
}

function handleError(message)
{
	 $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
     $.response.setBody(message);
	}


