# Transformers

the input is taken, and vectorized in an embedding with a positional encoding

Multi-headed attention
Distributed Representations

query key and value vectors
query x key = scores determines how much focus should a symbol have to another symbol
scaled down by being divided by the square root of the dimention of the keys , to allow for more stable gradient
softmax function
this gives attention weights, multiplied by value vector to get the output vector
feed it into a linear layer to process

## References

https://jalammar.github.io/illustrated-transformer/
https://www.youtube.com/watch?v=4Bdc55j80l8&t=311s
https://sargupta93.medium.com/explanation-of-attention-is-all-you-need-with-code-by-abhishek-thakur-89861d24ea9d
https://arxiv.org/pdf/1706.03762.pdf
