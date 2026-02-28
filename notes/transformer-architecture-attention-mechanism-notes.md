---
date: 2023-08-02
tags: [research, transformers, machine-learning, attention, neural-networks, nlp]
summary: Brief notes on the transformer architecture and the self-attention mechanism. Covers embedding with positional encoding, multi-headed attention, query/key/value vectors, score computation (Q×K scaled by √d_k), softmax to get attention weights, weighted sum of values, and the final linear layer. References include the Illustrated Transformer, "Attention Is All You Need" (Vaswani et al. 2017), and two video walkthroughs. Important as background for understanding how LLMs work — relevant to Pal's use of `(gpt ...)` as a first-class evaluator.
---

# Transformer architecture: attention mechanism notes

- Input is vectorized in an embedding with a positional encoding
- Multi-headed attention
- Distributed representations
- Query, key, and value vectors
- Query × key = scores — determines how much focus one symbol should give to another
- Scaled down by dividing by square root of the key dimension (√d_k) for more stable gradients
- Softmax function applied to scores
- This gives attention weights, which are multiplied by the value vector to produce the output vector
- Fed into a linear layer

## References

- https://jalammar.github.io/illustrated-transformer/
- https://www.youtube.com/watch?v=4Bdc55j80l8&t=311s
- https://sargupta93.medium.com/explanation-of-attention-is-all-you-need-with-code-by-abhishek-thakur-89861d24ea9d
- https://arxiv.org/pdf/1706.03762.pdf
