## Neurosymbolic Ideas

How do we combine a traditional compiler with ML natural language processing?

Imagine a compiler which can take any arbitrary input of english intermixed with formal language, execute the interpreted AST and output a result.

## somehow merge compiler lexer and neural net tokenizer?

1. embed the neural net tokenizer within the formal language as a special form: (gpt ...)
2. parse with the lexer first and if errors, parse with the a statistical method second
3. same thing as above, but leave a "hole" where the error begins and where it ends, substituting with #1
4. embed the lexer within the neural net

#1 is super easy but not expressive, number #3 is the most expressive and #4 is less performant,
which actually is super important (consider the time it takes to perform tokenization in the scraper code). Of course Correctness is a big question for all options.

## first class citizen?

A neurosymbolic compiler which takes the type signature of a function and a natural language description of it, producing the function.

How do we give the transformer feedback loops back into the system? test code, define code, run code, etc.

- introspection
- AI-human feedback loop

## fine-tune foundation model

The neurosymbolic compiler is a transformer model tuned with Arxiv and Code samples. On top of that, we can fine tune it with synthetic programs?

