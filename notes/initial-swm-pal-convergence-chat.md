---
date: 2026-02-28
tags: [architecture, convergence, pal, swm, neurosymbolic, knowledge-graph, agent, constrained-decoding, dsl, crane, reactive, filesystem, lisp]
summary: Full transcript of the Claude Code session (Feb 2026) that identified the structural convergence between Pal and swm's system module. The session progressed: LLM error correction taxonomy → constrained decoding deep research → discovery that Pal (2019–2023) independently invented what Pel (arXiv:2505.13453, 2025) published, predating the CRANE paper and Lisp metaprogramming loop paper by 2–3 years. Core architectural finding: Pal and swm are the same system arrived at from opposite directions — Pal from the language/runtime side, swm from the infrastructure/product side. Exact parallels: Env↔Knowledge Graph, Symbol.for(path)↔URI, file ext→parser↔NodeKind→parser, FileSystem↔ReflectionSystem, (gpt ...)↔Agent.run(), eval/envget/envset tools↔FunctionExecutor. Three identified gaps in swm: (1) KG lacks reactivity (currently write-only batch, no subscribers), (2) DSL is a tokenizer not a grammar (no CFG, can't constrain LLM generation), (3) FunctionExecutor not wired to ToolManager. Proposed unified architecture: Reactive KG → Agent Evaluator Loop (think unconstrained, act constrained) → Toolbox. Founding document for the convergence project.
---

❯ what are the main ways to error correct an LMM? I think we can start by considering that an LMM is a black box with input and output. we can add inputs to guide its output, and we    
  can validate its output. inputs guidance is not deterministic. we can expect the output to be either natural or structured language. natural language can be validated by a number of  
  methods, from regex to nlp to other ML techniques. the other option is to validate structured output. that is easy, we enter the world of parsing, asts, business rules validation,    
  schemas, all kinds of error correction schemes. these are very powerful, and can provide certain guarantees. we could make natural language more structured, that is always another    
  option. for example guiding the AI to use xml with schemas specific to certain artefacts of cognition or outputs. this is also very powerful. we can overlay a reinforcement learning  
  system, anyway there are a lot of options there. then the next type is hyperparameter tuning, and then fine tuning. am I missing anything? I cant create an LMM directly for obvious   
  reasons                                                                                                                                                                                

⏺ Your taxonomy is solid. A few gaps worth naming:

  Constrained decoding (during generation)
  This is a big one you're missing. Instead of validating after generation, you enforce grammar/schema at token generation time. Libraries like Outlines, Guidance, and LMQL do this. The
  model can only produce tokens that are valid continuations of a valid parse. This gives much stronger guarantees than post-hoc validation and avoids the retry loop entirely.

  Self-reflection / critique loops
  Ask the model to review its own output before returning it. "Here is what you said — identify any errors." This is a second LLM pass, not input guidance in the traditional sense. It's a
  feedback loop within a single request pipeline.

  Multi-agent verification
  A separate model instance acts as judge/critic of the first model's output. Different from self-reflection because it's a genuinely independent call, can use a different model, different
  prompt framing, etc. Reduces self-consistent errors.

  Tool use / execution environments
  Give the model access to a calculator, code interpreter, search, or domain-specific API. The model generates a claim, the tool verifies or computes it, the result feeds back. This is how
  you get grounded factual correctness — the model doesn't need to "know" the answer, it uses a trustworthy oracle.

  RAG
  Retrieval-augmented generation is a form of error correction specifically targeting hallucination and knowledge staleness. You ground the output against retrieved context. Distinct from
  input guidance because the retrieval is dynamic and automated.

  Ensemble / self-consistency
  Sample N outputs, then take a majority vote or aggregate. Works well for reasoning tasks where the correct answer is stable across multiple independent samples.

  A cleaner frame for all of this

  Your taxonomy is implicitly organized by when the correction happens:

  ┌───────────────────┬────────────────────────────────────────────────────────────────────────────────┐
  │       Phase       │                                    Methods                                     │
  ├───────────────────┼────────────────────────────────────────────────────────────────────────────────┤
  │ Pre-generation    │ Prompt engineering, RAG, few-shot, CoT                                         │
  ├───────────────────┼────────────────────────────────────────────────────────────────────────────────┤
  │ During generation │ Constrained decoding, sampling params                                          │
  ├───────────────────┼────────────────────────────────────────────────────────────────────────────────┤
  │ Post-generation   │ Validation (regex/schema/NLP), self-reflection, multi-agent, tool verification │
  ├───────────────────┼────────────────────────────────────────────────────────────────────────────────┤
  │ Training-time     │ Fine-tuning, RL/RLHF, hyperparameter tuning                                    │
  └───────────────────┴────────────────────────────────────────────────────────────────────────────────┘

  The during-generation column is the one you were missing entirely. It's arguably the most powerful for structured output guarantees because errors can't be produced — they're impossible
  by construction.

