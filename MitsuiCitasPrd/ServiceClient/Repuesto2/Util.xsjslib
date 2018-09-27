function getCreator()
{
	return "Robert Tovar y Cristian Florett";
}

function setBodyResponse(body)
{
	if (typeof body !== "string")
		{
		try 
		{
			body = JSON.stringify(body);
		}
		catch (e)
		{
			var message = e.message;
		}
		}
	
	   $.response.contentType = 'application/json';
	   $.response.setBody(body);
	   $.response.status = $.net.http.OK;
}




function createInsertQueryWithoutId(oTableInfo)
{
     var query = 'INSERT INTO '+oTableInfo.db.Schema+'.'+oTableInfo.db.Tabla+' values ('+oTableInfo.db.Sequence+',';
	    for (var i=0;i<oTableInfo.items.length-1;i++)
	    {
	        if (i<oTableInfo.items.length-2)
	        {
	             query = query + '?,';
	        }
	        else
	        {query = query + '?)';
	        }
	    }	    
	    query = query + '';
	    return query;
}

	    function handleError(message)
{
	 $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
     $.response.setBody(message);
	}
	    
