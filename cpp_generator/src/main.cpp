#include <iostream>
#include <string>
#include <filesystem>

#include "solver.h"
#include "matrix.h"
#include "fixedtrie.h"
#include "board.h"
#include "utils/randutil.h"


using namespace std;


/*
To call this C++ function from Javascript via wasm, emscripten requires it to be a "C style" function.
This means it must accept and return C-style strings (char*).
 
Note that the memory allocated for the returned string is actually deallocated on the Javascript side
*/

const string DIRECTORY = filesystem::current_path().string();

extern "C" {

char* solve(char* board_string) {
    srand((unsigned) time(NULL));
    
    Solver solver(DIRECTORY + "/data/words.txt");
    Board board(board_string);
    solver.solve(board);
    int board_length = strlen(board_string);
    char* board_result = (char*)malloc(board_length + 1 * sizeof(char));
    int index = 0;
    for (int row = 0; row < board.rows; row++) {
        for (int col = 0; col < board.columns; col++) {
            board_result[index++] = board.get({row, col});
        }
        board_result[index++] = '\n';
    }
    // terminate the string 
    board_result[board_length] = '\0';
    free(board_string);
    return board_result;
    
}

}