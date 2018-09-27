drop table  "MITSUI_CITAS_PRD"."Usuario";
CREATE COLUMN TABLE "MITSUI_CITAS_PRD"."Usuario" (
  "Id" INTEGER NOT NULL PRIMARY KEY generated BY DEFAULT AS IDENTITY, 
  "IdEstado" INTEGER NOT NULL,
  "UsuarioCreador" NVARCHAR(32) DEFAULT CURRENT_USER NOT NULL,
  "FechaCreacion" DATETIME DEFAULT '0000-00-00 00:00:00' NOT NULL ,
  "TerminalCreacion" NVARCHAR(64) DEFAULT '127.0.0.1' NOT NULL,
  "UsuarioModificador" NVARCHAR(32) NULL,
  "FechaModificacion" DATETIME DEFAULT '0000-00-00 00:00:00'  NULL ,
  "TerminalModificacion" NVARCHAR(64) NULL,
  "IdTransaccion" NVARCHAR(32) NULL,
  "Usuario" NVARCHAR(64) NULL,
  "NumIdentificacion" NVARCHAR(16) NULL,
  "Nombre" NVARCHAR(32)  NULL,
  "Apellido" NVARCHAR(64)  NULL,
  "Email" NVARCHAR(64) NOT NULL,
  "FechaNacimiento" DATETIME DEFAULT '0000-00-00'  NULL,
  "IdTipoUsuario" INT NOT NULL
  )
  
  