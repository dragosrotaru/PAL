---
date: 2023-08-02
tags: [neurosymbolic, compiler, llm, natural-language, gpt, special-form, pal, transformer]
summary: Design sketch for a neurosymbolic compiler that accepts arbitrary English intermixed with formal language. Four integration strategies, ranging from easy to expressive: (1) embed LLM as a special form `(gpt ...)`, (2) fall back to statistical parsing on lexer failure, (3) leave "holes" where errors occur and fill with LLM output, (4) embed the lexer inside the neural net. Strategy 1 is what pal-ts implements today. Strategy 3 is the most expressive. Also sketches a feedback loop: the compiler takes a type signature + natural language description and produces a function, with introspection and AI-human feedback. This is the theoretical foundation for `(gpt expr)` as a first-class form in Pal.
---

# Neurosymbolic compiler: combining formal and natural language

## Core idea

A compiler that accepts any arbitrary input of English intermixed with formal language, executes the interpreted AST, and outputs a result. How do we combine a traditional compiler with ML natural language processing?

## Integration strategies

**Option 1: `(gpt ...)` special form** — embed the neural net tokenizer within the formal language as a first-class special form. Easy to implement, but not very expressive. **This is what pal-ts does today.**

**Option 2: Lexer-first, statistical fallback** — parse with the formal lexer first; if errors occur, parse with a statistical method.

**Option 3: Holes** — same as option 2, but leave a "hole" where the error begins and ends, substituting with a `(gpt ...)` call. **Most expressive option.**

**Option 4: Lexer inside the neural net** — embed the formal lexer within the transformer. Less performant (tokenization speed matters — consider scraper-style workloads). Correctness is also a major question.

## First-class neurosymbolic form

A neurosymbolic compiler that takes a function's type signature and a natural language description, then produces the function implementation.

Feedback loops back into the system:
- Test code
- Define code
- Run code
- Introspection
- AI-human feedback loop

## Fine-tuning

The neurosymbolic compiler is a transformer model tuned on arXiv papers and code samples. On top of that, fine-tune with synthetic programs.