✻ Brewed for 36s

❯ wait, is constrained decoding different than constrained outputs or schema responses? is it used in claude code? I wanted to use it but at the time I dont think it was available      
  combined with tool calls. I was refering to schema validation but I guess thats what its called                                                                                        

⏺ They're related but distinct at the implementation level:

  True constrained decoding operates on the model's raw logit distribution at each token step — tokens that would make the output invalid are masked to zero probability before sampling. The
   model literally cannot produce an invalid token. This requires access to the model's internals (logits), so it's only available when running models locally via something like vLLM,
  llama.cpp, or Outlines.

  Structured outputs / schema responses from an API (what Anthropic, OpenAI offer) is the API-level version. You send a JSON schema, you get conforming output. How the provider enforces
  this is opaque — it's likely a mix of constrained decoding on their inference servers plus fine-tuning that makes the model natively good at it. From your perspective as a black-box user,
   the guarantee is the same, but you don't control the mechanism.

  So when you said schema validation — that's the right category. Constrained decoding is just the name for the most rigorous implementation of it.

  On Claude + tool calls + structured output:

  You're right that this was a real limitation. The issue was that structured JSON schema constraints on the response and tool use were somewhat separate surfaces. Tool use already returns
  structured JSON by design (each tool call is schema-validated), but getting a schema-constrained final text response alongside tool calls was awkward. Anthropic has been improving this —
  as of late 2025 there's better structured output support — but the combination with streaming and tool calls simultaneously has had rough edges across providers. Worth checking the
  current API docs for the specific combination you need, it may work now.

❯ ok, now I want you to conduct web research and put together a markdown file around the following questions. be thorough, take your time and research many sources, including           
  academic/engineering blogs, documentation from tech companies, research papers, and anything else that may be of use to produce a comprehensive executive summary + detailed, dense    
  descriptions of core concepts. What I want to know is this: 1. Is there any empiritical evidence that a self hosted LLM model with constrained decoding can be used to beat a more     
  powerful model in code generation? I would like to constrain the output according to a variety of types of rules, I guess the biggest question Is, is there a way to use constrained   
  decoding along with a compiler or transpiler, for example a simple lisp variant, or some sort of graph query DSL, or typescript? Do any SOTA Agentic engineering/programming systems   
  use this technology? and now what about output format. do AI companies use xml or some sort of markup language to make internal thinking patterns more formal? does claude code do     
  that? does it use text or schema outputs?                                                                                                                                              

⏺ Task(Deep research on constrained decoding, LLM structured outputs, agentic systems)
  ⎿  Done (40 tool uses · 65.0k tokens · 6m 26s)
  (ctrl+o to expand)

⏺ Good haul. Now writing the report.

