create or replace function add_numbers(a integer, b integer)
RETURNS integer AS $$
BEGIN
	RETURN a + b + a;

END;
$$ LANGUAGE plpgsql;

-- 

create table mijozlar(
 id serial primary key,
 username varchar(32) not null,
 balance float default 0
);

create table tolovlar (
	id serial primary key,
	yuboruvchi_id int references mijozlar( id ),
	oluvchi_id int references mijozlar( id ),
	qiymat float not null,
	vaqti timestamp default current_timestamp
);

insert into mijozlar(username) values
('dior'),
('xojiakbar'),
('rano'),
('munisaxon'),
('bobur'),
('ali'),
('sunnat'),
('oybek'),
('azimbek'),
('bro'),
('sanjar'),
('ixtiyor')
;

create table logs(
	id serial primary key,
	mijoz_id int references mijozlar( id ),
	prev_name varchar( 32 ) not null,
	updated_at timestamp default current_timestamp
);

insert into tolovlar(yuboruvchi_id, oluvchi_id, qiymat) values (8, 2, 65);

CREATE OR REPLACE FUNCTION exchange()
RETURNS TRIGGER AS $$
BEGIN

	UPDATE mijozlar SET balance = balance - NEW.qiymat where id = NEW.yuboruvchi_id;
	UPDATE mijozlar SET balance = balance + NEW.qiymat where id = NEW.oluvchi_id;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER exchange_trigger AFTER INSERT ON tolovlar
FOR EACH ROW EXECUTE PROCEDURE exchange()
;
