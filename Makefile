run:
	@echo "Running in Docker\n"
	@docker build -t beerc .
	@docker run -p 8080:8080 -it --rm --env-file .env beerc

dev:
	@echo "Running locally\n"
	@cd web && pnpm build && cd ..
	@air

deploy:
	@echo "Building for production\n"
	@cd web && pnpm build && cd ..
	@fly deploy
	@echo "Deployed to fly.io\n"
	@echo "Exporting secrets\n"
	