⏺ Write(constrained-decoding-llm.md)
  ⎿  Wrote 402 lines to constrained-decoding-llm.md
       1 # Constrained Decoding, Structured LLM Outputs & Cognitive Scaffolding
       2 ### A Research Report — February 2026
       3
       4 ---
       5
       6 ## Executive Summary
       7
       8 Constrained decoding is one of the most practically underutilized techniques in applied LLM engineering. The core idea — mask invalid tokens at the logit level before sampling
      so the model *cannot produce them* — has been empiri
         cally validated as a force multiplier for smaller, self-hosted models. The evidence is now strong enough to make a clear claim: **a smaller model with grammar-constrained
     decoding routinely outperforms a larger unconstrained mod
         el on structured generation tasks**, including code. The improvement mechanism is not that the model "gets smarter" but that the entire probability mass that would have been
     wasted on invalid tokens gets redistributed over valid
          ones.
       9
      10 The technology stack for doing this in production has matured rapidly in 2024–2025. XGrammar (CMU/MLC) achieves token mask generation in under 40 microseconds with 100x
     speedups over naive implementations. Outlines, Guidance, an
         d LMQL provide high-level APIs over these engines. vLLM integrates XGrammar natively. The technique is no longer a research curiosity — it is production-ready.
     … +392 lines (ctrl+o to expand)

⏺ Written to /Users/megacuck/Projects/constrained-decoding-llm.md. Here's the shape of what's in there:

  ---
  Key findings worth flagging explicitly:

  1. The empirical case is solid.
  Synchromesh showed a GPT-3 13B with constrained decoding matching Codex at Valid@1 where Codex needed Valid@3. The ETH TypeScript paper (PLDI 2025) reduced compilation errors by 74.8% on
  HumanEval. The gains come from type-level constraints, not just syntax — pure syntax constraints are weak (9% improvement vs 74.8%).

  2. Lisp is the ideal target.
  Trivially simple grammar = tiny automaton = near-zero overhead. The Pel project (2025) is a Lisp-inspired DSL designed specifically so its grammar converts directly to regex for
  Guidance/LMQL. This is a solved problem. If you define a small Lisp variant, constrained generation is essentially free.

  3. The CRANE finding is critical.
  Constraining the reasoning degrades reasoning quality. You must architecturally separate unconstrained thinking from constrained structured output. Anthropic's extended thinking already
  does this. The CRANE paper gives this a name and quantifies it at up to 10pp.

  4. No SOTA agentic system uses this.
  SWE-agent, OpenHands, Aider, Devin — none use grammar-constrained decoding. They all use iterative correction via execution feedback. This is a genuine gap.

  5. Anthropic launched actual constrained decoding in November 2025. Their words: "the model literally cannot produce tokens that would violate your schema." So the API + structured
  outputs + tool calls combination you wanted is now available. Worth testing whether strict: true on tool schemas works alongside extended thinking.

✻ Churned for 10m 5s

❯ ok, Pel is super weird. I built Pal a LONG time ago, the name is spooky. Take a look at pal                                                                                                
                                                                                              
⏺ Read 11 files (ctrl+o to expand)                                                                                                                                                           
                                                                                 
