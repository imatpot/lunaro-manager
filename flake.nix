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
      pkgs = nixpkgs.legacyPackages.${system}.appendOverlays [
        rust.overlays.default
      ];
      rust-toolchain = with pkgs; [
        (rust-bin.stable.latest.default.override {
          extensions = [ "rust-src" ];
        })

        sqlx-cli
        postgresql
      ];
    in
    {
      devShells.default = pkgs.mkShell {
        buildInputs = rust-toolchain;
        shellHook = ''
          echo
          echo "The near Moon eclipses the far Sun."
          echo
          echo "                                       ....                              ..=#%#."
          echo "                                    .+%@@@#                            -*@@@@@@:"
          echo "                       :.          =@@*@@@+.=++-                     .#@@=+@@@%."
          echo "                    =%@@#        :@@%:-@@@%@@#=.         ...       :#@@@:.#@@#. "
          echo "                    #@@@+        -@@. #@@@%-      :=+#%@@@@@%-     %@@@%+@@%-   "
          echo "                    :=.           :. :@@@=     :*@@@@%++++*%%*    .@@@@@%=.     "
          echo " :=*#%%**+--..--       :=***+=-:.    =*-    -*%@@@@@%*+=-.         :=--         "
          echo "*%#****%@@@@@@@@=.   +%@%*#%@@@@@@#**%#    *@@@@@@%%%@@@@@@+.                   "
          echo "        .-#@@@@@@@%+:.      .:+%@@@@@@@*-.  . ..       :+%@@%.                  "
          echo "           .@@@@@@@@@@%*=.      .=#@@@@@@@%*=:            .+@#.                 "
          echo "            ..   .-+%@@@@@@#*=:. .-@#+=*%@@@@@@%*=.         -=                  "
          echo "                     .:=#@@@@@@@@@@#.     :+%@@@@@@@#=:                         "
          echo "                          .--+**=-.          ..=*%@@@@@%*+-.                    "
          echo "                                                   :=*%@@@@@%*=-.               "
          echo "                                                       .=*%@@@@@@%+:            "
          echo "                                                           .-+#@@@@@@%*=.       "
          echo "                                                                .=*%@@@@@@@%*#%*"
          echo
          echo "- $(rustc --version)"
          echo "- $(cargo --version)"
          echo
        '';
      };
    });
}
