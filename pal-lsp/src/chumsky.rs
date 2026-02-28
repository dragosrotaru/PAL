//! Parser and AST for the Pal language ("Foo" placeholder in comments).
//!
//! Implements a two-phase pipeline using the `chumsky` parser-combinator library:
//! 1. **Lexer** (`lexer()`) — tokenises source text into `Vec<(Token, SimpleSpan)>`.
//! 2. **Parser** (`funcs_parser()`) — parses a token stream into `HashMap<String, Func>`.
//!
//! # Language features (lexer + parser)
//!
//! - Literals: `null`, booleans, integers/floats, double-quoted strings
//! - Identifiers and keywords: `fn`, `let`, `print`, `if`, `else`
//! - Operators: `+`, `-`, `*`, `/`, `==`, `!=`
//! - Control characters: `()`, `[]`, `{}`, `;`, `,`
//! - Single-line comments: `//`
//! - Top-level functions: `fn name(args) { body }`
//! - Expressions: let bindings, binary ops, function calls, if/else, lists
//!
//! # Entry point
//!
//! [`parse`] is the main public entry: tokenise + parse + collect semantic tokens.
//! [`type_inference`] does a lightweight walk over `let` nodes to fill a span→value table.

use core::fmt;
use std::collections::HashMap;
use tower_lsp::lsp_types::SemanticTokenType;
use serde::{Deserialize, Serialize};
use chumsky::prelude::*;

use crate::semantic_token::LEGEND_TYPE;

/// Byte-offset range within the source string.
pub type Span = std::ops::Range<usize>;

/// A semantic token produced during lexing, before delta-encoding for the LSP wire format.
///
/// The LSP protocol requires tokens to be delta-encoded (relative to the previous token),
/// but that encoding happens in `main.rs`. Here we store absolute positions.
#[derive(Debug)]
pub struct ImCompleteSemanticToken {
    /// Absolute byte offset of the token's first character.
    pub start: usize,
    /// Length of the token in bytes.
    pub length: usize,
    /// Index into [`semantic_token::LEGEND_TYPE`].
    pub token_type: usize,
}

/// Lexical token types produced by the lexer.
#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub enum Token {
    Null,
    Bool(bool),
    Num(String),
    Str(String),
    Op(String),
    Ctrl(char),
    Ident(String),
    Fn,
    Let,
    Print,
    If,
    Else,
}

impl fmt::Display for Token {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Token::Null => write!(f, "null"),
            Token::Bool(x) => write!(f, "{}", x),
            Token::Num(n) => write!(f, "{}", n),
            Token::Str(s) => write!(f, "{}", s),
            Token::Op(s) => write!(f, "{}", s),
            Token::Ctrl(c) => write!(f, "{}", c),
            Token::Ident(s) => write!(f, "{}", s),
            Token::Fn => write!(f, "fn"),
            Token::Let => write!(f, "let"),
            Token::Print => write!(f, "print"),
            Token::If => write!(f, "if"),
            Token::Else => write!(f, "else"),
        }
    }
}

fn lexer<'src>() -> impl Parser<'src, &'src str, Vec<(Token, SimpleSpan)>, extra::Err<Rich<'src, char>>> {
    // A parser for numbers (int part optionally followed by .digits)
    let num = text::int(10)
        .then(just('.').then(text::digits(10)).or_not())
        .to_slice()
        .map(|s: &str| Token::Num(s.to_string()));

    // A parser for strings
    let str_ = just('"')
        .ignore_then(any().filter(|c: &char| *c != '"').repeated().to_slice())
        .then_ignore(just('"'))
        .map(|s: &str| Token::Str(s.to_string()));

    // A parser for operators
    let op = one_of("+-*/!=")
        .repeated()
        .at_least(1)
        .to_slice()
        .map(|s: &str| Token::Op(s.to_string()));

    // A parser for control characters (delimiters, semicolons, etc.)
    let ctrl = one_of("()[]{};,").map(Token::Ctrl);

    // A parser for identifiers and keywords
    let ident = text::ascii::ident().map(|ident: &str| match ident {
        "fn" => Token::Fn,
        "let" => Token::Let,
        "print" => Token::Print,
        "if" => Token::If,
        "else" => Token::Else,
        "true" => Token::Bool(true),
        "false" => Token::Bool(false),
        "null" => Token::Null,
        _ => Token::Ident(ident.to_string()),
    });

    // A single token can be one of the above
    let token = num
        .or(str_)
        .or(op)
        .or(ctrl)
        .or(ident)
        .recover_with(skip_then_retry_until(any().ignored(), end()));

    let comment = just("//")
        .then(any().and_is(just('\n').not()).repeated())
        .padded();

    token
        .padded_by(comment.repeated())
        .map_with(|tok, e| (tok, e.span()))
        .padded()
        .repeated()
        .collect()
}

