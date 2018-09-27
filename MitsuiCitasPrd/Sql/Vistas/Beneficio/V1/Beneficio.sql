DROP VIEW "MITSUI_CITAS_PRD"."VBeneficio" ;
CREATE VIEW "MITSUI_CITAS_PRD"."VBeneficio" 
 AS select
	 B."Id",
	 B."IdEstado",
	 G."Campo" as "Estado",
	 B."UsuarioCreador",
	 TO_VARCHAR(B."FechaCreacion",
	 'YYYY/MM/DD hh24:mm:ss') as "FechaCreacion",
	 B."UsuarioModificador",
	 TO_VARCHAR(B."FechaModificacion",
	 'YYYY/MM/DD hh24:mm:ss') as "FechaModificacion",
	 B."Titulo",
	 B."Contenido",
	 B."Url",
	 TO_VARCHAR(B."FechaPublicacion",
	 'YYYY/MM/DD hh24:mm:ss') as "FechaPublicacion",
	 TO_VARCHAR(B."FechaExpiracion",
	 'YYYY/MM/DD hh24:mm:ss') as "FechaExpiracion",
	 B."Imagen" 
from "MITSUI_CITAS_PRD"."Beneficio" B 
inner join "MITSUI_CITAS_PRD"."Generica" G on B."IdEstado" = G."Id" 
where B."IdEstado" != 25