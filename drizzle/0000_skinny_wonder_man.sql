CREATE TABLE "races" (
	"id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "races_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"type" varchar(255),
	"location" varchar(255),
	"detailsUrl" varchar(255),
	"date" date NOT NULL,
	"hashedId" varchar(255) NOT NULL
);