/// Runtime value types; also used by [`type_inference`] to annotate let-bindings for inlay hints.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub enum Value {
    Null,
    Bool(bool),
    Num(f64),
    Str(String),
    List(Vec<Value>),
    /// Named function reference (stores the function name).
    Func(String),
}

impl std::fmt::Display for Value {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            Self::Null => write!(f, "null"),
            Self::Bool(x) => write!(f, "{}", x),
            Self::Num(x) => write!(f, "{}", x),
            Self::Str(x) => write!(f, "{}", x),
            Self::List(xs) => write!(
                f,
                "[{}]",
                xs.iter()
                    .map(|x| x.to_string())
                    .collect::<Vec<_>>()
                    .join(", ")
            ),
            Self::Func(name) => write!(f, "<function: {}>", name),
        }
    }
}

/// Arithmetic and comparison operators.
#[derive(Clone, Debug)]
pub enum BinaryOp {
    Add,
    Sub,
    Mul,
    Div,
    Eq,
    NotEq,
}

/// A value paired with its source [`Span`].
pub type Spanned<T> = (T, Span);

/// An expression node in the AST. Children are spanned so we can generate useful runtime errors.
#[derive(Debug)]
pub enum Expr {
    Error,
    Value(Value),
    List(Vec<Spanned<Self>>),
    Local(Spanned<String>),
    Let(String, Box<Spanned<Self>>, Box<Spanned<Self>>, Span),
    Then(Box<Spanned<Self>>, Box<Spanned<Self>>),
    Binary(Box<Spanned<Self>>, BinaryOp, Box<Spanned<Self>>),
    Call(Box<Spanned<Self>>, Spanned<Vec<Spanned<Self>>>),
    If(Box<Spanned<Self>>, Box<Spanned<Self>>, Box<Spanned<Self>>),
    Print(Box<Spanned<Self>>),
}

#[allow(unused)]
impl Expr {
    fn is_error(&self) -> bool {
        matches!(self, Self::Error)
    }

    fn is_let(&self) -> bool {
        matches!(self, Self::Let(..))
    }

    fn is_value(&self) -> bool {
        matches!(self, Self::Value(..))
    }

    fn try_into_value(self) -> Result<Value, Self> {
        if let Self::Value(v) = self {
            Ok(v)
        } else {
            Err(self)
        }
    }

    fn as_value(&self) -> Option<&Value> {
        if let Self::Value(v) = self {
            Some(v)
        } else {
            None
        }
    }
}

/// A top-level function definition.
#[derive(Debug)]
pub struct Func {
    pub args: Vec<Spanned<String>>,
    pub body: Spanned<Expr>,
    pub name: Spanned<String>,
    pub span: Span,
}

/// The token input type: a slice of (Token, SimpleSpan) pairs using split_token_span.
pub type TokenInput<'tokens> = chumsky::input::MappedInput<
    'tokens,
    Token,
    SimpleSpan,
    &'tokens [(Token, SimpleSpan)],
>;

