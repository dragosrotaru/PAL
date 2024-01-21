# Lisp

## Levels
- Machine
- OS
- Shell
- Editor

## Links
- https://github.com/lisper/cpus-caddr
- https://3lproject.org
- https://github.com/vygr/ChrysaLisp
- https://github.com/froggey/Mezzano
- https://github.com/AlexNisnevich/ECMAchine
- https://github.com/ghosthamlet/awesome-lisp-machine
  
## Reasonable Level
- GNU Guile
- GNU GUIX
- GNU Emacs
- StumpWM, GuileWM or EXWM
- GNUCash

## The lisp curse

## One

> Lisp is so powerful that problems which are technical issues in other programming languages are social issues in Lisp.

Lisp hasn't succeeded because it's too good. Also Lisp has this hot girlfriend, but you don't know her, she goes to another school.

> Making Scheme object-oriented is a sophomore homework assignment. On the other hand, adding object orientation to C requires the programming chops of Bjarne Stroustrup.

Baloney. ObjC started as just a preprocessor written by Brad Cox. It's not that hard, and "OO C" has been done a million times, just like in Lisp.

ObjC did not succeed because there were so few options that the community was able to coalesce. ObjC succeeded because NeXT and then Apple invested in it to ensure it met the needs of its apps, developers, and platforms. The language was not the point - the platforms were the point.

We use ObjC because it lets us do cool shit on OS X and iOS. We use JavaScript not because it's awesome, but because it runs on web pages - and no amount of Turing-completeness in your type system can accomplish that. Build something awesome in Lisp that's not just some self-referential modification of Lisp (*cough* Arc) and you'll get traction, just like Ruby did with Rails.

## Two

> The language was not the point - the platforms were the point.

When toolmakers spend too much time making tools instead of using them for their intended purpose, they tend to lose track of many realities. Less is more, and enough is most.

## Three

> and no amount of Turing-completeness in your type system can accomplish that.

That bit stuck with me, because he cites it as a good thing, while much of the research in the PLT community centers around clever ways to avoid having your type system be Turing-complete. If you allow arbitrary type-level computation, your typechecker might never terminate, which can make life a lot more annoying. Haskell (in the type system), Coq, Agda, and many other similar languages with strong type systems explicitly avoid Turing-completeness to give static guarantees about programs. The focus on Qi's arbitrarily powerful "type system" (really a language for implementing type systems) misses the point. (he's talking about the Shen programming language)

### Four

> The language was not the point - the platforms were the point.

The Lisp machines are the point, they were a platform that demonstrated that an entire computing environment could be comprehensible in one language all the way down. They lost and utter crap won out.