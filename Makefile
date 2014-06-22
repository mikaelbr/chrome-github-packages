DEST = "chrome-github-packages"
SRCS = extension/*

GOOGLE = /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome

default:
	@echo "To generate a chrome-github-packages.zip run:"
	@echo "  make zipfile"
	@echo "To generate a chrome-github-packages.crx package run:"
	@echo "  make all"
	@echo "To clean up and prepare for checkin:"
	@echo "  make clean"

all: chrome-github-packages.crx

zipfile : $(SRCS)
	@-rm -rf chrome-github-packages.zip 2>/dev/null || true
	@-rm -rf $(DEST) 2>/dev/null || true
	@mkdir $(DEST)
	@cp $(SRCS) $(DEST)
	zip -r chrome-github-packages.zip $(DEST)

chrome-github-packages.crx : $(SRCS)
	@-rm -rf chrome-github-packages.crx 2>/dev/null || true
	@-rm -rf $(DEST) 2>/dev/null || true
	@mkdir $(DEST)
	@cp $(SRCS) $(DEST)
ifeq ($(wildcard chrome-github-packages.pem),)
	$(GOOGLE) --pack-extension=$(DEST)
else
	$(GOOGLE) --pack-extension=$(DEST) --pack-extension-key=chrome-github-packages.pem
endif

test:
	@-rm -rf $(DEST) 2>/dev/null || true
	@mkdir $(DEST)
	@cp $(SRCS) $(DEST)
	$(GOOGLE) --enable-extensions --load-extension=$(DEST)

clean:
	@-rm *.zip 2>/dev/null || true
	@-rm *.crx 2>/dev/null || true
	@-rm -rf $(DEST) 2>/dev/null || true

# End
