Program "program"
  = RootCommand*

RootCommand "rootcommand"
  = Command / RepeatCommand

RepeatCommand "repeatcommand"
  = _ "repeat"i _ n:Number _ "[" c:Command* _ "]" { return {
    command: "repeat",
    number: n,
    subcommands: c
  }; }

Command "command"
  = NumCommand / OnlyCommand

OnlyCommand "onlycommand"
  = _ c:("hide"i / "show"i / "pendown"i / "penup"i) _ { return {
    command: c.toLowerCase()
  }; }

NumCommand "numcommand"
  = _ c:("left"i / "right"i / "back"i / "forward"i) _ n:Number _ { return {
    command: c.toLowerCase(),
    number: n
  }; }

Number "number"
  = _ [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ \r\n]*