/// Convert a `SimpleSpan` to our local `Span` (Range<usize>).
#[inline]
fn ss(s: SimpleSpan) -> Span {
    s.start()..s.end()
}

fn expr_parser<'tokens>() -> impl Parser<
    'tokens,
    TokenInput<'tokens>,
    Spanned<Expr>,
    extra::Err<Rich<'tokens, Token>>,
> + Clone {
    recursive(|expr| {
        let raw_expr = recursive(|raw_expr| {
            let val = select! {
                Token::Null => Expr::Value(Value::Null),
                Token::Bool(x) => Expr::Value(Value::Bool(x)),
                Token::Num(n) => Expr::Value(Value::Num(n.parse().unwrap())),
                Token::Str(s) => Expr::Value(Value::Str(s)),
            }
            .labelled("value");

            let ident = select! { Token::Ident(ident) => ident }.labelled("identifier");

            // A list of expressions
            let items = expr
                .clone()
                .separated_by(just(Token::Ctrl(',')))
                .allow_trailing()
                .collect::<Vec<_>>();

            // A let expression
            let let_ = just(Token::Let)
                .ignore_then(ident.clone().map_with(|name: String, e| (name, ss(e.span()))))
                .then_ignore(just(Token::Op("=".to_string())))
                .then(raw_expr)
                .then_ignore(just(Token::Ctrl(';')))
                .then(expr.clone())
                .map(|((name, val), body)| {
                    Expr::Let(name.0.clone(), Box::new(val), Box::new(body), name.1)
                });

            let list = items
                .clone()
                .delimited_by(just(Token::Ctrl('[')), just(Token::Ctrl(']')))
                .map(Expr::List);

            // 'Atoms' are expressions that contain no ambiguity
            let atom = select! { Token::Ident(ident) => ident }
                .map_with(|s: String, e| (Expr::Local((s, ss(e.span()))), ss(e.span())))
                .or(val.map_with(|expr, e| (expr, ss(e.span()))))
                .or(let_.map_with(|expr, e| (expr, ss(e.span()))))
                .or(list.map_with(|expr, e| (expr, ss(e.span()))))
                // print is a keyword, not a function, for simplicity
                .or(just(Token::Print)
                    .ignore_then(
                        expr.clone()
                            .delimited_by(just(Token::Ctrl('(')), just(Token::Ctrl(')'))),
                    )
                    .map(|expr| Expr::Print(Box::new(expr)))
                    .map_with(|expr, e| (expr, ss(e.span()))))
                // Atoms can also be normal expressions surrounded with parentheses
                .or(expr
                    .clone()
                    .delimited_by(just(Token::Ctrl('(')), just(Token::Ctrl(')'))))
                // Attempt to recover anything that looks like a parenthesised expression but contains errors
                .recover_with(via_parser(nested_delimiters(
                    Token::Ctrl('('),
                    Token::Ctrl(')'),
                    [
                        (Token::Ctrl('['), Token::Ctrl(']')),
                        (Token::Ctrl('{'), Token::Ctrl('}')),
                    ],
                    |span: SimpleSpan| (Expr::Error, ss(span)),
                )))
                // Attempt to recover anything that looks like a list but contains errors
                .recover_with(via_parser(nested_delimiters(
                    Token::Ctrl('['),
                    Token::Ctrl(']'),
                    [
                        (Token::Ctrl('('), Token::Ctrl(')')),
                        (Token::Ctrl('{'), Token::Ctrl('}')),
                    ],
                    |span: SimpleSpan| (Expr::Error, ss(span)),
                )));

            // Function calls have very high precedence so we prioritise them
            let call = atom.foldl(
                items
                    .clone()
                    .delimited_by(just(Token::Ctrl('(')), just(Token::Ctrl(')')))
                    .map_with(|args, e| (args, ss(e.span())))
                    .repeated(),
                |f: Spanned<Expr>, args: Spanned<Vec<Spanned<Expr>>>| {
                    let span = f.1.start..args.1.end;
                    (Expr::Call(Box::new(f), args), span)
                },
            );

            // Product ops (multiply and divide) have equal precedence
            let op = just(Token::Op("*".to_string()))
                .to(BinaryOp::Mul)
                .or(just(Token::Op("/".to_string())).to(BinaryOp::Div));
            let product = call.clone().foldl(op.then(call).repeated(), |a, (op, b)| {
                let span = a.1.start..b.1.end;
                (Expr::Binary(Box::new(a), op, Box::new(b)), span)
            });

            // Sum ops (add and subtract) have equal precedence
            let op = just(Token::Op("+".to_string()))
                .to(BinaryOp::Add)
                .or(just(Token::Op("-".to_string())).to(BinaryOp::Sub));
            let sum = product
                .clone()
                .foldl(op.then(product).repeated(), |a, (op, b)| {
                    let span = a.1.start..b.1.end;
                    (Expr::Binary(Box::new(a), op, Box::new(b)), span)
                });

            // Comparison ops (equal, not-equal) have equal precedence
            let op = just(Token::Op("==".to_string()))
                .to(BinaryOp::Eq)
                .or(just(Token::Op("!=".to_string())).to(BinaryOp::NotEq));

            sum.clone().foldl(op.then(sum).repeated(), |a, (op, b)| {
                let span = a.1.start..b.1.end;
                (Expr::Binary(Box::new(a), op, Box::new(b)), span)
            })
        });

        // Blocks are expressions but delimited with braces
        let block = expr
            .clone()
            .delimited_by(just(Token::Ctrl('{')), just(Token::Ctrl('}')))
            // Attempt to recover anything that looks like a block but contains errors
            .recover_with(via_parser(nested_delimiters(
                Token::Ctrl('{'),
                Token::Ctrl('}'),
                [
                    (Token::Ctrl('('), Token::Ctrl(')')),
                    (Token::Ctrl('['), Token::Ctrl(']')),
                ],
                |span: SimpleSpan| (Expr::Error, ss(span)),
            )));

        let if_ = recursive(|if_| {
            just(Token::If)
                .ignore_then(expr.clone())
                .then(block.clone())
                .then(
                    just(Token::Else)
                        .ignore_then(block.clone().or(if_))
                        .or_not(),
                )
                .map_with(|((cond, a), b), e| {
                    let span = ss(e.span());
                    (
                        Expr::If(
                            Box::new(cond),
                            Box::new(a),
                            Box::new(match b {
                                Some(b) => b,
                                // If an `if` expression has no trailing `else` block, we magic up one
                                None => (Expr::Value(Value::Null), span.clone()),
                            }),
                        ),
                        span,
                    )
                })
        });

        // Both blocks and `if` are 'block expressions' and can appear in the place of statements
        let block_expr = block.or(if_).labelled("block");

        let block_chain = block_expr.clone().foldl(
            block_expr.clone().repeated(),
            |a: Spanned<Expr>, b: Spanned<Expr>| {
                let span = a.1.start..b.1.end;
                (Expr::Then(Box::new(a), Box::new(b)), span)
            },
        );

        block_chain
            // Expressions, chained by semicolons, are statements
            .or(raw_expr.clone())
            .foldl(
                just(Token::Ctrl(';')).ignore_then(expr.or_not()).repeated(),
                |a: Spanned<Expr>, b: Option<Spanned<Expr>>| {
                    let span = a.1.clone(); // TODO: Not correct
                    (
                        Expr::Then(
                            Box::new(a),
                            Box::new(match b {
                                Some(b) => b,
                                None => (Expr::Value(Value::Null), span.clone()),
                            }),
                        ),
                        span,
                    )
                },
            )
    })
}

