# emscripten Makefile
# yes this Makefile sucks 

# flag explanations:
# -sSINGLE_FILE=1: embeds the compiled WASM into the generated .js file. this way I don't need to load a seperate .wasm file 
# -sENVIRONMENT=web: emits code that only runs on the web
# -sMODULARIZE=1: makes the .js code importable as a module

FLAGS := -O3
EMFLAGS = -sSINGLE_FILE=1 -sENVIRONMENT=web -sMODULARIZE=1 -sEXPORTED_FUNCTIONS=_solve,_free -sEXPORTED_RUNTIME_METHODS=stringToNewUTF8,UTF8ToString --preload-file data/words.txt
srcdir := ./src
outdir := ./out

OBJECTS := $(outdir)/strutil.o $(outdir)/randutil.o $(outdir)/fixedtrie.o $(outdir)/board.o $(outdir)/solver.o

generator.js: $(outdir)/main.o
	em++ $(FLAGS) $(outdir)/main.o $(OBJECTS) -o generator.js $(EMFLAGS)

$(outdir)/main.o: $(srcdir)/main.cpp $(OBJECTS)
	em++ $(FLAGS) -c $< -o $@

$(outdir)/%.o: $(srcdir)/%.cpp $(srcdir)/%.h $(outdir)
	em++ $(FLAGS) -c $< -o $@

$(outdir)/%.o: $(srcdir)/utils/%.cpp $(srcdir)/utils/%.h $(outdir)
	em++ $(FLAGS) -c $< -o $@

$(outdir):
	mkdir out

.PHONY: clean

clean: 
	rm -rf $(outdir)
	rm generator.js
	rm generator.data