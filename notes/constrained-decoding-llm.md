---
date: 2026-02-28
tags: [constrained-decoding, llm, research, neurosymbolic, grammar, structured-output, code-generation, crane, xgrammar, outlines, lisp, typescript, cypher, agent, pal]
summary: Comprehensive research report (Feb 2026) on constrained decoding as a force multiplier for LLMs. Core finding: a smaller self-hosted model with grammar-constrained decoding reliably outperforms a larger unconstrained model on structured generation tasks including code — not because the model gets smarter, but because invalid probability mass gets redistributed over valid tokens. Empirical evidence: Synchromesh (GPT-3 13B matches Codex at Valid@1), ETH TypeScript PLDI 2025 (74.8% compilation error reduction — type-level constraints dwarf syntax-only 9%), CRANE (up to 10pp gain from alternating unconstrained reasoning with constrained output). Framework landscape: XGrammar < 40μs per mask, Outlines, Guidance, LMQL, vLLM integration. SOTA agentic systems (SWE-agent, OpenHands, Aider, Devin) use none of this — open engineering gap. Lisp is the ideal target: trivially simple grammar, tiny automaton, near-zero overhead. Anthropic launched true constrained decoding (Nov 2025) — schema compiled to grammar, tokens masked live at inference. CRANE principle: constrain output but never the reasoning phase. This report directly sparked the swm/pal architectural convergence analysis.
---

# Constrained Decoding, Structured LLM Outputs & Cognitive Scaffolding
### A Research Report — February 2026

---

## Executive Summary

Constrained decoding is one of the most practically underutilized techniques in applied LLM engineering. The core idea — mask invalid tokens at the logit level before sampling so the model *cannot produce them* — has been empirically validated as a force multiplier for smaller, self-hosted models. The evidence is now strong enough to make a clear claim: **a smaller model with grammar-constrained decoding routinely outperforms a larger unconstrained model on structured generation tasks**, including code. The improvement mechanism is not that the model "gets smarter" but that the entire probability mass that would have been wasted on invalid tokens gets redistributed over valid ones.

The technology stack for doing this in production has matured rapidly in 2024–2025. XGrammar (CMU/MLC) achieves token mask generation in under 40 microseconds with 100x speedups over naive implementations. Outlines, Guidance, and LMQL provide high-level APIs over these engines. vLLM integrates XGrammar natively. The technique is no longer a research curiosity — it is production-ready.

For formal language targets specifically — Lisp S-expressions, TypeScript, Cypher, graph DSLs — there is a clear research and engineering path. TypeScript constrained generation (ETH SRI, PLDI 2025) reduces compilation errors by 74.8% on HumanEval. S-expressions are particularly well-suited because their grammar is trivially simple. Purpose-built Lisp-like DSLs for AI orchestration (Pel, 2025) are being designed *specifically* with constrained generation in mind. Text-to-Cypher systems with logit-level constraints now produce guaranteed-executable graph queries.

The major agentic coding systems (SWE-agent, OpenHands, Aider, Devin) do **not** use grammar-constrained decoding in their published architectures — they rely on prompt engineering, structured tool call schemas, and iterative correction. This represents an open engineering opportunity.

On the question of structured reasoning markup: every major lab uses some variant of tagged or token-delimited internal reasoning. Anthropic trained Claude specifically to recognize XML tags as structural markers. DeepSeek R1 uses `<think>` tags enforced by RL format rewards. OpenAI's o-series reasons internally in discarded reasoning tokens. Anthropic launched full constrained decoding for JSON schema outputs in November 2025 — it compiles your schema into a grammar and constrains token generation live at inference time. Claude Code itself uses JSON tool calls for structured actions, plain text for human output, and XML tags for UI/frontend metadata communication.

---

## Part 1: Empirical Evidence — Constrained Decoding vs. Larger Unconstrained Models

### The Core Claim

The central empirical question is: can a smaller self-hosted model with constrained decoding beat a larger unconstrained API model on code generation tasks? The answer from the literature is **yes, on validity and structural correctness metrics**, and increasingly **yes on functional correctness** when the grammar encodes type semantics.

