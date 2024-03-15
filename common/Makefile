run:
	@echo "Running in Docker\n"
	@docker build -t app .
	@docker run -p 8080:8080 -it --rm --env-file .env app

dev:
	@echo "Running locally\n"
	@cd web && pnpm build && cd ..
	@air
