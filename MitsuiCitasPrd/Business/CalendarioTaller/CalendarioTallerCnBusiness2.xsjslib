/* tslint:disable:no-empty */
var textAccess 					= $.import("sap.hana.xs.i18n","text");
var config 						= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var serviceClientCitasTaller	= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.CitasPendienteTaller","CitasPendienteTaller");
var tallerHorarioCnDao 			= $.import("MitsuiCitasPrd.Dao.Taller","TallerHorarioCnDao");
var oResponse					= {};

function aleatorio(inf,sup){ // Genera un número aleatorio entre inf y sup
								// (ambos incluidos)
	var numP = sup - inf; 
	var rnd = Math.random() * numP;
	rnd = Math.round(rnd);
	return parseInt(inf,10) + rnd;
} 

function existeFechaEnIntervalo(fechaInicio, fechaFin, fechaCheck){
	var response = false;
	var from = Date.parse(fechaInicio+'T00:00:00');
	var to   = Date.parse(fechaFin+'T00:00:00');
	var check = Date.parse(fechaCheck+'T00:00:00' );
	if(check <= to && check >= from){
		response =  true;
	} 
	return response;
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function obtenerSemanas(ListaDias, aHoras) {
	 var semanas = [];
	 var iTiempoServidor = parseInt(config.getText("horas.adelantado.servidor"), 10);
	 var nombreMes = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
	 var FechaActual  	= new Date();
	 FechaActual.setHours(FechaActual.getHours() + iTiempoServidor);
	 var sFechaActual = utils.formatDate(FechaActual, "yyyy-mm-dd");
	 try {
		var Columnas = [];
		for (var i = 0; i < aHoras.length; i++) {
	        var itemHora = aHoras[i];
	        Columnas.push({
	          rango: itemHora
	        });
		}
	
	  var nSemanas = (ListaDias.length / 7).toString().split(".")[0];
	 
	  for (var i = 0; i < nSemanas; i++) {
	    var nroSemana = (i * 7);
	    var objetoSemana = {};
	    objetoSemana.Id = nroSemana;
	    objetoSemana.Columnas = Columnas;
	    objetoSemana.Dias = [];
	    objetoSemana.Data = [];
	    objetoSemana.Mes = "";
	    var contadorPrimerDia = 0;
	    for (var j = 0; j < ListaDias.length; j++) {
	      var itemDias = ListaDias[j];
	      if (itemDias.iItem - 1 >= objetoSemana.Id && itemDias.iItem - 1 < (objetoSemana.Id + 7)) {
	        if (contadorPrimerDia === 0) {
	          objetoSemana.Mes = nombreMes[new Date(itemDias.sfecha+"T00:00:00").getMonth()]
	        }
	        objetoSemana.Dias.push(itemDias);
	        contadorPrimerDia++;
	        var contadorData = 0;
	        for (var x = 0; x < objetoSemana.Columnas.length; x++) {
	          var itemColumna = objetoSemana.Columnas[x];
	          contadorData++;
	          var itemData = {
	            ItemId: contadorData,
	            ItemDiaDesc: itemDias.sDia,
	            ItemDiaNum: itemDias.iNumDia,
	            ItemNum: itemDias.iItem,
	            ItemFecha: itemDias.sfecha,
	            ItemDisponibles: 0,
	            ItemHora: itemColumna.rango
	          }

	          for (var y = 0; y < itemDias.aHorarios.length; y++) {
	            var itemHorario = itemDias.aHorarios[y];
	            var isPasado = !utils.validarFechaMayor(new Date(itemData.ItemFecha + 'T' + itemData.ItemHora), FechaActual);
	            if (itemHorario.Hora === itemData.ItemHora && !isPasado) {
	              itemData.ItemDisponibles = itemHorario.Disponibles;
	            }
	          }
	          objetoSemana.Data.push(itemData);
	        }
	      }
	    }
	    semanas.push(objetoSemana);
	  }
	  
	}catch(e){
		semanas.push(e.toString());
	}
	  return semanas;
	}

/**
 * @description Función que permite buscar taller segun filtros
 * @creation David Villanueva 28/08/2018
 * @update
 */
function generarCalendarioxFiltro(oParam){
	var tiempo			= 0;
	var lis = [];
	try {
		tiempo = new Date().getTime();
		// 1. Buscamos el calendario por taller
		var oParamHorario 		= {};
		oParamHorario.iIdEstado = 23;
		oParamHorario.sCodTaller=oParam.oData.sCodigoCentro;
		var consultarTallerHorarioxFiltroResponse = tallerHorarioCnDao.consultarTallerHorarioxFiltro(oParamHorario);
		if(consultarTallerHorarioxFiltroResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarTallerHorarioxFiltroResponse.sMessage,'',consultarTallerHorarioxFiltroResponse.iCode);
		}
		// 2. Buscamos las citas pendientes por taller
		tiempo = new Date().getTime();
		var oParamCitas = {};
		oParamCitas.dFechaInicio 	= oParam.oData.sFechaInicio;
		oParamCitas.dFechaFin 		= oParam.oData.sFechaFinal;
		oParamCitas.sCodigoTaller 	= oParam.oData.sCodigoCentro;
		var consultarCitasTallerC4CResponse = serviceClientCitasTaller.consultarCitasTallerC4C(oParamCitas);
		var aListaCitas = [];
		if(consultarCitasTallerC4CResponse.iCode === parseInt(bundle.getText("code.idt10"), 10)){
			throw new TypeError(consultarCitasTallerC4CResponse.sMessage,'',consultarCitasTallerC4CResponse.iCode);
		}
		if(consultarCitasTallerC4CResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
			aListaCitas = consultarCitasTallerC4CResponse.oData.Activity;
		}
		var oRespuesta			= {};
		oRespuesta.aHoras 		= [];
		oRespuesta.aTiempos 		= [];
		oRespuesta.aListDias 	= [];
		var listDate 		= [];
		var fechaInicio 	= oParam.oData.sFechaInicio;
		var fechaFinal	 	= oParam.oData.sFechaFinal;
		var dateMove 		= new Date(fechaInicio+'T00:00:00');
		var strDate 		= fechaInicio;
		var num 			= 0;
		var objectDia 		= null;
		var diaSemana 		= ["DOM","LUN", "MAR", "MIE", "JUE", "VIE", "SAB" ];
		var valoresDia 		= [7,1,2,3,4,5,6 ];
		// 4. Generamos el calendario de acuerdo a los parametros fechaInicial y
		// fechaFinal
		while (strDate < fechaFinal){
		  num 					= num + 1;
		  var strDate 			= dateMove.toISOString().slice(0,10);
		  objectDia 			= {};
		  objectDia.iItem		= num;
		  objectDia.iNumDia		=  new Date(strDate+'T00:00:00').getDay();
		  objectDia.sDia		=  diaSemana[new Date(strDate+'T00:00:00').getDay()];
		  objectDia.sfecha 		= strDate;
		  objectDia.aHorarios	= [];
		  
		  // 5. recorreremos la lista del calendario obtenido de C4C
		  for (var i = 0; i < consultarTallerHorarioxFiltroResponse.oData.length; i++) {
			  oRespuesta.aHoras.push(consultarTallerHorarioxFiltroResponse.oData[i].sHora);
			  if(consultarTallerHorarioxFiltroResponse.oData[i].iNumDia === valoresDia[(new Date(strDate+'T00:00:00').getDay())]){
				  var hora = consultarTallerHorarioxFiltroResponse.oData[i].sHora;
				  // 6. buscamos si existen excepciones en la fecha
				  var numCitas = 0;
				  // 7. contamos las citas que se encuentran generadas x hora
					// y fecha y estado generado:1 o estado confirmado:2
				  for(var j = 0; j < aListaCitas.length; j++){
					  if(aListaCitas[j].zFecha === strDate 
							    && aListaCitas[j].zHoraInicio.substr(0,5) === hora){
						  numCitas = numCitas +1;
					  }
				  }
				  
				  objectDia.aHorarios.push( 
							{
								"Hora" 			: (hora === "")? "" : hora.substr(0,5),
								"Disponibles"	: (consultarTallerHorarioxFiltroResponse.oData[i].iDisponible - numCitas),
								"CitasGeneradas" : numCitas
							}	  
						  );
			  }
		  }
		  
		  listDate.push(objectDia);
		  dateMove.setDate(dateMove.getDate()+1);
		}
		
		var obtenerSemanasResponse = obtenerSemanas(listDate, oRespuesta.aHoras.filter( onlyUnique ).sort());
		// oRespuesta.aHoras = oRespuesta.aHoras.filter( onlyUnique ).sort();
		// oRespuesta.aListDias = listDate;
		// oRespuesta.iDuracionTaller = 15;
		oRespuesta.oSemanas			= obtenerSemanasResponse;
		oResponse.oData 			= oRespuesta;
		oResponse.iCode 			=  parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
		
	}catch(e){
		if (e instanceof TypeError) {
			oResponse.iCode = e.lineNumber;
			oResponse.sMessage = e.message;
		}else{
			oResponse.iCode =  parseInt(bundle.getText("code.idt2"), 10);
			oResponse.sMessage = bundle.getText("msj.idt2",[e.toString()]);
		}	
	}
	return oResponse;
}


