{
  description = "Discord Bot for all things Lunaro";

  inputs = {
    nixpkgs.url = "nixpkgs/nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";

    rust = {
      url = "github:oxalica/rust-overlay";
      inputs = {
        nixpkgs.follows = "nixpkgs";
        flake-utils.follows = "utils";
      };
    };
  };

  outputs = { self, nixpkgs, utils, rust }: utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs {
        inherit system;
        overlays = [ (import rust) ];
      };
      ssl-toolchain = with pkgs; [
        openssl.dev
        pkg-config
      ];
      rust-toolchain = with pkgs; [
        (rust-bin.stable.latest.default.override {
          extensions = [ "rust-src" ];
        })
      ];
      cargoToml = builtins.fromTOML (builtins.readFile ./Cargo.toml);
    in
    with pkgs; {
      packages.default = rustPlatform.buildRustPackage {
        inherit (cargoToml.package) name version;

        src = ./.;
        cargoLock.lockFile = ./Cargo.lock;

        # https://github.com/sfackler/rust-openssl/issues/1663#issuecomment-1541050597
        nativeBuildInputs = lib.optionals stdenv.isLinux [ pkg-config ];
        buildInputs = lib.optionals stdenv.isLinux [ openssl openssl.dev ];
        OPENSSL_NO_VENDOR = 1;
      };

      devShells.default = mkShell {
        name = "${cargoToml.package.name}-${cargoToml.package.version}";
        buildInputs = rust-toolchain ++ ssl-toolchain;
        shellHook = ''
          echo
          echo "The near Moon eclipses the far Sun."
          echo
          echo "                                       ....                              ..=#%#."
          echo "                                    .+%@@@#                            -*@@@@@@:"
          echo "                       :.          =@@*@@@+.=++-                     .#@@=+@@@%."
          echo "                    =%@@#        :@@%:-@@@%@@#=.         ...       :#@@@:.#@@#."
          echo "                    #@@@+        -@@. #@@@%-      :=+#%@@@@@%-     %@@@%+@@%-"
          echo "                    :=.           :. :@@@=     :*@@@@%++++*%%*    .@@@@@%=."
          echo " :=*#%%**+--..--       :=***+=-:.    =*-    -*%@@@@@%*+=-.         :=--"
          echo "*%#****%@@@@@@@@=.   +%@%*#%@@@@@@#**%#    *@@@@@@%%%@@@@@@+."
          echo "        .-#@@@@@@@%+:.      .:+%@@@@@@@*-.  . ..       :+%@@%."
          echo "           .@@@@@@@@@@%*=.      .=#@@@@@@@%*=:            .+@#."
          echo "            ..   .-+%@@@@@@#*=:. .-@#+=*%@@@@@@%*=.         -="
          echo "                     .:=#@@@@@@@@@@#.     :+%@@@@@@@#=:"
          echo "                          .--+**=-.          ..=*%@@@@@%*+-."
          echo "                                                   :=*%@@@@@%*=-."
          echo "                                                       .=*%@@@@@@%+:"
          echo "                                                           .-+#@@@@@@%*=."
          echo "                                                                .=*%@@@@@@@%*#%*"
          echo
          echo "- $(rustc --version)"
          echo "- $(cargo --version)"
          echo
        '';
      };
    });
}
