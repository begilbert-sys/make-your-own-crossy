import BoardGenerator from '@/cpp_generator/generator';

/* 
This is a wrapper function for the emscripten-generated C++ code 
There's some strange stuff here - for example: C++ allocates memory to
return a string, which then needs to be deallocated using Module._free().
More info here:
https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html
*/

export async function generateBoard() {
    const Module = await BoardGenerator();
    const inputPtr = Module.stringToNewUTF8("___\n___\n___");
    const outputPtr = Module._solve(inputPtr);
    const result = Module.UTF8ToString(outputPtr);
    console.log(result);
    Module._free(outputPtr);
}