default: build

all: build

test: build
	cargo test

build:
	stellar contract build
	@ls -la target/wasm32v1-none/release/*.wasm

fmt:
	cargo fmt --all

clean:
	cargo clean
