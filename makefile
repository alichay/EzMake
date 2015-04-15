.PHONY: run
.IGNORE: run
default:
	@node easymake.js
and:
	@node easymake.js
fresh:
	@node easymake.js fresh
run:
	@echo "------------- OUTPUT -------------"
	@echo
	-@sh -c "node easymake.js getFileName | sh" || true
	@echo
	@echo "----------------------------------"
	@echo