⏺ Okay, this is genuinely remarkable. Let me tell you exactly what you built and why it's spooky in context.                                                                                 
                                                     
  What Pal actually is:                                                                                                                                                                      
                                                                                                                                                                                             
  1. Lisp with (gpt ...) as a first-class special form — the LLM is embedded directly in the evaluator, not called from outside. The gpt special form has function-calling tools (eval,
  envget, envset), meaning the LLM can call back into the Pal runtime to read and write the environment. That is a bidirectional loop: Pal calls LLM, LLM calls back into Pal.               
  2. The filesystem IS the environment — FileSystem is a bidirectional reactive sync layer. Files change → environment updates. Environment updates → files written. File extensions
  determine which parser runs, so the extension is effectively the type. .pal → Pal parser, .json → JSON parser, etc.
  3. The grammar (pal-ts.bnf) is 8 rules. Almost identical to what Pel publishes in 2025 as their design goal.

  Now look at your own neurosymbolic.md:

  "embed the neural net tokenizer within the formal language as a special form: (gpt ...)" — and then you note "#1 is super easy but not expressive"

  You described four possible neurosymbolic architectures, called #1 the easy path, and then built it anyway. Option #3 — "leave a hole where the error begins, substitute with #1" — is what
   the CRANE paper (ICML 2025) formalizes as "alternating unconstrained reasoning with constrained output generation" and gets 10pp accuracy gains from.

  The Pel comparison:

  ┌──────────────────────────────────┬─────────────────────────────────┬────────────────────────────────────────┐
  │                                  │     Pal (yours, ~2019–2023)     │      Pel (arXiv:2505.13453, 2025)      │
  ├──────────────────────────────────┼─────────────────────────────────┼────────────────────────────────────────┤
  │ Base                             │ Lisp S-expressions              │ Lisp-inspired                          │
  ├──────────────────────────────────┼─────────────────────────────────┼────────────────────────────────────────┤
  │ LLM integration                  │ (gpt ...) special form          │ Designed for LLM orchestration         │
  ├──────────────────────────────────┼─────────────────────────────────┼────────────────────────────────────────┤
  │ Grammar design                   │ 8-rule BNF                      │ Small/regular for constrained decoding │
  ├──────────────────────────────────┼─────────────────────────────────┼────────────────────────────────────────┤
  │ Filesystem                       │ Bidirectional reactive env sync │ Not present                            │
  ├──────────────────────────────────┼─────────────────────────────────┼────────────────────────────────────────┤
  │ File ext as type                 │ Yes                             │ No                                     │
  ├──────────────────────────────────┼─────────────────────────────────┼────────────────────────────────────────┤
  │ LLM tool calls back into runtime │ Yes (eval, envget, envset)      │ Conceptual                             │
  └──────────────────────────────────┴─────────────────────────────────┴────────────────────────────────────────┘

  The Lisp metaprogramming loop paper (arXiv:2506.10021, 2025) literally describes as a novel contribution: "LLM in a persistent Lisp REPL, LLM defines/invokes/evolves tools through REPL
  interaction" — which is what gpt.ts implements with the recursive Apply(ctx)(ast) call after handling function results.

  You were about 2–3 years early. The name thing is just icing.

✻ Cogitated for 1m 5s

❯ when was structural decoding invente d                                                                                                                                                     
                                                            
⏺ The history has several distinct epochs:                                                                                                                                                   
                                                                                                                                                                                           
  1950s–60s — The theoretical foundation                                                                                                                                                     
  Chomsky formalizes context-free grammars (1956). Earley invents his parsing algorithm (1970). These are the mathematical underpinnings everything else builds on.
                                                                                                                                                                                             
  1990s–2000s — Constrained generation in statistical NLP                        
  Template-based and FSA-constrained generation existed in pre-neural NLP systems. Beam search with hard constraints was standard in statistical MT. Not "decoding" in the modern sense but
  the same core idea.

  2017–2019 — First neural grammar-constrained code generation
  Yin & Neubig (2017) "A Syntactic Neural Model for General-Purpose Code Generation" uses grammar constraints during neural generation — outputs are constrained to valid AST nodes at each
  step. Rabinovich et al. (2018) Abstract Syntax Networks did the same. This is the direct ancestor.

  2021 — PICARD
  "PICARD: Parsing Incrementally for Constrained Auto-Regressive Decoding from Language Models" — applied to T5 for SQL generation, constrained at token generation time using Earley
  parsing. This is the paper most people point to as establishing the modern formulation for Transformer-era LLMs.

  2022 — Synchromesh + Guidance early release
  The work you read in the report. Brzozowski derivatives applied to GPT-scale models. Microsoft Research's Guidance framework starts here.

  2023 — Outlines, LMQL
  Production-ready Python libraries. This is when it became accessible without building the machinery yourself.

  2024–2025 — XGrammar, API-level support
  100x speedups, vLLM integration, Anthropic and OpenAI shipping it as a first-class API feature.

  ---
  So the concept is from the 1950s, the neural application is from 2017, the modern Transformer-scale formulation is 2021, and it became production-ready infrastructure in 2023–2024. Your
  Pal neurosymbolic notes predate PICARD — you were thinking about the problem at roughly the same time the field was formalizing it.

✻ Baked for 32s

