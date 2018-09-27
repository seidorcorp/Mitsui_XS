create view "MITSUI_CITAS_PRD"."VEvento"
as
SELECT E."Id", E."IdEstado", G."Campo" as "Estado", 
E."UsuarioCreador", TO_VARCHAR(E."FechaCreacion",'YYYY/MM/DD hh24:mm:ss') as "FechaCreacion", 
E."UsuarioModificador", TO_VARCHAR(E."FechaModificacion",'YYYY/MM/DD hh24:mm:ss') as "FechaModificacion",
E."Titulo", E."Locacion", E."Direccion", TO_VARCHAR(E."FechaPublicacion",'YYYY/MM/DD hh24:mm:ss') as "FechaPublicacion",  
TO_VARCHAR(E."FechaInicio",'YYYY/MM/DD hh24:mm:ss') as "FechaInicio", 
TO_VARCHAR(E."FechaFin",'YYYY/MM/DD hh24:mm:ss') as "FechaFin", E."HoraEvento", E."Imagen" 
 FROM "MITSUI_CITAS_PRD"."Evento" E
inner join "MITSUI_CITAS_PRD"."Generica" G on E."IdEstado" = G."Id"
where E."IdEstado" != 25