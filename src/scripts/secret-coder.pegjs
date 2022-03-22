Program "program"
  = RootCommand*

RootCommand "rootcommand"
  = Command / RepeatCommand

RepeatCommand "repeatcommand"
  = Newline "repeat"i _ n:Number Newline c:L1Command* { return {
    command: "repeat",
    number: n,
    subcommands: c
  }; }

L1Command "l1command"
  = NumL1Command / OnlyL1Command
  
OnlyL1Command "onlyl1command"
  = Newline "  " c:("hide"i / "show"i / "pendown"i / "penup"i) Newline { return {
    command: c.toLowerCase()
  }; }

NumL1Command "numl1command"
  = Newline "  " c:("left"i / "right"i / "back"i / "forward"i) _ n:Number Newline { return {
    command: c.toLowerCase(),
    number: n
  }; }

Command "command"
  = NumCommand / OnlyCommand

OnlyCommand "onlycommand"
  = Newline c:("hide"i / "show"i / "pendown"i / "penup"i) Newline { return {
    command: c.toLowerCase()
  }; }

NumCommand "numcommand"
  = Newline c:("left"i / "right"i / "back"i / "forward"i) _ n:Number Newline { return {
    command: c.toLowerCase(),
    number: n
  }; }

Number "number"
  = _ [0-9]+ { return parseInt(text(), 10); }

Newline "newline"
  = [\r\n]*

_ "whitespace"
  = [ \t]*
