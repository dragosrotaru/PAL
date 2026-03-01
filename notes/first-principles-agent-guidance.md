---
date: 2026-02-28
tags: [agent, llm, taxonomy, first-principles, guidance, orchestration, constrained-decoding, structured-output, architecture, metacognition]
summary: First-principles taxonomy of LLM guidance and control mechanisms, organized around two core frames: (1) data flow — input → black box → output, with state decomposed into chat history + environment; (2) locus of control — environment-in-control (hooks, output validation) vs. agent-in-control (tool execution). Structural primitives: constrained decoding (decode-time), output validation (post-decode), hooks (IoC), tool/code execution (agent drive). Guidance mechanisms: self-reflection, agent-over-agent, phased pipelines (OODA, Plan/Act/Verify), context retrieval/compaction, prompt engineering, sub-agents, and context management tools (AGENTS.md, skills). Metacognitive frameworks: CoT, phased pipelines, self-reflection, agent-over-agent. Foundation document for the system module architecture in swm and the convergence with Pal.
---

# First Principles of Agent Guidance

# Overview

LLM models are black boxes for the sake of this conversation, with exception for train-time and inference-time controls, and decode-time control:

constrained decoding = decoder-tme validation
sampling params/hyperparameters
chain of thought
fine tuning

The rest of it can be thought as data flow with input -> black box -> output units.

We can think of things from the perspective of fundamental state:

- chat history - the history of inputs and outputs
- environment - everything else

# Structural primitives

- output validation = env in control (post decode-time)
- hooks (just agent loop IoC) = env is in control
- tool/code execution = agent in control

# Guidance mechanisms 

- Agent managing itself (self-reflection)
- Agent managing Agent
- phased, structured pipeline (For example OODA loop, or Plan, Act, Verify)
- context retrieval  (or the whole class of queries on environment)
- context compaction (or the whole class of mutations chat history state)
- prompting (the whole class of "really really good input", prompt engineering, few-shot, etc)
- Agent calling Agent (subagents, or the whole class of multi-agent systems)
- tool search tool, AGENTS.md, skills (or the whole class of context management)

# Output Validation / structured output

constrained decoding, and validation, can be also considered through the typical lens of error correction, validation, verification and grammar theory for structured and natural language outputs:

- regex
- schema
- ast
- compilation, tests, procedural checks
- stochastic models (classifiers, nlp, ML)

## Meta Cognitive Frameworks 

We can also frame some of these concepts as "meta" cognitive frameworks:

- chain of thought
- phased, structured pipeline
- self-reflection
- agent manage agent

## Context, Scope Permissions Management, Orchestation and Composition Techniques

We can also think about this as managing context, scoping permissions, limiting the latent token space. composition techniques with sub-agents are the classic example which is the most full-featured.

- sub agents/multi-agents
- compact
- tool search tool
- AGENTS.md
- skills