The intuition is precise: an unconstrained LLM distributes probability mass over its entire vocabulary at each step, including the large portion of tokens that would produce syntactically or semantically invalid continuations. Constrained decoding zeros out this invalid mass and renormalizes over valid tokens. For highly structured targets (SQL, JSON, typed code), the invalid probability mass is enormous. Redistributing it onto valid tokens is a significant effective boost.

### Synchromesh (Microsoft Research, ICLR 2022)

**Paper**: *Synchromesh: Reliable Code Generation from Pre-Trained Language Models* — Poesia et al., arXiv:2201.11227

The foundational empirical paper in this space. Synchromesh has two components:

1. **Target Similarity Tuning (TST)**: semantic few-shot example selection via embedding similarity
2. **Constrained Semantic Decoding (CSD)**: constraints validity using Brzozowski language derivatives — a mathematical formalism that computes, at each generation step, the set of tokens that can lead to a valid completion given what has already been produced

Key quantitative results:
- **SQL generation**: Validity improves from 43% → 72% on GPT-3 13B with CSD. Synchromesh at Valid@1 matches Codex (a much larger model) requiring Valid@3 samples.
- **SMCalFlow** (S-expression graph DSL): Constrained models reach 97%+ well-typed programs at Valid@1. Unconstrained Codex requires 5 samples and still stays below 93%.
- **Vega-Lite** (JSON-based visualization DSL): Synchromesh virtually eliminates structural errors at 1 sample. Unconstrained models fail at Valid@5.

The direct comparison of smaller-model-with-CSD vs. larger-model-without-CSD is the paper's headline finding: CSD gives GPT-3 13B performance competitive with Codex on validity metrics without any fine-tuning.

### Type-Constrained Code Generation (ETH SRI, PLDI 2025)

**Paper**: *Type-Constrained Code Generation with Language Models* — arXiv:2504.09246

This paper is the most rigorous formal treatment of constrained code generation applied to a real production language: **TypeScript**. The key technical innovation is *prefix automata with type inference* — not just syntax constraints but type-level constraints enforced during generation.

Results on HumanEval and MBPP:
- **Compilation error reduction**: 74.8% on HumanEval (syntax-only constraints give only 9.0%)
- **Compilation error reduction**: 56.0% on MBPP (syntax-only: 4.8%)
- **Functional correctness improvement**: 3.5%–5.5% relative for synthesis and translation tasks
- **Repair tasks**: Correct repair of non-compiling code improved by 37% on average

The key insight is that syntax constraints alone are weak. The large gains come from *type-level* constraints — knowing which variables are in scope, what their types are, which methods are available at each point. The compiler's type system is essentially being embedded into the token masking logic.

### CRANE (ICML 2025)

**Paper**: *CRANE: Reasoning with Constrained LLM Generation* — arXiv:2502.09061

CRANE identifies a critical failure mode of naive constrained decoding: applying grammar constraints to *all* of the output, including reasoning, **reduces reasoning capability**. The model needs unconstrained freedom to reason; constraints should apply only to the final structured output.

CRANE's solution: alternate unconstrained reasoning segments with constrained generation segments. This hybrid approach yields:
- **Up to 10 percentage point accuracy improvement** over baselines on GSM-Symbolic and FOLIO
- Outperforms both pure constrained and pure unconstrained strategies

This is a direct parallel to what Anthropic does with extended thinking: the thinking content block is unconstrained, the final answer can be constrained. It suggests that **thinking and structured output should be architecturally separate surfaces**.

### Fill-in-the-Middle (FIM) Constrained Decoding (ETH / AWS, 2024)

**Paper**: *Constrained Decoding for Fill-in-the-Middle Code LMs via Efficient Left and Right Quotienting* — arXiv:2402.17988

Extends the Earley parsing algorithm to handle left and right quotients of context-sensitive grammars, enabling constrained decoding for FIM (infilling) tasks. Standard grammar constraints only work for left-to-right generation; this work handles the more complex case where you have a prefix and suffix and must generate a valid middle. Applied to Python 3 with full handling of:
- Indentation-sensitive parsing (context-sensitive)
- Variable scope constraints
- Import resolution

"Significantly reduces the incidence of syntax errors" in Python FIM completion.

