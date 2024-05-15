SELECT title, author, content, across_clues, down_clues
FROM minis
WHERE id=$1 AND rand=$2;