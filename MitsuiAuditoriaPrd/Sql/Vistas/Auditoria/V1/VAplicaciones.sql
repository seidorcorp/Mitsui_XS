CREATE VIEW "MITSUI_AUDITORIA_PRD"."VAplicacion" 
AS select
	 rand()*1000 as "Id" ,
	 SA."Aplicacion" 
from ( select
	 distinct A."Aplicacion" 
	FROM "MITSUI_AUDITORIA_PRD"."Auditoria" A ) SA 

-- Prueba