/// Parser for a sequence of top-level `fn` definitions.
///
/// Returns `HashMap<String, Func>` keyed by function name.
/// Emits a custom error on duplicate function names.
pub fn funcs_parser<'tokens>() -> impl Parser<
    'tokens,
    TokenInput<'tokens>,
    HashMap<String, Func>,
    extra::Err<Rich<'tokens, Token>>,
> + Clone {
    let ident = select! { Token::Ident(ident) => ident };

    // Argument lists are just identifiers separated by commas, surrounded by parentheses
    let args = ident
        .clone()
        .map_with(|name: String, e| (name, ss(e.span())))
        .separated_by(just(Token::Ctrl(',')))
        .allow_trailing()
        .collect::<Vec<_>>()
        .delimited_by(just(Token::Ctrl('(')), just(Token::Ctrl(')')))
        .labelled("function args");

    let func = just(Token::Fn)
        .ignore_then(
            ident
                .clone()
                .map_with(|name: String, e| (name, ss(e.span())))
                .labelled("function name"),
        )
        .then(args)
        .then(
            expr_parser()
                .delimited_by(just(Token::Ctrl('{')), just(Token::Ctrl('}')))
                // Attempt to recover anything that looks like a function body but contains errors
                .recover_with(via_parser(nested_delimiters(
                    Token::Ctrl('{'),
                    Token::Ctrl('}'),
                    [
                        (Token::Ctrl('('), Token::Ctrl(')')),
                        (Token::Ctrl('['), Token::Ctrl(']')),
                    ],
                    |span: SimpleSpan| (Expr::Error, ss(span)),
                ))),
        )
        .map_with(|((name, args), body), e| {
            (
                name.clone(),
                Func {
                    args,
                    body,
                    name,
                    span: ss(e.span()),
                },
            )
        })
        .labelled("function");

    func.repeated()
        .collect::<Vec<_>>()
        .try_map(|fs, _| {
            let mut funcs = HashMap::new();
            for ((name, name_span), f) in fs {
                if funcs.insert(name.clone(), f).is_some() {
                    return Err(Rich::custom(
                        SimpleSpan::from(name_span),
                        format!("Function '{}' already exists", name),
                    ));
                }
            }
            Ok(funcs)
        })
        .then_ignore(end())
}

