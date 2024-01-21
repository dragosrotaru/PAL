# Agency

# Glossary

**Agent** – a decision making entity

**Environment** – The Real Environment (Reality)

**Observation** – Some measurement of the Environment

**Observer –** Some Function that returns an Observation from the Environment 

**StateSpace SS: { S }** – The Set of all Possible States the Environment can be in.

**StateModel SM: O ⇒ S** – a Model of the Environment State Space given some Observations of the Environment. StateModel is a Function that takes the set of all Observations made so far and Produces a State. The Domain of this Function is the Observation-Space and the Range is the State-Space

**DynamicsModel** – A Model of how the Environment can change between States in the State Space. This can be a matrix with transition probabilities between every state in the StateSpace. 

**Intent I: S ⇒ [0,1] –** A Function that takes the StateSpace and Produces a Value for that StateSpace.

**Action A: { (O, P(O)) }  –** A Probability Distribution over Outcomes which are some particular transition over the StateSpace.

**Policy P: S ⇒ A –** A Function That Maps from the StateSpace to the ActionSpace.

**Reward Function R: S ⇒ [0,1] –** The State Reward Function is the weighted sum of the Intent Functions, returning a value in the range [0,1]

**Discounted Sum of Rewards** –  Rt • y^0 + Rt+1 • y + Rt+2 • y^2 + Rt+3 • y^3...

**Gamma Discount Factor (y)** – y=1 means future is equally valuable to immediate reward. y=0 means immediate reward is the only thing that matters

**Exploitation vs Exploration** – The Balance between trying Actions to gather more Observations to learn more optimal Policies and using the existing best policy, which is possibly sub-optimal, to accumulate more Reward. 

**Horizon** – The Sequence of decisions that must be made over the lifecycle of the Agent could be finite with some termination states or infinite.

**Episode –** A finite Sequence of Decisions

**MSE – Mean Squared Error** 

Policy Evaluation:

- Dynamic Programming:  When Process is Markov, Dynamics Model and Reward Model are Known
- Monte Carlo: When Process is Episodic (Finite, for example every day/week is a new trial)
    - Every Visit
    - Single Visit
    - Incremental (non-stationary domain)

# System Design

- Environment is a function of time that takes the previous environment and outputs the next environment.
- Observators are functions that take the environment at some time and give an observation.
- There are multiple Observators producing differing observations. These observations might be conflicting.
- The History is the set of all observations made up until a given time.
- The StateModel produces a State obeying the Markov property for a given history.
- A CausalModel is some model that encodes the learned relationships of the Environment.
- An Action is some value within an ActionSpace, which could be represented in vector form. This may map to multiple Actions in practice.
- A Policy is a Function that takes a State and Provides an Action Vector. The Policy must be stationary with regards to time.
- An Intent is a function that provides a value in the range of 0 to 1 for every state.
- A ValueModel takes a CausalModel and outputs a Weight Vector that maps to the Intents.
- A Reward Function produces the Discounted Sum of Rewards for all weighted Intents.
- Factor X Encodes the Exploitation/Exploration tradeoff
- Factor Y Encodes the Future vs Present Reward tradeoff
- Factor Z Encodes the Plan vs Act tradeoff

Environment: e_t ⇒ e_t+1

Observator: e_t ⇒ o_t

History: t ⇒ h_t

StateModel: h_t ⇒ s_t

Action: a

Policy: s ⇒ a

Intent: s ⇒ v

ValueModel: CausalModel ⇒ W

Reward: Sum of I • W • Y • S

X, Y, Z: [0,1]

Processes we want to occur

- Expand Action and Observation Capability
- Expand/Contract IntentSpace
- Learn the StateModel
- Explore the PolicySpace
- Learn the ValueModel
- Learn the X,Y,Z factors
- Learn the CausalModel

A System is an Entity Identifiable by a Boundary which separates it from the Environment.

Systems can be Composed.

The Environment is the Composition of all Systems that Exist. Because it does not have a boundary, it cannot be a System.

The Environment has a State which undergoes the Transformation State_t = T(State_t-1) 

State is an Information structure which describes the Environment in full.

There are two types of Events – Actions and Observations

Action and Observation compose to form Interaction across System Boundaries. 

That is, interaction between two Systems is defined by an Acton taken by one System and 

The Observation of said Action by another System

A Query (or Request) is an Action-Observation, i.e. an Action inducing an Observation. 

A Reaction (or Response) is an Observation-Action, i.e. an Observation inducing an Action.

The entire Query-Reaction Interaction can be described as Action_sys_1 ⇒ Observation_sys_2 ⇒ Action_sys_2 ⇒ Observation_sys1.

An Actor is an Agent with the capacity to Emit Actions

An Actor has Agency

An Actor is said to have Agency from the perspective of another System if there are no Observable Actors Actions do not have an Observable cause. In other words, a Reaction is not sufficient to demonstrate Agency, or Autonomous Behaviour.

Note the definition of Agency is strictly reliant on the lack of Observable Observations.   

$$Q[s,a]^{new} \leftarrow (1 - \alpha) \cdot Q[s_t,a]_{old} + \alpha \cdot (r_t + \gamma \cdot max_a(Q[s_{t+1},a]))$$