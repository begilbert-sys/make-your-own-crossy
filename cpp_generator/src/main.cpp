#include <iostream>
#include <string>
#include <filesystem>

#include "solver.h"


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

    int board_length = strlen(board_string);
    char* board_result = (char*)malloc(board_length + 1 * sizeof(char));

    std::string result_string = Solver::solve(board_string, DIRECTORY + "/data/words.txt");
    
    for (int i = 0; i < board_length; i++) {
        board_result[i] = result_string[i];
    }
    // terminate the string 
    board_result[board_length] = '\0';
    free(board_string);
    return board_result;
    
}

}