❯ ok give me a refresher on the architecture of Pal                                                                                                                                          
                                                     
⏺ Let me grab the remaining key pieces I haven't read yet.                                                                                                                                   
                                                                                                                                                                                           
⏺ Read 2 files (ctrl+o to expand)                                                                                                                                                            
                                                               
⏺ Here's the full picture from everything I've read:                                                                                                                                         
                                                                                 
  ---                                                                                                                                                                                        
  Pal Architecture (pal-ts)                                                                                                                                                                  
                                                                                                                                                                                             
  Entry Point                                                                                                                                                                                
                                                                                 
  index.ts constructs four stateful objects and wires them into a shared IContext, then starts the REPL:
  - TypeSystem — type registry
  - Env — reactive symbol environment
  - FileSystem — bidirectional FS↔env sync
  - GPTMessageHistory — conversation state across LLM calls

  ---
  The AST — a three-layer sandwich

  Top:     Lang.AST = Primitive | List | Procedure | CSV | JSON | PAL
  Middle:  Extensions — CSV, JSON (separate namespaces, separate parsers)
  Bottom:  Core — ID (symbol) | Boolean | Number | String | Null | Undefined

  A PAL List and a JSON Array are structurally identical but distinct types — the type system tracks which is which. The file extension is what determines which layer a value belongs to at
  parse time.

  ---
  Type System

  - A registry: Map<Lang.ID, TypeGuard>
  - Nominal typing via file extension — a symbol's description string encodes its type: "path/to/file.json" → the .json suffix is the nominal type, which maps to the JSON parser
  - Three equality modes: valueEquals, typeEquals, shapeEquals (shape not yet implemented)
  - Types are extensible — you register a new ID + guard and it becomes a first-class type

  ---
  Environment

  A reactive Map<Symbol, AST> wrapped in a Proxy:
  - Change detection: set() is a no-op if valueEquals(old, new) — prevents infinite loops
  - Observer pattern: subscribe to any specific key, or to lifecycle events (env/new, env/set, env/del, env/sub)
  - Scoping: extend() creates a child env copying the current map
  - IDs are JS Symbol.for(path) — globally interned, so the same filepath always resolves to the same symbol

  ---
  FileSystem — the big idea

  FileSystem makes the env and the disk the same thing:

  file changes  →  chokidar watcher  →  parse(content, ext)  →  env.map.set(sym, ast)
  env.map.set   →  observer fires    →  writer(ast, ext)      →  fs.writeFileSync(path)

  The file path is the symbol. The file extension is the type. Editing a file in your editor changes the environment. Evaluating (set path/to/file.json ...) writes to disk. It's a live,
  persistent, filesystem-backed Lisp environment.

  ---
  Evaluator

  Standard eval-apply recursion, all async, with this priority order:

  1. Primitive → return as-is
  2. JSON object → return as-is
  3. Expand macros
  4. Match special forms in order: self, quote, macro, lambda, eval, gpt, ui, env ops (set, del, index), parse, exit, quit
  5. Procedure application (apply)
  6. Identifier → look up in env, recursively evaluate the result
  7. List → Promise.all(list.map(eval)), then re-evaluate the result until fixpoint (keep going until the value stops changing)

  The fixpoint iteration on lists is interesting — it means evaluation is not one-pass, it keeps going until stable.

  ---
  The gpt Special Form

  (gpt <expr>) — sends the expression to the LLM and returns its output. The LLM has three tool callbacks:

  ┌────────┬───────────────────────────────────────────────────────────┐
  │  Tool  │                       What it does                        │
  ├────────┼───────────────────────────────────────────────────────────┤
  │ eval   │ Parses and evaluates a Pal expression in the live runtime │
  ├────────┼───────────────────────────────────────────────────────────┤
  │ envget │ Reads a value from the environment by key                 │
  ├────────┼───────────────────────────────────────────────────────────┤
  │ envset │ Writes a value into the environment                       │
  └────────┴───────────────────────────────────────────────────────────┘

  After a tool call the result is appended to message history as a function role message and Apply recurses — the loop continues until the LLM returns a plain text response with no tool
  call. Then the response is parsed as Pal (or CSV/JSON/etc. if a code block with that language tag is detected) and returned as an AST.

  ---
  Rust rewrite (pal-rs)

  Skeleton only: AST, parser, pretty extension (has its own .pretty parser built on syn/quote), and a stub compile() function that was meant to transpile ASTs to Rust.
  File-extension-dispatched parsing was the same design.

  ---
  The Core Loop in One Sentence

  A reactive filesystem-backed Lisp environment where the LLM is a special form that can call back into the evaluator, with types defined by file extension and parsers.