### Inference-Time Efficiency (UW CSE, 2025)

**Paper**: *Inference-Time Techniques for Efficient Code Generation* — UW CSE 503

Direct performance comparisons across model sizes with inference-time techniques including constrained generation:
- CAD (Context-Aware Decoding) on **Llama 3.2 1B** achieves 0.39 HumanEval, 0.50 MBPP — competitive with larger models
- Under fixed compute budget (32 normalized FLOPs): 7B–13B models achieve **5–15% gains over 70B models** on HumanEval and MBPP
- CodeLlama 7B/13B reaches 60% HumanEval score in **1/4 the wall time** required by larger models to reach the same score

### Grammar-Aligned Decoding (NeurIPS 2024)

**Paper**: *Grammar-Aligned Decoding* — NeurIPS 2024 Proceedings

Identifies an important distribution problem with standard constrained decoding: it produces outputs that are grammatically valid but statistically unlikely according to the LLM's learned distribution — because renormalizing over valid tokens distorts the probability landscape. Introduces **ASAp (Adaptive Sampling with Approximate Expected Futures)** which accounts for future constraint satisfaction when computing current token probabilities, maintaining alignment between the LLM's distribution and the grammar constraint. Important for cases where you want both validity *and* naturalness.

---

## Part 2: Constrained Decoding with Formal Languages

### Framework Landscape

| Framework | Maintainer | Grammar Support | Deployment Target |
|---|---|---|---|
| **Outlines** | dottxt-ai | Regex, JSON Schema, CFG (Lark/EBNF) | Local inference, vLLM |
| **Guidance** | Microsoft Research | Regex, CFG, interleaved control flow | Transformers, llama.cpp, Azure |
| **LMQL** | ETH Zurich | Regex constraints, programmatic control | Local, API |
| **XGrammar** | CMU / MLC | JSON Schema, CFG | vLLM backend, TGI |
| **llama.cpp** | ggerganov | JSON Schema, BNF grammars | Local inference |

**XGrammar** is the current performance leader: < 40 microseconds for JSON grammar token mask generation, 100x faster than naive implementations, 80x faster for CFG-guided generation vs. prior engines. It divides vocabulary into context-independent tokens (pre-computed) and context-dependent tokens (computed per-step), dramatically reducing runtime overhead.

**DOMINO** (ETH SRI, ICML 2024) — arXiv:2403.06988 — fixes a critical accuracy bug present in Guidance and other frameworks: BPE tokenizers split words into subwords, and naive regex/grammar matching against subwords causes misalignment (up to 11 percentage point accuracy drops). DOMINO aligns grammar validation to BPE subword boundaries correctly, recovering the lost accuracy. Also achieves near-zero overhead and up to 2x speedup via speculative decoding.

### TypeScript

The ETH SRI PLDI 2025 paper (arXiv:2504.09246) is the definitive treatment. The approach:

1. Maintain a type environment during generation tracking in-scope identifiers and their types
2. At each generation step, compute which tokens are valid continuations given current AST state and type environment
3. Use prefix automata to efficiently represent the valid token set

The machinery required: a partial parser that can handle incomplete TypeScript ASTs, a type inference engine running incrementally, and a token mask computation layer. This is non-trivial engineering but the approach is fully worked out and the code is open source at `github.com/eth-sri/type-constrained-code-generation`.

### Lisp / S-Expressions

Lisp is the **ideal target** for constrained generation for a specific structural reason: its grammar is almost trivially simple (essentially just balanced parentheses + atoms), which means the grammar automaton is very small and fast to evaluate. The homoiconic nature (code = data = lists) means there's no impedance mismatch between what the model generates and what can be parsed and executed.

**Pel** (arXiv:2505.13453, 2025) is a Lisp-inspired language designed *explicitly* for constrained generation in AI agent orchestration:
- Grammar is designed to be small and regular for easy conversion to regex for use in Guidance/LMQL
- Persistent Lisp REPL integration loop: LLM defines/invokes/evolves tools through REPL interaction (arXiv:2506.10021)

For S-expression DSLs specifically: Synchromesh was tested on SMCalFlow which uses an S-expression-based graph DSL, achieving near-perfect validity. The paper proves the approach works on this class of target.

