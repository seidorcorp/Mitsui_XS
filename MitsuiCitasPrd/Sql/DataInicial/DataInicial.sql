-----Importante---
--Debemos inicializar desde 100 la sequencia de la tabla generica para reservar 1 al 100 para configuraciones del sistema
--------FIN-------
INSERT INTO "MITSUI_CITAS_PRD"."Generica" ("Id","IdEstado") VALUES (1,25);
INSERT INTO "MITSUI_CITAS_PRD"."Generica"  ("Id","IdEstado","FechaCreacion","TerminalCreacion","CodigoTabla","DescripcionTabla","Fuente","Tipo") VALUES (10,23,NOW(),'127.0.0.1','tipo_usuario','Tipos de Usuario','SCP','T');
INSERT INTO "MITSUI_CITAS_PRD"."Generica"  ("Id","IdEstado","FechaCreacion","TerminalCreacion","CodigoTabla","Campo","DescripcionCampo","Orden","Fuente","Tipo", "IdPadre") VALUES (11,23,NOW(),'127.0.0.1','tipo_usuario','Marketing','Usuario Analista Mitsui',1,'SCP','C',1);
INSERT INTO "MITSUI_CITAS_PRD"."Generica"  ("Id","IdEstado","FechaCreacion","TerminalCreacion","CodigoTabla","Campo","DescripcionCampo","Orden","Fuente","Tipo", "IdPadre") VALUES (12,23,NOW(),'127.0.0.1','tipo_usuario','Movil','Usuario Movil',2,'SCP','C',1);

INSERT INTO "MITSUI_CITAS_PRD"."Generica"  ("Id","IdEstado","FechaCreacion","TerminalCreacion","CodigoTabla","DescripcionTabla","Fuente","Tipo") VALUES (22,23,NOW(),'127.0.0.1','estado','Tabla de estados','SCP','T');
INSERT INTO "MITSUI_CITAS_PRD"."Generica"  ("Id","IdEstado","FechaCreacion","TerminalCreacion","CodigoTabla","Campo","DescripcionCampo","Orden","Fuente","Tipo", "IdPadre") VALUES (23,23,NOW(),'127.0.0.1','estado','Activo','Estado Activo',1,'SCP','C',1);
INSERT INTO "MITSUI_CITAS_PRD"."Generica"  ("Id","IdEstado","FechaCreacion","TerminalCreacion","CodigoTabla","Campo","DescripcionCampo","Orden","Fuente","Tipo", "IdPadre") VALUES (24,23,NOW(),'127.0.0.1','estado','Desactivo','Estado Desactivo',2,'SCP','C', 1);
INSERT INTO "MITSUI_CITAS_PRD"."Generica"  ("Id","IdEstado","FechaCreacion","TerminalCreacion","CodigoTabla","Campo","DescripcionCampo","Orden","Fuente","Tipo", "IdPadre") VALUES (25,23,NOW(),'127.0.0.1','estado','Eliminado','Estado Eliminado',3,'SCP','C',1);
INSERT INTO "MITSUI_CITAS_PRD"."Generica"  ("Id","IdEstado","FechaCreacion","TerminalCreacion","CodigoTabla","Campo","DescripcionCampo","Orden","Fuente","Tipo", "IdPadre") VALUES (26,23,NOW(),'127.0.0.1','estado','Bloqueado','Estado Bloqueado',4,'SCP','C',1);
