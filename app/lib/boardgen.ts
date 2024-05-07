import BoardGenerator from '@/cpp_generator/generator';

import { Board } from '@/app/types/board';

/* 
This is a wrapper function for the emscripten-generated C++ code 
There's some strange stuff here - for example: C++ allocates memory to
return a string, which then needs to be deallocated using Module._free().
More info here:
https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html
*/

export async function generateBoard(board: Board): Promise<Board> {
    const Module = await BoardGenerator();
    const inputPtr = Module.stringToNewUTF8(board.toString());
    const outputPtr = Module._solve(inputPtr);
    const result = Module.UTF8ToString(outputPtr);
    Module._free(outputPtr);

    const newBoard = new Board(result);
    return newBoard;

}