**Engineering path for Lisp**: Define your Lisp variant's grammar in EBNF, load it in Outlines' CFG mode or Guidance, run against any locally hosted model via vLLM. The grammar automaton will be small and fast. You get a guarantee that every token is parseable.

### Graph Query Languages (Cypher, GraphQL, Gremlin, SPARQL)

**Text-to-Cypher with constrained decoding** (ScienceDirect 2025):
- Implements next-token constrained decoding at the logit processor level for Cypher generation
- Critical implementation detail: constraints must operate at *token* level, not word level, because LLM tokenizers don't split on Cypher keyword boundaries
- Result: guaranteed syntactically valid, executable Cypher queries against Neo4j
- Reference: *Enhancing Knowledge Graph Interactions: A Comprehensive Text-to-Cypher Pipeline* (doi:10.1016/j.ipm.2025.x)

**ACL GenAIK 2025** (*Text2Cypher: Bridging Natural Language and Graph Databases*, arXiv:2412.10064) explores constrained generation for Cypher as a production pipeline.

The engineering path for graph DSLs:
1. Cypher and SPARQL have formal BNF grammars — load directly into XGrammar/Outlines
2. GraphQL has a formal spec grammar — same approach applies
3. For Gremlin (Groovy-based): more complex, likely need a subset grammar
4. Schema grounding (entity/relationship names from the graph schema) requires dynamic grammar modification per-query — the grammar for Cypher node labels must be parameterized by the actual schema

---

## Part 3: SOTA Agentic Coding Systems — Do They Use Constrained Decoding?

### Summary Finding

**No major production agentic coding system uses grammar-constrained decoding in its published architecture.** They use structured prompting, tool calling schemas (which are validated post-generation), and iterative correction loops. This is an open gap.

### SWE-agent

- Architecture: Agent-Computer Interface (ACI) — the key contribution is the *interface design*, not model-level techniques
- Tools return JSON strings parsed to populate prompt templates; actions are validated post-hoc
- **Mini-SWE-Agent**: 100 lines of code, >74% SWE-bench Verified — uses only bash, no custom tool-calling interface whatsoever. Demonstrates that iterative shell-level feedback is a strong baseline.
- **No constrained decoding** in architecture

### OpenHands (formerly OpenDevin)

- Modular SDK: agent / tool / workspace boundaries; sandboxed execution
- Agents interact via code writing, command line, web browsing
- **No constrained decoding** in published architecture
- Relies on model capability + execution environment feedback loops

### Devin (Cognition AI)

- Multi-agent system: task_assigner_agent, code_editor_agent, command_line_agent, error_handling_agent
- Described as "combination of training large language models akin to GPT-4 with reinforcement learning"
- **No published evidence** of grammar-constrained decoding

### Aider

- Uses Tree-sitter for AST-based code analysis — treats code as structured data for *context provision*, not for generation constraints
- Repository map for intelligent context selection
- Pluggable LLM backend; changes tracked via Git
- **No constrained decoding** — uses plain LLM calls with structured text prompting

### Claude Code

See Part 5 for full treatment. Uses JSON tool call schemas (Anthropic API enforces structure), XML tags for UI metadata, plain text for reasoning and human output. With the November 2025 structured outputs launch, JSON schema constraints are now available at the API level.

### CodeAct Framework

Notable for a different approach to structured action:
- Python code as the action format instead of JSON tool calls
- **Python code as action outperforms JSON-based tool calling by up to 20% in success rate** across 17 LLMs
- Code-based tool invocation reduces token usage by 98.7% (from ~150,000 to ~2,000 tokens)

This is not constrained decoding but is evidence that the action representation format significantly impacts agent performance.

### The Open Opportunity

The absence of constrained decoding in production agentic systems likely reflects:
1. These systems are built on API models (OpenAI, Anthropic) where you historically lacked logit access
2. Iterative correction (generate → execute → observe error → retry) is a sufficient and simpler alternative when you have an execution environment
3. The engineering overhead of maintaining grammar automata

But with Anthropic and OpenAI both now offering server-side constrained decoding via their structured outputs APIs, the first barrier is removed. The research case for applying grammar constraints to agentic code generation is strong and largely unexplored in production systems.

