-- content is the contents of the board as a string
-- rand is a random integer assigned to each row 
CREATE TABLE IF NOT EXISTS minis (
    id SERIAL NOT NULL,
    rand INTEGER NOT NULL,
    content VARCHAR(72) NOT NULL,
    PRIMARY KEY (id)
);