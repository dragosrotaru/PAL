# Motivation

This project is the pursuit of a better personal computing experience for myself.

## Problem Statement

In systems design our primary tool is abstraction. Abstraction allows us to build on top of prior or parallel work by lowering the dimensionality of the mental model needed to integrate constituent components. The implementation is substituted for the interface.

This phenomena has benefits which are obvious, but it also has its pitfalls.

Each suboptimal abstraction can be thought of as a design choice that is a local minima in the solution space. Because of external pressures to deliver working software on time, the typical design algorithm employed by designers is greedy.

At best, we research and prototype a few options. The most inspiring designer I have ever worked with, an architect at my first internship taught me to try at least 3 completely different approaches before commiting to one. 7 years of development later and I have discovered that his attitude is exceedingly rare.

The longer an abstraction exists, the less it is questioned. We say it stood the test of time, but what we really mean is it would be a real pain in the ass to change that now. And of course, uprooting an abstraction has its risks. But so does doubling down on a bad choice.

Objectively we can say:

1. design decisions made in the past were made on less information than we have now.
2. typical software enterprises reward individuals for delivering and punish them for questioning requirements.
3. empiritically we know that large refactoring undertakings can be risky.
4. there is an inherent bias in assignment of risk. It easy to attribute the cause of failure to an explicit decision to do something, rather than an implicit decision NOT to do something.
5. unless you have a way to quantify the risk for both the option to refactor and the option to not refactor, then any discussion of risk is ungrounded in reality.
6. individuals are not incentivized to care about the reprecussions of their decisions past the scope of their tenure. This applies to designers, implementors and executives.
7. there is no law of nature we know of which states that all methodologies for refactoring abstractions come wih the same risk, therefore we should be more nuanced in our discussion.

All of these factors come together to form the basis for how we make design decisions in 2023 and beyond. It is not a basis founded in logic, like that of the pioneers of our field. It is a vicious cycle of short-sighted thinking and disposable software fuelled by a competitive market.

As we approach the 100 year aniversary of general purpose computing, It is important to look back at the work of the giants before us with a critical eye, Assessing the decisions branches in our history. Perhaps there is a better maxima we can teleport to from our current position using more advanced tooling.

## Key decisions to analyze

Like sediment layers or ice core samples, Our software stack shows its history. Lets look at the typical web development stack:

- hardware
  - closed source
  - von neumann / turing machine vs lisp machine
- operating system
  - unix everything is a file
  - c as the de facto language
  - OSI networking layers
  - shell
- web
  - document object model
  - http
  - browser
  - webkit
  - javascript

If you think about the degrees of freedom afforded to web application developers, it is incredibly small.