---

## Part 4: XML, Markup Languages, and Structured Internal Reasoning

### Anthropic — Claude

Anthropic made a deliberate architectural decision: **Claude was specifically trained to recognize XML tags as structural markers in prompts**. This is documented in the API docs and in Claude's own behavior. XML tags:
- Separate instructions from data
- Delineate multi-shot examples
- Mark chain-of-thought segments (`<thinking>`, `<answer>`)
- Provide semantic context for sections of long prompts

The official guidance is "no canonical best XML tags" — you can define your own vocabulary. The model has generalized from its training to treat any consistent XML-like tagging as semantically meaningful structure.

**Extended Thinking** (API feature):
- API returns two distinct content block types: `thinking` blocks (internal reasoning) + `text` blocks (response)
- `budget_tokens` controls maximum reasoning token budget
- Thinking content is structurally separate from the response — you can inspect it, log it, route it differently
- This is the API-level manifestation of the CRANE principle: reasoning is unconstrained, output can be constrained

**Structured Outputs** (launched November 14, 2025):
- GA across Opus 4.6, Sonnet 4.6, Sonnet 4.5, Opus 4.5, Haiku 4.5
- Beta header: `anthropic-beta: structured-outputs-2025-11-13`
- Anthropic's own description: *"Compiles your JSON schema into a grammar and actively restricts token generation during inference — the model literally cannot produce tokens that would violate your schema"*
- Schema cached 24 hours; applied at each token generation step
- Two surfaces: `output_config.format` (JSON outputs) + `strict: true` (tool use schema validation)
- Pydantic (Python) and Zod (TypeScript) SDK integration

### OpenAI — o1/o3/o4

OpenAI's reasoning model architecture:
- **Reasoning tokens** generated internally, then *discarded* before the response is returned — users never see the raw CoT
- Full chain-of-thought is encrypted and not persisted
- `reasoning.effort` parameter: low / medium / high controls reasoning token budget
- Reasoning tokens range from hundreds to tens of thousands per response
- o3 generates *diverse candidate chains of thought* (distinct "programs" or reasoning pathways) mimicking iterating over solution drafts before committing to an answer

**Structured Outputs** (OpenAI, August 2024):
- Uses context-free grammars (not finite state machines / regex) for JSON schema compliance
- Critical technical point: FSMs cannot handle recursive JSON types (nested objects, arrays of objects); CFGs can. OpenAI explicitly chose CFGs for this reason.
- Claims **100% reliability** on complex JSON schema following

### DeepSeek — R1

DeepSeek R1 is the most transparent published account of how structured reasoning format emerges from training:
- Uses `<think>` / `</think>` tags to delimit chain-of-thought
- **Format Rewards in RL**: a rule-based reward signal during reinforcement learning explicitly rewards generating reasoning tokens between the thinking tags
- Prompt template enforces model initiates every output with `<think>\n`
- Model discovered the `<think>` structure through RL without explicit SFT prerequisite — the format emerged from the reward signal

This is architecturally interesting: the tags are not just a prompt convention but a *trained behavioral constraint* that emerged from optimization pressure.

### Google DeepMind — Gemini

- **Gemini 2.5 Pro/Flash**: thought summaries included in API responses
- **Deep-Thinking Ratio (DTR)**: mechanistic interpretability metric measuring reasoning effort by tracking Jensen-Shannon divergence between intermediate-layer and final-layer predictive distributions — tokens that stabilize only in later layers are "deep-thinking" tokens; average correlation r = 0.828 with accuracy
- Gemini Deep Think: extended reasoning for mathematical and scientific discovery

### Academic Research: Cognitive Scaffolding via Structured Markup

- **Cognitive scaffolding via symbolic schemas** (arXiv:2508.21204): fuzzy schema logic + boundary role prompts + structured memory for adaptive reasoning. Uses structured memory schema to promote adaptive, structured reasoning at inference time.

- **Reasoning Scaffolding Distillation** (arXiv:2509.23619): Logic Representation Distillation — dual-branch architecture trains smaller models to learn both reasoning content and reasoning *structure* simultaneously. This is knowledge distillation of the structural format, not just the semantic content.

