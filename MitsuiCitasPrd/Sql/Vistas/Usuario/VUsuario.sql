create view "MITSUI_CITAS_PRD"."VUsuario"
as
select U."Id", U."IdEstado", G."Campo" as "Estado", U."FechaCreacion", 
U."Usuario", U."NumIdentificacion", U."Nombre", U."Apellido", U."Email", 
U."FechaNacimiento", U."IdTipoUsuario", G2."Campo" as "TipoUsuario"
from "MITSUI_CITAS_PRD"."Usuario" U 
inner join "MITSUI_CITAS_PRD"."Generica" G on U."IdEstado" = G."Id"
inner join "MITSUI_CITAS_PRD"."Generica" G2 on U."IdTipoUsuario" = G2."Id"
where U."IdEstado" != 25