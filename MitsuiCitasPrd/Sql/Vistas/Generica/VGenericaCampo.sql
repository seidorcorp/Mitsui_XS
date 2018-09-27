drop view "MITSUI_CITAS_PRD"."VGenericaCampo";
CREATE VIEW "MITSUI_CITAS_PRD"."VGenericaCampo" AS select
	 G."Id",
	 G."IdEstado",
	 G2."Campo" as "Estado",
	 G."FechaCreacion",
	 G."FechaModificacion",
	 G."CodigoTabla",
	 G."Campo",
	 G."DescripcionCampo",
	 G."CodigoSap",
	 G."Orden",
	 G."IdPadre",
	 G3."Campo" as "PadreDescripcion" 
from "MITSUI_CITAS_PRD"."Generica" G 
inner join "MITSUI_CITAS_PRD"."Generica" G2 on G."IdEstado"= G2."Id" 
inner join "MITSUI_CITAS_PRD"."Generica" G3 on G."IdPadre"= G3."Id" 
where G."Tipo" = 'C' 
and G."IdEstado" != 25