- **Cognitive Tools** (arXiv:2506.12115): cognitive tools encapsulate reasoning operations *within* the LLM itself. Each tool schema includes a prompt template isolating a specific cognitive operation; structured intermediate result feeds back into main reasoning loop. This is a form of programmatic thinking structure without external grounding.

### The Convergent Pattern

Every major lab has arrived at a version of the same insight: **the thinking process should be structurally separated from the final output**. The mechanisms differ — XML tags (Anthropic), hidden reasoning tokens (OpenAI), RL-trained format tags (DeepSeek), API response block types (Anthropic extended thinking) — but the principle is the same. Structured thinking format improves output quality, and the format must be reliably enforced (through training, RL reward, or architectural separation) to be useful.

The CRANE result (up to 10pp improvement from alternating unconstrained reasoning with constrained output) provides the empirical grounding for *why* this matters: you cannot constrain the reasoning without degrading reasoning quality.

---

## Part 5: How Claude Code Handles Outputs

### Architecture Overview

Claude Code runs as a single-threaded master loop. Its output types are:

| Output Type | Format | Purpose |
|---|---|---|
| Tool calls | JSON (schema-validated) | Structured actions (read, write, bash, grep, etc.) |
| Tool results | Plain text | Execution results fed back into context |
| Reasoning + human text | Plain text / markdown | Explanation, plans, responses to user |
| UI metadata | XML-like tags | Frontend communication (`<command-message>`, `<command-name>`) |
| Task lists | Structured JSON | TodoWrite tool produces JSON with IDs, content, status, priority |
| CLI output | `--output-format json / text / stream-json` | Programmatic vs. human consumption |

### Tool Call Architecture

Tools are defined in the system prompt (18 builtin tool descriptions in the prompt repository at `github.com/Piebald-AI/claude-code-system-prompts`). Each tool has a JSON Schema `input_schema`. When Claude Code invokes a tool:

