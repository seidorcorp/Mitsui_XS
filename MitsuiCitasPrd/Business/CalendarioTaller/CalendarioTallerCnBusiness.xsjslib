/* tslint:disable:no-empty */
var textAccess 					= $.import("sap.hana.xs.i18n","text");
var config 						= textAccess.loadBundle("MitsuiCitasPrd.Config","config");
var bundle 						= textAccess.loadBundle("MitsuiCitasPrd.I18n","messaje");
var utils 						= $.import("MitsuiCitasPrd.Utils","Utils");
var serviceClientCalendario		= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.CalendarioTaller","CalendarioTaller");
var serviceClientCalendarioExc	= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.CalendarioTallerExcepcion","CalendarioTallerEx");
var serviceClientCitasTaller	= $.import("MitsuiCitasPrd.ServiceClient.MitsuiC4C.CitasPendienteTaller","CitasPendienteTaller");
var oResponse				= {};


function aleatorio(inf,sup){ // Genera un número aleatorio entre inf y sup (ambos incluidos)
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

/**
 * @description Función que permite buscar taller segun filtros
 * @creation David Villanueva 28/08/2018
 * @update
 */
function generarCalendarioxFiltro(oParam){
	var oFiltro = {};
	var tiempo			= 0;
	var lis = [];
	try {
		tiempo = new Date().getTime();
		oFiltro.sCodigoCentro 		= oParam.oData.sCodigoCentro;
		oFiltro.sFechaInicio		= oParam.oData.sFechaInicio;
		oFiltro.sFechaFinal			= oParam.oData.sFechaFinal;
		//1. Buscamos el calendario por taller
		var consultarCalendarioTallerC4cResponse = serviceClientCalendario.consultarCalendarioTallerC4c(oFiltro);
		
		if(consultarCalendarioTallerC4cResponse.iCode !== parseInt(bundle.getText("code.idf1"), 10)){
			throw new TypeError(consultarCalendarioTallerC4cResponse.sMessage,'',consultarCalendarioTallerC4cResponse.iCode);
		}
//		var final = ((new Date().getTime()) - tiempo);
//		lis.push({"Proceso":"CalendarioTaller", "Tiempo": final});
		//2. Buscamos el calendaario de excepciones por taller
		tiempo = new Date().getTime();
		var oParamEx = {};
		oParamEx.sCodigoCentro 	= oParam.oData.sCodigoCentro;
		var listExcepciones = [];
		var consultarCalendarioTallerExcC4cResponse = serviceClientCalendarioExc.consultarCalendarioTallerExcC4c(oParamEx);
		
		if(consultarCalendarioTallerExcC4cResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
			listExcepciones = consultarCalendarioTallerExcC4cResponse.oData.BOCitasPorLocalExcepcion;
		}
//		var final = ((new Date().getTime()) - tiempo);
//		lis.push({"Proceso":"CalendarioTallerExcepciones", "Tiempo": final});
		
		//3. Buscamos las citas pendientes por taller
		
		tiempo = new Date().getTime();
		var oParamCitas = {};
		oParamCitas.dFechaInicio 	= oParam.oData.sFechaInicio;
		oParamCitas.dFechaFin 	= oParam.oData.sFechaFinal;
		oParamCitas.sCodigoTaller 	= oParam.oData.sCodigoCentro;
		var consultarCitasTallerC4CResponse = serviceClientCitasTaller.consultarCitasTallerC4C(oParamCitas);
		var aListaCitas = [];
		if(consultarCitasTallerC4CResponse.iCode === parseInt(bundle.getText("code.idt10"), 10)){
			throw new TypeError(consultarCitasTallerC4CResponse.sMessage,'',consultarCitasTallerC4CResponse.iCode);
		}
		if(consultarCitasTallerC4CResponse.iCode === parseInt(bundle.getText("code.idf1"), 10)){
			aListaCitas = consultarCitasTallerC4CResponse.oData.Activity;
		}
//		var final = ((new Date().getTime()) - tiempo);
//		lis.push({"Proceso":"CitasPendientesTaller", "Tiempo": final});
		
		tiempo = new Date().getTime();
		var oRespuesta			= {};
		oRespuesta.aHoras 		= [];
		oRespuesta.aListDias 	= [];
		var listDate 		= [];
		var fechaInicio 	= oFiltro.sFechaInicio;
		var fechaFinal	 	= oFiltro.sFechaFinal;
		var dateMove 		= new Date(fechaInicio+'T00:00:00');
		var strDate 		= fechaInicio;
		var num 			= 0;
		var objectDia 		= null;
		var diaSemana 		= ["DOM","LUN", "MAR", "MIE", "JUE", "VIE", "SAB" ];
		var valoresDia 		= [7,1,2,3,4,5,6 ];
		//4. Generamos el calendario de acuerdo a los parametros fechaInicial y fechaFinal
		while (strDate < fechaFinal){
		  num 					= num + 1;
		  var strDate 			= dateMove.toISOString().slice(0,10);
		  objectDia 			= {};
		  objectDia.iItem		= num;
		  objectDia.iNumDia		=  new Date(strDate+'T00:00:00').getDay();
		  objectDia.sDia		=  diaSemana[new Date(strDate+'T00:00:00').getDay()];
		  objectDia.sfecha 		= strDate;
		  objectDia.aHorarios	= [];
		  
		  //5. recorreremos la lista del calendario obtenido de C4C
		  for (var i = 0; i < consultarCalendarioTallerC4cResponse.oData.BOCitasPorLocal.length; i++) {
			  oRespuesta.aHoras.push(consultarCalendarioTallerC4cResponse.oData.BOCitasPorLocal[i].zHoraInicio.substring(0,5));
			  if(parseInt(consultarCalendarioTallerC4cResponse.oData.BOCitasPorLocal[i].zDia,10) === valoresDia[(new Date(strDate+'T00:00:00').getDay())]){
				  var hora = consultarCalendarioTallerC4cResponse.oData.BOCitasPorLocal[i].zHoraInicio;
				  var tope = parseInt(consultarCalendarioTallerC4cResponse.oData.BOCitasPorLocal[i].zTope,10);
				  
				  //6. buscamos si existen excepciones en la fecha 
				  for(var j = 0; j < listExcepciones.length; j++){
					  
					  var fechaInicio = listExcepciones[j].zFechaInicioValidez;
					  var fechaFin = listExcepciones[j].zFechaFinValidez;
					  var fechaCheck = strDate;
					  var horaInicio = listExcepciones[j].zHoraInicio;
					  var nuevoTope = parseInt(utils.convertEmptyToZero(listExcepciones[j].zTope),10);
					  var existe = existeFechaEnIntervalo(fechaInicio, fechaFin, fechaCheck);
					  if(existe && hora === horaInicio){
						  tope =  nuevoTope;
					  }
				  }
				  
				  var numCitas = 0;
				  //7. contamos las citas que se encuentran generadas x hora y fecha y estado generado:1 o estado confirmado:2
				  for(var j = 0; j < aListaCitas.length; j++){
					  if(aListaCitas[j].zFecha === strDate 
							    && aListaCitas[j].zHoraInicio === hora){
						  
						  numCitas = numCitas +1;
					  }
				  }
				  
				  
				  objectDia.aHorarios.push( 
							{
								"Hora" 			: (hora === "")? "" : hora.substring(0,5),
								"Disponibles"	: (tope - numCitas),
								"CitasGeneradas" : numCitas
							}	  
						  );
			  }
		  }
		  
		  listDate.push(objectDia);
		  dateMove.setDate(dateMove.getDate()+1);
		}
		
		
		
		oRespuesta.aHoras 			= oRespuesta.aHoras.filter( onlyUnique ).sort();
		oRespuesta.aListDias 		= listDate;
		oRespuesta.iDuracionTaller 	= parseInt(consultarCalendarioTallerC4cResponse.oData.BOCitasPorLocal[0].zDuracion, 10);
		oResponse.oData 			= oRespuesta;
		oResponse.iCode 			=  parseInt(bundle.getText("code.idf1"), 10);
		oResponse.sMessage = bundle.getText("msj.idf1");
		
//		var final = ((new Date().getTime()) - tiempo);
//		lis.push({"Proceso":"ArmarLogicaCalendario", "Tiempo": final});
//		oRespuesta.aTiempos = lis;
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


