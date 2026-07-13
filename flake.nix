{
  description = "Discord Bot for all things Lunaro";

  inputs = {
    nixpkgs.url = "nixpkgs/nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";

    treefmt-nix.url = "github:numtide/treefmt-nix";

    rust = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = inputs:
    inputs.utils.lib.eachDefaultSystem (
      system: let
        pkgs = inputs.nixpkgs.legacyPackages.${system}.appendOverlays [
          inputs.rust.overlays.default
        ];
        rust = rec {
          toolchain = pkgs.rust-bin.fromRustupToolchainFile ./rust-toolchain.toml;
          platform = pkgs.makeRustPlatform {
            cargo = toolchain;
            rustc = toolchain;
          };
        };
        treefmt = inputs.treefmt-nix.lib.evalModule pkgs {
          projectRootFile = "flake.nix";
          programs = {
            alejandra.enable = true;
            rustfmt.enable = true;
          };
        };
        manifest = pkgs.lib.importTOML ./Cargo.toml;
      in {
        packages = rec {
          default = lunaro-manager;

          lunaro-manager = rust.platform.buildRustPackage {
            inherit (manifest.package) name version;

            cargoLock.lockFile = ./Cargo.lock;
            src = pkgs.lib.cleanSource ./.;

            OPENSSL_NO_VENDOR = 1;

            nativeBuildInputs = with pkgs; [
              pkg-config
              openssl.dev
            ];

            buildInputs = with pkgs; [
              openssl
              openssl.dev
            ];
          };
        };

        devShells.default = pkgs.mkShell {
          name = "lunaro-manager";

          buildInputs = with pkgs; [
            rust.toolchain
            pkg-config
            openssl
            openssl.dev
          ];

          shellHook = ''
            set -a
            touch .env
            source .env
            set +a

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
            echo "The near Moon eclipses the far Sun.                             .=*%@@@@@@@%*#%*"
            echo
            echo "- $(rustc --version)"
            echo "- $(cargo --version)"
            echo
          '';
        };

        formatter = treefmt.config.build.wrapper;
      }
    );
}
