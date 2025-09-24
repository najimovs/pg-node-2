create table users (
	id serial primary key,
	username varchar(32) unique
);

-- create table relations (
-- 	id serial primary key,
-- 	name varchar(64)
-- );

create table categories();
create table products();

-- insert into relations( name ) values ( 'Friend' ), ( 'Neighbour' ), ( 'Family' );

-- create table relationship (
-- 	id serial primary key,
-- 	a_id int references users( id ) on delete cascade on update cascade,
-- 	b_id int references users( id ) on delete cascade on update cascade,
-- 	r_id int references relations( id ) on delete cascade on update cascade
-- );

-- 1 = Father
-- 2 = Mother
-- 3 = Brother
-- 4 = Sister

insert into family (u1_id, u2_id, type) values ( 1, 42, 1 );
insert into family (u1_id, u2_id, type) values ( 1, 303, 3 );

create table posts (
	id serial primary key,
	url varchar( 255 ),
	u_id int references users( id ) on delete cascade on update cascade
);

create table comments (
	id serial primary key,
	u_id int references users( id ) on delete cascade on update cascade,
	p_id int references posts( id ) on delete cascade on update cascade,
	contents text
);

-- insert into users( username ) values ( 'bobur' ); -- 1
-- insert into users( username ) values ( 'temur' ); -- 2
-- insert into users( username ) values ( 'sanjar' ); -- 4

-- insert into posts( url, u_id ) values ('http://url_addr', 1)
-- insert into posts( url, u_id ) values ('http://url_addr', 2)
-- insert into posts( url, u_id ) values ('http://url_addr', 4)
-- insert into posts( url, u_id ) values ('http://url_addr', 2)
