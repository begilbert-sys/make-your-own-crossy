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
 
Note the absence of a free() call - this is because the memory
for the returned string is dallocated using Javascript!
*/

const string DIRECTORY = filesystem::current_path().string();

extern "C" {

char* solve(char* board_string) {
    Solver solver(DIRECTORY + "/data/words.txt");
    Board board(board_string);
    solver.solve(board);
    char* board_result = (char*)malloc(strlen(board_string) * sizeof(char));
    int index = 0;
    for (int row = 0; row < board.rows; row++) {
        for (int col = 0; col < board.columns; col++) {
            board_result[index++] = board.get({row, col});
        }
        board_result[index++] = '\n';
    }
    return board_result;
    
}

}

int main() {
    char* board_string = (char*)"_____\n_____\n_____\n_____\n_____";
    char* result = solve(board_string);
    cout << result << endl;
    free(result);
    return 0;
}