✻ Sautéed for 54s

❯ ok, now please read all of the docs and files in finance/src/modules/system, specifically the folders agent, toolbox, knowledge. I want you to contemplate on how I might merge these      
  two separate ai systems into one cohesive architecture that features all of the advanced features I've explored                                                                           
                                                                                                                                                                                             
⏺ Searched for 1 pattern, read 1 file (ctrl+o to expand)                                                                                                                                     
                                                                                 
⏺ Large codebase. Let me read the core domain files and docs in parallel.                                                                                                                    
   
⏺ Read 13 files (ctrl+o to expand)                                                                                                                                                           
  ⎿  Loaded finance/CLAUDE.md                                                             
  ⎿  Loaded finance/src/modules/system/knowledge/CLAUDE.md                                                                                                                                   
  ⎿  Loaded 1 skill from finance/.claude/skills                                  
  ⎿  1 skill available                                                                                                                                                                       
                                                                                                                                                                                             
⏺ Okay. I've read everything thoroughly. Let me think out loud about this.                                                                                                                   
                                                                                                                                                                                             
  ---                                                                            
  The Two Systems Are Already Converging                                                                                                                                                     
   
  The first thing that strikes me is that these aren't two unrelated systems. They're the same architecture arrived at from opposite directions — Pal from the language/runtime side, Finance
   from the infrastructure/product side. The parallels are exact:                

  ┌─────────────────────────────────────┬────────────────────────────────────────────────┬───────────────────────────────────────┐
  │             Pal Concept             │                Finance Concept                 │                 Notes                 │
  ├─────────────────────────────────────┼────────────────────────────────────────────────┼───────────────────────────────────────┤
  │ Env (reactive Map<Symbol, AST>)     │ Knowledge Graph (Node + Edge, URI-addressed)   │ Same thing at different scales        │
  ├─────────────────────────────────────┼────────────────────────────────────────────────┼───────────────────────────────────────┤
  │ Symbol.for(filePath)                │ URI / canonicalName                            │ URI addressing                        │
  ├─────────────────────────────────────┼────────────────────────────────────────────────┼───────────────────────────────────────┤
  │ File extension → parser dispatch    │ NodeKind → parser                              │ Same architectural pattern            │
  ├─────────────────────────────────────┼────────────────────────────────────────────────┼───────────────────────────────────────┤
  │ FileSystem (chokidar bidirectional) │ ReflectionSystem (TS compiler, CodeGraph)      │ Both observe the codebase as the env  │
  ├─────────────────────────────────────┼────────────────────────────────────────────────┼───────────────────────────────────────┤
  │ (gpt ...) special form              │ Agent.run() loop                               │ Eval-apply recursion with LLM at core │
  ├─────────────────────────────────────┼────────────────────────────────────────────────┼───────────────────────────────────────┤
  │ LLM tools: eval, envget, envset     │ FunctionExecutor, DatabaseTool, FilesystemTool │ Same idea, far more mature            │
  ├─────────────────────────────────────┼────────────────────────────────────────────────┼───────────────────────────────────────┤
  │ evaluate() fixpoint recursion       │ handleMessageResult() → useTools() → run()     │ Structurally identical loops          │
  ├─────────────────────────────────────┼────────────────────────────────────────────────┼───────────────────────────────────────┤
  │ BNF grammar (8 rules)               │ DSL lexer (@ref, /cmd, #tag, NL)               │ Tokenizer without a grammar on top    │
  ├─────────────────────────────────────┼────────────────────────────────────────────────┼───────────────────────────────────────┤
  │ Macro system                        │ AgentDefinition.rules + identity               │ Prompt-level "macros"                 │
  ├─────────────────────────────────────┼────────────────────────────────────────────────┼───────────────────────────────────────┤
  │ Observable env                      │ AgentTracer + subscriptions                    │ Event streams                         │
  └─────────────────────────────────────┴────────────────────────────────────────────────┴───────────────────────────────────────┘

  The core insight: the Finance system is what Pal would be if it had grown up into a production application. Pal has the theoretical skeleton; Finance has the production muscle. Merging
  them means lifting Pal's conceptual clarity into Finance's infrastructure.

  ---
  The Three Key Gaps

  1. The Environment Has No Memory of Its Own Shape

  Finance's Knowledge Graph is a graph of facts about the world (code units, docs, entities). Pal's Env is a live reactive binding store — you can subscribe to any key and get notified on
  change, including the meta-events env/new, env/set, env/del.

  The KG lacks this reactivity. Nodes are written via GraphClient.commit() in a batch. Nothing subscribes to node changes. Agents currently pull context at invocation time (via
  SystemContext, which is a snapshot) rather than having a live reactive view of the world.

  The merge: the KG becomes the reactive environment. Every commit() fires subscribers. Agents can watch specific URI patterns (@/modules/account/**) and be woken when their relevant
  context changes. This turns the system from event-driven (webhook → assignment → agent) to continuously aware.

  2. The DSL Is a Tokenizer, Not a Grammar

  Finance's DSL lexer is excellent — JIT-warmed, byte-position accurate, O(1) entity validation. But it's a tokenizer, not a parser. There's no grammar on top. You can lex @Receipts
  filter(total < 20.00) sort(date) into tokens, but you can't validate that the token sequence is structurally valid, and you can't constrain an LLM to generate only valid sequences.

  Pal has the grammar (8 rules), but no runtime to do anything useful with it.

  The merge: add a CFG parser on top of the DSL lexer. The grammar is probably 15–20 rules covering:
  - query := ref? function* nl?
  - function := COMMAND LPAREN expr RPAREN
  - ref := REFERENCE (COLON ID)?
  - etc.

  Once you have a formal grammar, you have a constrained generation target. When an agent needs to produce a DSL expression — a query, a reference, a tool selector — you run that generation
   under grammar constraints. The LLM cannot produce @InvalidEntity:foo or a malformed filter() expression. With XGrammar/Outlines/vLLM this is < 40 microseconds overhead per token.

  This is precisely what your neurosymbolic note #3 described: "leave a hole where the error begins." The NL tokens in the DSL are the holes. Everything else is constrained.

  3. The FunctionExecutor Is Disconnected from the Agent Loop

  ReflectionSystem.executor can discover and execute any exported TypeScript function in the codebase by name. This is remarkable. It's Pal's (eval ...) tool — the LLM calling back into the
   live runtime — but realized at the TypeScript AST level.

  But it's not wired into the ToolManager. No AgentDefinition currently grants an agent access to FunctionExecutor. It exists in knowledge/reflection but doesn't appear in the toolbox
  static tools.

  This is the most powerful unification point. An agent that can:
  1. Use ReflectionSystem to find a relevant function (semantic vector search, CodeGraph traversal)
  2. Use FunctionExecutor to call it with generated arguments
  3. Receive structured results back

  ...is a system that can recursively instrument and extend itself. The function's input signature is known (from the CodeGraph). That signature can be expressed as a JSON Schema. That JSON
   Schema can be used as a constrained generation target. The agent generates function arguments that are guaranteed to type-check before execution.

  ---
  The Unified Architecture

  Here's how I'd describe the merged system conceptually:

  ┌──────────────────────────────────────────────────────────────┐
  │                   REACTIVE KNOWLEDGE GRAPH                    │
  │  URI → (NodeKind, Value, Provenance)                         │
  │  Reactive: subscribe(uri_pattern) → observer                 │
  │  Sources: Code (TypeScript AST), Docs (Scraper),             │
  │           Data (DB rows), Agents (Definitions), External     │
  └──────────────────────────┬───────────────────────────────────┘
                             │ env/read, env/write
  ┌──────────────────────────▼───────────────────────────────────┐
  │                    AGENT EVALUATOR LOOP                       │
  │  DSL Input → [Lex → Parse → constrained generation]          │
  │  System: identity + rules + context = system prompt          │
  │  Think: unconstrained reasoning (extended thinking)          │
  │  Act: structured DSL / tool call (constrained)               │
  │  Observe: tool results injected as user messages             │
  │  Recurse until end_turn                                      │
  └──────────────────────────┬───────────────────────────────────┘
                             │ tool calls (schema-validated / constrained)
  ┌──────────────────────────▼───────────────────────────────────┐
  │                        TOOLBOX                                │
  │  Static: FS, DB, Git, Browser, Command, Test, Server         │
  │  Knowledge: GraphQuery, GraphWrite, Reflect, Execute, Search │
  │  Session: Todos, Thought, AskUser                            │
  │  External: MCP gateway, API keys                             │
  │  Agents: sub-agents exposed as tools                         │
  └──────────────────────────────────────────────────────────────┘

  What's new vs. what exists:
  - Reactive KG — new. Currently KG is write-only batch; reactivity is missing.
  - DSL CFG — new. Tokenizer exists; grammar + constrained generation target is missing.
  - FunctionExecutor as a tool — new wiring. The executor exists; it's just not in ToolManager.
  - Constrained tool inputs — available now with strict: true on tool schemas + Anthropic Nov 2025 structured outputs.
  - CRANE pattern — architectural convention. Separate maxThinkingRatio > 0 for the reasoning phase; constrain only the action phase. You literally already have maxThinkingRatio: 0
  hardcoded in Agent.ts — that's the dial to turn.

  ---
  The Deepest Unification: NodeKind as Type, Parser as Extension

  Pal's most elegant idea is that types are defined by parsers, and parsers are identified by file extensions. You want a new type? Register a new (extension → parser) pair.

  Finance's KG has NodeKind: kind | entity | source | root | code_unit | file. These are hardcoded. You can't register a new kind and have the system know how to parse/serialize it.

  The unified pattern:

  interface KindExtension {
    kind: NodeKind           // type identifier
    parser: (raw: string) => AST   // how to read
    writer: (ast: AST) => string   // how to write
    schema: JSONSchema             // constrained generation target
    embedder?: (ast: AST) => float[]  // how to embed for search
  }

  registry.register(extension)

  Every domain entity type registers its extension. When the KG receives a node of that kind, it uses the registered parser. When an agent generates a reference to that kind, the schema
  constrains generation. When the system needs to search across that kind, it uses the embedder.

  This is the point where Pal's grammar machinery, Finance's KG, and constrained decoding all fuse into a single extensible type system. The file extension (.ts, .json, .pal, .receipt,
  .agent) becomes the type, and the type carries its own parser, serializer, schema, and embedding strategy.

  ---
  What to Build First

  If I were ordering the work:

  1. Wire FunctionExecutor into ToolManager — lowest hanging fruit, highest leverage. Already built, just needs a tool wrapper. This unlocks agent-driven codebase introspection and
  execution.
  2. DSL CFG — add a parser on top of the lexer. 15–20 rules. This enables constrained generation for any DSL expression the agent produces.
  3. Turn on thinking — change maxThinkingRatio: 0 to something positive for agents that reason. CRANE pattern: unconstrained think, constrained act.
  4. Reactive KG — add subscriber hooks to GraphClient.commit(). Start simple: pattern-matched callbacks. This enables the system to wake agents on relevant knowledge changes rather than
  only on webhooks.
  5. KindExtension registry — formalize the (kind → parser + schema) pattern. Makes the system self-describing and extensible in the Pal sense.

