-- each time a row is inserted 
-- the id is incremented 
-- and the row is assigned a random unsigned 31-bit integer 
INSERT INTO minis (rand, content)
VALUES (FLOOR(RANDOM() * 2147483648), $1)
RETURNING id, rand, content;