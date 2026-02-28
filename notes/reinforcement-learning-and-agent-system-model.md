---
date: 2024-01-21
tags: [research, reinforcement-learning, agency, agent, systems-theory, policy, reward, causal-model]
summary: Two-part note on agency and reinforcement learning. First, a formal RL glossary (Agent, Environment, Observation, StateSpace, StateModel, DynamicsModel, Intent, Policy, Reward, Gamma, Exploitation/Exploration, Horizon). Second, a general systems theory formalization: systems are entities with boundaries, environment is the composition of all systems, interactions are Action-Observation pairs across boundaries, a query is Action→Observation and a reaction is Observation→Action. Includes the Q-learning update equation. Relevant to Pal's agent model and the design of the `(gpt ...)` operator as a policy-executing agent.
---

# Reinforcement learning and agent system model

## Glossary

**Agent** — a decision-making entity

**Environment** — the real environment (Reality)

**Observation** — some measurement of the Environment

**Observer** — some function that returns an Observation from the Environment

**StateSpace SS: { S }** — the set of all possible states the Environment can be in

**StateModel SM: O ⇒ S** — a model of the Environment's state space given observations. Takes the set of all observations made so far and produces a State. Domain is the Observation-Space, range is the State-Space.

**DynamicsModel** — a model of how the Environment can change between states. Can be a matrix with transition probabilities between every state.

**Intent I: S ⇒ [0,1]** — a function that takes the StateSpace and produces a value

**Action A: { (O, P(O)) }** — a probability distribution over outcomes (transitions over the StateSpace)

**Policy P: S ⇒ A** — a function that maps from StateSpace to ActionSpace

**Reward Function R: S ⇒ [0,1]** — weighted sum of Intent functions, returning a value in [0,1]

**Discounted Sum of Rewards** — `Rt · y^0 + Rt+1 · y + Rt+2 · y^2 + Rt+3 · y^3 ...`

**Gamma Discount Factor (y)** — `y=1` means future is equally valuable as immediate reward; `y=0` means only immediate reward matters

**Exploitation vs Exploration** — the balance between using the current best policy and trying new actions to gather information for better policies

**Horizon** — the sequence of decisions over the lifecycle of an agent; can be finite (termination states) or infinite

**Episode** — a finite sequence of decisions

**MSE** — Mean Squared Error

### Policy Evaluation

- **Dynamic Programming** — when process is Markov and dynamics/reward models are known
- **Monte Carlo** — when process is episodic (finite)
  - Every visit
  - Single visit
  - Incremental (non-stationary domain)

## System design formalization

```
Environment:  e_t ⇒ e_t+1
Observator:   e_t ⇒ o_t
History:      t   ⇒ h_t
StateModel:   h_t ⇒ s_t
Action:       a
Policy:       s   ⇒ a
Intent:       s   ⇒ v
ValueModel:   CausalModel ⇒ W
Reward:       Sum of I · W · Y · S
X, Y, Z:      [0,1]
```

**Factors:**
- `X` — Exploitation/Exploration tradeoff
- `Y` — Future vs Present Reward tradeoff
- `Z` — Plan vs Act tradeoff

**Processes to optimize:**
- Expand Action and Observation capability
- Expand/Contract IntentSpace
- Learn the StateModel
- Explore the PolicySpace
- Learn the ValueModel
- Learn the CausalModel
- Learn X, Y, Z factors

## General systems theory

A **System** is an entity identifiable by a boundary which separates it from the Environment. Systems can be composed. The Environment is the composition of all systems that exist — because it has no boundary, it cannot itself be a System.

There are two types of events: **Actions** and **Observations**. Action and Observation compose to form **Interaction** across system boundaries.

- A **Query** (Request) = Action → Observation (an action inducing an observation)
- A **Reaction** (Response) = Observation → Action (an observation inducing an action)
- Full interaction: `Action_sys1 ⇒ Observation_sys2 ⇒ Action_sys2 ⇒ Observation_sys1`

An **Actor** is an agent with the capacity to emit Actions. An Actor has **Agency** from the perspective of another system if its actions have no observable cause — i.e., a reaction is not sufficient to demonstrate agency. Agency requires autonomous, non-reactive behavior.

## Q-learning update

$$Q[s,a]^{new} \leftarrow (1 - \alpha) \cdot Q[s_t,a]_{old} + \alpha \cdot (r_t + \gamma \cdot \max_a(Q[s_{t+1},a]))$$
