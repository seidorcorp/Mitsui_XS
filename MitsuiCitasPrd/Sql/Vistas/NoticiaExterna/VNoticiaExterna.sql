create view "MITSUI_CITAS_PRD"."VNoticiaExterna"
as
SELECT NE."Id", NE."IdEstado", G."Campo" as "Estado", NE."UsuarioCreador", 
TO_VARCHAR(NE."FechaCreacion", 'YYYY/MM/DD hh24:mm:ss') as "FechaCreacion", 
NE."UsuarioModificador", TO_VARCHAR(NE."FechaModificacion", 'YYYY/MM/DD hh24:mm:ss') as "FechaModificacion",
NE."Titulo", NE."Resumen", NE."Url", TO_VARCHAR(NE."FechaFuente", 'YYYY/MM/DD hh24:mm:ss') as "FechaFuente",
TO_VARCHAR(NE."FechaPublicacion", 'YYYY/MM/DD hh24:mm:ss') as "FechaPublicacion",
TO_VARCHAR(NE."FechaExpiracion", 'YYYY/MM/DD hh24:mm:ss') as "FechaExpiracion",
NE."Imagen"
FROM "MITSUI_CITAS_PRD"."NoticiaExterna" NE 
inner join "MITSUI_CITAS_PRD"."Generica" G on NE."IdEstado" = G."Id" 
where NE."IdEstado" != 25