build:
	cd ./frontend && npm install && npm run build

start:
	npx start-server -s ./frontend/build