/// Lightweight type inference: walks `let` nodes and records the literal value type at the
/// binding's name span in `symbol_type_table`.
pub fn type_inference(expr: &Spanned<Expr>, symbol_type_table: &mut HashMap<Span, Value>) {
    match &expr.0 {
        Expr::Error => {}
        Expr::Value(_) => {}
        Expr::List(exprs) => exprs
            .iter()
            .for_each(|expr| type_inference(expr, symbol_type_table)),
        Expr::Local(_) => {}
        Expr::Let(_name, lhs, rest, name_span) => {
            if let Some(value) = lhs.0.as_value() {
                symbol_type_table.insert(name_span.clone(), value.clone());
            }
            type_inference(rest, symbol_type_table);
        }
        Expr::Then(first, second) => {
            type_inference(first, symbol_type_table);
            type_inference(second, symbol_type_table);
        }
        Expr::Binary(_, _, _) => {}
        Expr::Call(_, _) => {}
        Expr::If(_test, consequent, alternative) => {
            type_inference(consequent, symbol_type_table);
            type_inference(alternative, symbol_type_table);
        }
        Expr::Print(expr) => {
            type_inference(expr, symbol_type_table);
        }
    }
}

/// Combined output from a full parse run.
#[derive(Debug)]
pub struct ParserResult {
    /// Parsed AST — `None` if the lexer itself failed.
    pub ast: Option<HashMap<String, Func>>,
    /// Lexer and parser errors, unified with span info.
    pub parse_errors: Vec<ParseError>,
    /// Semantic tokens collected during lexing (before delta-encoding).
    pub semantic_tokens: Vec<ImCompleteSemanticToken>,
}

/// A parse error with message and span.
#[derive(Debug)]
pub struct ParseError {
    pub message: String,
    pub span: Span,
}

