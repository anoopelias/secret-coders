Program "program"
  = RootCommand*

RootCommand "rootcommand"
  = Command / RepeatCommand

RepeatCommand "repeatcommand"
  = Newline Repeat _ n:Number Newline c:L1Command* { return {
    command: "repeat",
    number: n,
    subcommands: c
  }; }

L1Command "l1command"
  = NumL1Command / OnlyL1Command
  
OnlyL1Command "onlyl1command"
  = Newline "  " c:(Hide / Show / PenDown / PenUp) Newline { return {
    command: c
  }; }

NumL1Command "numl1command"
  = Newline "  " c:(Left / Right / Back / Forward) _ n:Number Newline { return {
    command: c,
    number: n
  }; }

Command "command"
  = NumCommand / OnlyCommand

OnlyCommand "onlycommand"
  = Newline c:(Hide / Show / PenDown / PenUp) Newline { return {
    command: c
  }; }

NumCommand "numcommand"
  = Newline c:(Left / Right / Back / Forward) _ n:Number Newline { return {
    command: c,
    number: n
  }; }
  
Repeat "repeat"
  = ("Repeat" / "REPEAT" / "repeat") { return "repeat"; }

Forward "forward"
  = ("Forward" / "FORWARD" / "forward") { return "forward"; }

Back "back"
  = ("Back" / "BACK" / "back") { return "back"; }

Left "left"
  = ("Left" / "LEFT" / "left") { return "left"; }

Right "right"
  = ("Right" / "RIGHT" / "right") { return "right"; }

PenDown "pendown"
  = ("PenDown" / "PENDOWN" / "pendown") { return "pendown"; }

PenUp "penup"
  = ("PenUp" / "PENUP" / "penup") { return "penup"; }

Hide "hide"
  = ("Hide" / "HIDE" / "hide") { return "hide"; }

Show "show"
  = ("Show" / "SHOW" / "show") { return "show"; }

Number "number"
  = _ [0-9]+ { return parseInt(text(), 10); }

Newline "newline"
  = [\r\n]*

_ "whitespace"
  = [ \t]*
