create view "MITSUI_CITAS_PRD"."VTaller"
as
select T."Id", T."IdEstado", G."Campo" as "Estado", T."UsuarioCreador", 
T."FechaCreacion", T."UsuarioModificador", T."FechaModificacion",
T."CentroSap", T."Direccion", T."Central", T."Express", T."ServicioMantenimiento", 
T."Email", T."Latitud", T."Longitud", T."Horario1", T."Horario2", T."Horario3", T."Imagen"
from "MITSUI_CITAS_PRD"."Taller" T
inner join "MITSUI_CITAS_PRD"."Generica" G on T."IdEstado" = G."Id"
where T."IdEstado" != 23