/// Parse `src` end-to-end: lex → classify semantic tokens → parse functions.
///
/// Always returns a `ParserResult`; errors are accumulated rather than returned as `Err`.
pub fn parse(src: &str) -> ParserResult {
    let (tokens, lex_errs) = lexer().parse(src).into_output_errors();

    // Collect lex errors early (they don't borrow from tokens)
    let lex_errors: Vec<ParseError> = lex_errs
        .into_iter()
        .map(|e| ParseError {
            message: e.to_string(),
            span: ss(*e.span()),
        })
        .collect();

    let (ast, token_errors, semantic_tokens) = if let Some(tokens) = tokens {
        let semantic_tokens: Vec<ImCompleteSemanticToken> = tokens
            .iter()
            .filter_map(|(token, span)| {
                let span_range: Span = ss(*span);
                match token {
                    Token::Null => None,
                    Token::Bool(_) => None,

                    Token::Num(_) => Some(ImCompleteSemanticToken {
                        start: span_range.start,
                        length: span_range.len(),
                        token_type: LEGEND_TYPE
                            .iter()
                            .position(|item| item == &SemanticTokenType::NUMBER)
                            .unwrap(),
                    }),
                    Token::Str(_) => Some(ImCompleteSemanticToken {
                        start: span_range.start,
                        length: span_range.len(),
                        token_type: LEGEND_TYPE
                            .iter()
                            .position(|item| item == &SemanticTokenType::STRING)
                            .unwrap(),
                    }),
                    Token::Op(_) => Some(ImCompleteSemanticToken {
                        start: span_range.start,
                        length: span_range.len(),
                        token_type: LEGEND_TYPE
                            .iter()
                            .position(|item| item == &SemanticTokenType::OPERATOR)
                            .unwrap(),
                    }),
                    Token::Ctrl(_) => None,
                    Token::Ident(_) => None,
                    Token::Fn => Some(ImCompleteSemanticToken {
                        start: span_range.start,
                        length: span_range.len(),
                        token_type: LEGEND_TYPE
                            .iter()
                            .position(|item| item == &SemanticTokenType::KEYWORD)
                            .unwrap(),
                    }),
                    Token::Let => Some(ImCompleteSemanticToken {
                        start: span_range.start,
                        length: span_range.len(),
                        token_type: LEGEND_TYPE
                            .iter()
                            .position(|item| item == &SemanticTokenType::KEYWORD)
                            .unwrap(),
                    }),
                    Token::Print => Some(ImCompleteSemanticToken {
                        start: span_range.start,
                        length: span_range.len(),
                        token_type: LEGEND_TYPE
                            .iter()
                            .position(|item| item == &SemanticTokenType::FUNCTION)
                            .unwrap(),
                    }),
                    Token::If => Some(ImCompleteSemanticToken {
                        start: span_range.start,
                        length: span_range.len(),
                        token_type: LEGEND_TYPE
                            .iter()
                            .position(|item| item == &SemanticTokenType::KEYWORD)
                            .unwrap(),
                    }),
                    Token::Else => Some(ImCompleteSemanticToken {
                        start: span_range.start,
                        length: span_range.len(),
                        token_type: LEGEND_TYPE
                            .iter()
                            .position(|item| item == &SemanticTokenType::KEYWORD)
                            .unwrap(),
                    }),
                }
            })
            .collect();

        let len = tokens.len();
        let eoi = SimpleSpan::from(len..len + 1);
        let token_input = tokens.as_slice().split_token_span(eoi);
        let (ast, parse_errs) = funcs_parser().parse(token_input).into_output_errors();

        let token_errors: Vec<ParseError> = parse_errs
            .into_iter()
            .map(|e| ParseError {
                message: e.to_string(),
                span: ss(*e.span()),
            })
            .collect();

        (ast, token_errors, semantic_tokens)
    } else {
        (None, Vec::new(), vec![])
    };

    let parse_errors = lex_errors.into_iter().chain(token_errors).collect();

    ParserResult {
        ast,
        parse_errors,
        semantic_tokens,
    }
}
