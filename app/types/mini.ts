/* 
represents the entire mini crossword.
this type is used for transfering data to and from the server/DB
*/
export interface Mini {
    boardString: string
    acrossClues: string[]
    downClues: string[]
}