1. Model generates a `tool_use` content block with `input` JSON object
2. Anthropic API validates the input against the schema (tool's `strict` mode if enabled)
3. Tool executor (sandboxed shell, file system, etc.) receives the validated input
4. Result returns as plain text in a `tool_result` block
5. Plain text is appended to context as the "observation"

This is a post-generation schema validation pattern (the model generates JSON and it's validated), *not* constrained decoding. With `strict: true` on tool schemas now available (November 2025 structured outputs), it's now possible to enforce tool input schemas via constrained decoding at generation time rather than post-hoc.

### XML Tags in Claude Code

XML tags serve a specific metadata/UI role in Claude Code:
- `<command-message>` and `<command-name>` tags are parsed by the frontend for display and routing
- CLAUDE.md files use markdown (not XML) for project memory
- Anthropic's prompt engineering docs are reflected in the system prompt structure: XML tags delimit major sections of the system prompt itself

### Sub-Agent Prompts

Claude Code uses specialized sub-agent prompts for planning, exploration, and task execution. These are documented in the system prompt repository:
- **Plan agent**: software architect mode — returns step-by-step plans
- **Explore agent**: codebase exploration — Glob, Grep, Read (no write tools)
- **Task agent**: general execution — full tool access

Each sub-agent has its own system prompt with XML-structured sections defining behavior, available tools, and constraints.

### Programmatic Usage

For programmatic consumption of Claude Code output, the `--output-format` flag controls encoding:
- `text`: human-readable (default for interactive use)
- `json`: structured JSON objects for each response
- `stream-json`: real-time streaming with JSON delimiters

Fine-grained tool streaming (beta, `anthropic-beta: fine-grained-tool-streaming-2025-05-14`) streams tool use parameters as partial JSON strings without buffering, reducing latency for tools with large parameter payloads.

---

## Part 6: Engineering Implications & Open Questions

### What This Means for Self-Hosted Constrained Code Generation

If you want to use a smaller self-hosted model with constrained decoding for code generation:

**Stack recommendation**:
- **Inference engine**: vLLM with XGrammar backend — production-ready, 100x faster than naive implementations, supports JSON Schema and CFG
- **Grammar definition**: EBNF via Lark for Outlines CFG mode, or direct BNF for llama.cpp/XGrammar
- **Model size**: 7B–13B with constrained decoding is empirically competitive with 70B unconstrained on structured generation tasks
- **Target language choice**: Lisp/S-expressions are the easiest (trivially simple grammar, small automaton). TypeScript is possible but requires type-level constraints for full benefit. Python requires context-sensitive grammar handling for indentation.
- **Separate reasoning from constrained output** (CRANE principle): let the model reason freely, constrain only the final structured artifact

**For graph DSLs**:
- Cypher: grammar available, token-level constraint implementation required, schema grounding adds complexity
- SPARQL: formal grammar available, direct CFG application feasible
- GraphQL: formal spec grammar, same approach

**For a Lisp variant DSL**:
- Define grammar in EBNF (< 20 rules for a basic Lisp)
- Load into Outlines CFG or XGrammar
- Constrained generation guarantees every token is part of a valid parse
- Add semantic constraints (valid symbol names, arity checking) as custom validators on top
- This is probably the highest-ROI target: maximum grammar constraint benefit, minimum grammar complexity

### Key Open Research Questions

1. Does grammar-constrained generation help or hurt when the model needs to generate *semantically novel* code (vs. pattern-matching to known forms)?
2. Can constrained decoding be combined with test-time compute scaling (repeated sampling, best-of-N) for further gains?
3. What is the optimal grammar granularity — full language grammar vs. structural subset vs. type-annotated subset?
4. Can the CRANE alternating-constraint approach be adapted for compiler-backed constraints where the compiler provides the valid-token oracle?

---

## References

| Paper / Resource | Source |
|---|---|
| Synchromesh: Reliable Code Generation (ICLR 2022) | arXiv:2201.11227 |
| Type-Constrained Code Generation (PLDI 2025) | arXiv:2504.09246 |
| Correctness-Guaranteed Code Generation via Constrained Decoding | arXiv:2508.15866 |
| Constrained Decoding for FIM Code LMs | arXiv:2402.17988 |
| CRANE: Reasoning with Constrained LLM Generation (ICML 2025) | arXiv:2502.09061 |
| Grammar-Constrained Decoding for Structured NLP Tasks | arXiv:2305.13971 |
| Grammar-Aligned Decoding (NeurIPS 2024) | NeurIPS 2024 Proceedings |
| DOMINO: Fast, Non-Invasive Constrained Generation (ICML 2024) | arXiv:2403.06988 |
| XGrammar: Efficient Structured Generation (Nov 2024) | arXiv:2411.15100 |
| Flexible and Efficient Grammar-Constrained Decoding (ICML 2025) | arXiv:2502.05111 |
| Inference-Time Techniques for Efficient Code Generation | UW CSE 503, 2025 |
| Pel: A Language for Orchestrating AI Agents | arXiv:2505.13453 |
| From Tool Calling to Symbolic Thinking: Lisp Metaprogramming | arXiv:2506.10021 |
| Text2Cypher: Bridging NL and Graph Databases (ACL 2025) | arXiv:2412.10064 |
| Text-to-Cypher with Logit-Level Constraints | ScienceDirect 2025 |
| DeepSeek-R1 | arXiv:2501.12948 |
| OpenAI Structured Outputs Announcement (Aug 2024) | openai.com |
| Anthropic Structured Outputs (Nov 2025) | docs.anthropic.com |
| Anthropic Extended Thinking Docs | docs.anthropic.com |
| Anthropic XML Tags Docs | docs.anthropic.com |
| Claude Code System Prompts Repository | github.com/Piebald-AI/claude-code-system-prompts |
| vLLM Structured Decoding Introduction | blog.vllm.ai |
| JSONSchemaBench | arXiv:2501.10868 |
| Awesome LLM Constrained Decoding (curated) | github.com/Saibo-creator/Awesome-LLM-Constrained-Decoding |
| Cognitive Scaffolding via Symbolic Schemas | arXiv:2508.21204 |
| Reasoning Scaffolding Distillation | arXiv:2509.23619 |
| Eliciting Reasoning with Cognitive Tools | arXiv:2506.12115 |
| Grammar-Constrained Decoding Makes LLMs Better Logical Parsers (ACL Industry 2025) | ACL Anthology |
