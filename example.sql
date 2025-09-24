-- SQL = STRUCTURED QUERY LANGUAGE
/*
	Multi-line comment

	PostgreSQL, MySQL, MS SQL, Oracle, ...
*/

select 'Hi!';

CREATE DATABASE superapp;

CREATE TABLE users (
	id int,
	username varchar( 32 ),
	is_cary boolean,
	age int
);

-- Retrieve all data from table
select * from users;

select id, username from users;

insert into users
(id, username, is_cary, age) values
( 1, 'ali', true, 20 );

insert into users
(id, username, is_cary, age) values
( 2, 'dior', true, 19 ),
( 3, 'xojiakbar', false, 17 ),
( 4, 'rano', false, 18 ),
( 5, 'munisaxon', false, 18 )
;

SELECT
	username,
	is_cary
FROM
	users
;
