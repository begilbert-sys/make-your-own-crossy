INSERT INTO minis (rand, content)
VALUES (FLOOR(RANDOM() * 2147483648), $1)
RETURNING id, rand, content;