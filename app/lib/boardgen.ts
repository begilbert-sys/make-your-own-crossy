import BoardGenerator from '@/cpp_generator/generator';

import { CrossyJSON } from '@/app/types/crossy';

/* 
This is a wrapper function for the emscripten-generated C++ code 
There's some strange stuff here - for example: C++ allocates memory to
return a string, which then needs to be deallocated using Module._free().
More info here:
https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html
*/

export async function generateBoard(crossyJSON: CrossyJSON): Promise<CrossyJSON> {
    /* 
    Fill a board with valid letters
    */ 
    const Module = await BoardGenerator();
    const inputPtr = Module.stringToNewUTF8(crossyJSON);
    const outputPtr = Module._solve(inputPtr);
    const outputString = Module.UTF8ToString(outputPtr);
    Module._free(outputPtr);
    crossyJSON.boardString = outputString;
    return {...crossyJSON};

}