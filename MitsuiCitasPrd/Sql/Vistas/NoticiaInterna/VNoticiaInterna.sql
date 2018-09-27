create view "MITSUI_CITAS_PRD"."VNoticiaInterna"
as
select NI."Id", NI."IdEstado", G."Campo" as "Estado", NI."UsuarioCreador", 
NI."FechaCreacion", NI."UsuarioModificador", NI."FechaModificacion", NI."Titulo", NI."Resumen", NI."Imagen", 
NI."FechaPublicacion", NI."FechaExpiracion", NI."Contenido"
from "MITSUI_CITAS_PRD"."NoticiaInterna" NI 
inner join "MITSUI_CITAS_PRD"."Generica" G on NI."IdEstado" = G."Id" 
where NI."IdEstado" != 25