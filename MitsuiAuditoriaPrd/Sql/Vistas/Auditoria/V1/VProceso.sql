drop view "MITSUI_AUDITORIA_PRD"."VProceso" ;
create view "MITSUI_AUDITORIA_PRD"."VProceso" 
as
select rand()*1000 as "Id" , V."Aplicacion", V."NombreProceso" from "MITSUI_AUDITORIA_PRD"."Auditoria" V
group by V."Aplicacion", V."NombreProceso"