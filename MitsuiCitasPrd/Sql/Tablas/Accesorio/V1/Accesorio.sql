CREATE COLUMN TABLE "MITSUI_CITAS_PRD"."Accesorio" (
  "Id" INTEGER NOT NULL PRIMARY KEY generated BY DEFAULT AS IDENTITY, 
  "IdEstado" INTEGER NOT NULL,
  "UsuarioCreador" NVARCHAR(32) DEFAULT CURRENT_USER NOT NULL,
  "FechaCreacion" DATETIME DEFAULT '0000-00-00 00:00:00' NOT NULL ,
  "TerminalCreacion" NVARCHAR(64) DEFAULT '127.0.0.1' NOT NULL,
  "UsuarioModificador" NVARCHAR(32) NULL,
  "FechaModificacion" DATETIME DEFAULT '0000-00-00 00:00:00'  NULL ,
  "TerminalModificacion" NVARCHAR(64) NULL,
  "IdTransaccion" NVARCHAR(32) NULL,
  "CodigoSap" NVARCHAR(16) NOT NULL,
  "TipoProducto" NVARCHAR(16) NULL,
  "Descripcion" NVARCHAR(128) NULL,
  "Precio" FLOAT NULL,
  "Marca" NVARCHAR(32) NULL,
  "Tipo" NVARCHAR(8) NULL,
  "Imagen" NVARCHAR(256) NULL
  )