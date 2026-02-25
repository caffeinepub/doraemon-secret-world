module {
  // No type change only value change
  type Actor = {
    correctCode : Text;
  };

  public func run(old : Actor) : Actor {
    { old with correctCode = "Nobita" };
  };
};
