CREATE COLUMN TABLE "MITSUI_AUDITORIA_PRD"."Auditoria" (
	"Id" INTEGER NOT NULL PRIMARY KEY generated BY DEFAULT AS IDENTITY, 
	"IdTransaccion" NVARCHAR(32) , 
	"Terminal" NVARCHAR(64), 
	"Usuario" NVARCHAR(32), 
	"Aplicacion" NVARCHAR(32),
	"NombreProceso" NVARCHAR(32), 
	"ProcesoPrincipal" INTEGER DEFAULT 0 NOT NULL comment '1: true, 0: false',
	"ProcesoOrden" INTEGER DEFAULT 0 NOT NULL comment '0: proceso principal, >0 son subprocesos',	
	"FechaTransaccion" DATETIME DEFAULT '0000-00-00 00:00:00' NOT NULL ,
	"TiempoProceso" INTEGER comment 'tiempo en ns', 
	"EntradaProceso" VARCHAR(5000) comment 'input del metodo', 
	"RespuestaProceso" VARCHAR(5000) comment 'output del metodo' ,
	"Metadata" VARCHAR(5000) comment 'Informacion adicional' ,
	"Estado" NVARCHAR(16)
) 
