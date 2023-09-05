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
      rust-toolchain = with pkgs; [
        openssl.dev
        pkg-config
        (rust-bin.stable.latest.default.override {
          extensions = [ "rust-src" ];
        })
      ];
    in
    with pkgs; {
      devShells.default = mkShell {
        buildInputs = rust-toolchain;
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
