let
  root = builtins.toString ./.;
  flake = builtins.getFlake root;
  system = builtins.currentSystem;
in
flake.devShells.${system}.default
