CREATE COLUMN TABLE "MITSUI_CITAS_PRD"."NoticiaInterna" (
  "Id" INTEGER NOT NULL PRIMARY KEY generated BY DEFAULT AS IDENTITY, 
  "IdEstado" INTEGER NOT NULL,
  "UsuarioCreador" NVARCHAR(32) DEFAULT CURRENT_USER NOT NULL,
  "FechaCreacion" DATETIME DEFAULT '0000-00-00 00:00:00' NOT NULL ,
  "TerminalCreacion" NVARCHAR(64) DEFAULT '127.0.0.1' NOT NULL,
  "UsuarioModificador" NVARCHAR(32) NULL,
  "FechaModificacion" DATETIME DEFAULT '0000-00-00 00:00:00'  NULL ,
  "TerminalModificacion" NVARCHAR(64) NULL,
  "IdTransaccion" NVARCHAR(32) NULL,
  "Titulo" NVARCHAR(128) NULL,
  "Resumen" NVARCHAR(256) NULL,
  "Imagen" NVARCHAR(128) NULL,
  "FechaPublicacion" DATETIME DEFAULT '0000-00-00 00:00:00'  NULL ,
  "FechaExpiracion" DATETIME DEFAULT '0000-00-00 00:00:00'  NULL ,
  "Contenido" TEXT
  )