create database pulsador;
use pulsador;

create table puls
(
usuario varchar(40),
cantidad int,
constraint pk_usuario primary key(usuario)
)
engine=InnoDB;
