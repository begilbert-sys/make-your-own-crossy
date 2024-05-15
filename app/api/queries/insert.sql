-- each time a row is inserted, id is incremented 
-- and the row is assigned a random unsigned 31-bit integer 
INSERT INTO minis (rand, title, author, content, across_clues, down_clues)
VALUES (FLOOR(RANDOM() * 2147483648), $1, $2, $3, $4, $5)
RETURNING id, rand;