# emscripten Makefile
# yes I know this Makefile sucks 

FLAGS := -O2
srcdir := ./src
outdir := ./out

OBJECTS := $(outdir)/strutil.o $(outdir)/randutil.o $(outdir)/fixedtrie.o $(outdir)/board.o $(outdir)/solver.o

main: $(outdir)/main.o
	em++ $(FLAGS) $(outdir)/main.o $(OBJECTS) -o main.html --preload-file data/words.txt

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
	rm main.data
	rm main.html
	rm main.js
	rm main.wasm