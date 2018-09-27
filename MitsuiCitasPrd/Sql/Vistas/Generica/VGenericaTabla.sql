drop view "MITSUI_CITAS_PRD"."VGenericaTabla";
CREATE VIEW "MITSUI_CITAS_PRD"."VGenericaTabla"  AS 
select
	 G."Id",
	 G."IdEstado",
	 G2."Campo" as "Estado",
	 G."FechaCreacion",
	 G."FechaModificacion" ,
	G."CodigoTabla",
	 G."DescripcionTabla" 
from "MITSUI_CITAS_PRD"."Generica" G 
inner join "MITSUI_CITAS_PRD"."Generica" G2 on G."IdEstado"= G2."Id" 
where G."Tipo" = 'T' 
and G."IdEstado" != 25