//! pal-eval: Minimal PAL Lisp evaluator.
//!
//! Accepts one S-expression string as the first CLI argument, evaluates it,
//! and prints the result as JSON to stdout.
//!
//! Supported forms:
//!   - Integer and boolean literals
//!   - Arithmetic: +, -, *, /
//!   - Comparison: =, <, >
//!   - Boolean ops: and, or, not
//!   - List ops: cons, car, cdr, length, append, list
//!   - let: (let ((x 1) (y 2)) (+ x y))
//!   - if:  (if condition then else)
//!   - quote: (quote (1 2 3))
//!
//! Output format: JSON (number, boolean, null, array, string).
//!
//! @author claude

use std::collections::HashMap;
use std::env;
use std::fmt;

// ---------------------------------------------------------------------------
// AST
// ---------------------------------------------------------------------------

/// The value type for the PAL Lisp evaluator.
#[derive(Debug, Clone, PartialEq)]
enum Val {
    Int(i64),
    Bool(bool),
    Null,
    List(Vec<Val>),
    Str(String),
    // Internal: built-in procedure name
    Builtin(String),
}

impl fmt::Display for Val {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.to_json())
    }
}

impl Val {
    /// Serialize to JSON string.
    fn to_json(&self) -> String {
        match self {
            Val::Int(n) => n.to_string(),
            Val::Bool(b) => b.to_string(),
            Val::Null => "null".to_string(),
            Val::Str(s) => format!("\"{}\"", s.replace('\\', "\\\\").replace('"', "\\\"")),
            Val::List(items) => {
                let inner: Vec<String> = items.iter().map(|v| v.to_json()).collect();
                format!("[{}]", inner.join(","))
            }
            Val::Builtin(name) => format!("\"<builtin:{}>\"", name),
        }
    }
}

// ---------------------------------------------------------------------------
// Tokenizer
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq)]
enum Token {
    LParen,
    RParen,
    Atom(String),
    Str(String),
}

/// Tokenize an S-expression source string.
fn tokenize(src: &str) -> Result<Vec<Token>, String> {
    let mut tokens = Vec::new();
    let chars: Vec<char> = src.chars().collect();
    let mut i = 0;
    while i < chars.len() {
        let c = chars[i];
        match c {
            '(' => { tokens.push(Token::LParen); i += 1; }
            ')' => { tokens.push(Token::RParen); i += 1; }
            '"' => {
                // String literal
                i += 1;
                let mut s = String::new();
                while i < chars.len() && chars[i] != '"' {
                    if chars[i] == '\\' && i + 1 < chars.len() {
                        i += 1;
                        s.push(chars[i]);
                    } else {
                        s.push(chars[i]);
                    }
                    i += 1;
                }
                if i >= chars.len() {
                    return Err("Unterminated string literal".to_string());
                }
                i += 1; // consume closing '"'
                tokens.push(Token::Str(s));
            }
            c if c.is_whitespace() => { i += 1; }
            _ => {
                // Atom: read until whitespace or paren
                let mut atom = String::new();
                while i < chars.len() && !chars[i].is_whitespace() && chars[i] != '(' && chars[i] != ')' {
                    atom.push(chars[i]);
                    i += 1;
                }
                tokens.push(Token::Atom(atom));
            }
        }
    }
    Ok(tokens)
}

// ---------------------------------------------------------------------------
// S-expression parse tree (before evaluation)
// ---------------------------------------------------------------------------

#[derive(Debug, Clone)]
enum Expr {
    Int(i64),
    Bool(bool),
    Null,
    Str(String),
    Symbol(String),
    List(Vec<Expr>),
}

/// Parse tokens into an expression tree.
fn parse(tokens: &[Token], pos: &mut usize) -> Result<Expr, String> {
    if *pos >= tokens.len() {
        return Err("Unexpected end of input".to_string());
    }
    match &tokens[*pos] {
        Token::RParen => Err(format!("Unexpected ')' at position {}", *pos)),
        Token::LParen => {
            *pos += 1;
            let mut items = Vec::new();
            while *pos < tokens.len() && tokens[*pos] != Token::RParen {
                items.push(parse(tokens, pos)?);
            }
            if *pos >= tokens.len() {
                return Err("Missing closing ')'".to_string());
            }
            *pos += 1; // consume ')'
            Ok(Expr::List(items))
        }
        Token::Str(s) => {
            let s = s.clone();
            *pos += 1;
            Ok(Expr::Str(s))
        }
        Token::Atom(a) => {
            let a = a.clone();
            *pos += 1;
            // Parse booleans, null, and integers
            if a == "true" { return Ok(Expr::Bool(true)); }
            if a == "false" { return Ok(Expr::Bool(false)); }
            if a == "null" { return Ok(Expr::Null); }
            // Try integer parse (including negative)
            if let Ok(n) = a.parse::<i64>() {
                return Ok(Expr::Int(n));
            }
            Ok(Expr::Symbol(a))
        }
    }
}

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------

type Env = HashMap<String, Val>;

fn make_global_env() -> Env {
    let mut env = Env::new();
    // Register builtin names as sentinel values; eval dispatches on them.
    for name in &["+", "-", "*", "/", "=", "<", ">",
                  "and", "or", "not",
                  "cons", "car", "cdr", "length", "append", "list"] {
        env.insert(name.to_string(), Val::Builtin(name.to_string()));
    }
    env
}

// ---------------------------------------------------------------------------
// Evaluator
// ---------------------------------------------------------------------------

fn eval(expr: &Expr, env: &Env) -> Result<Val, String> {
    match expr {
        // Literals evaluate to themselves
        Expr::Int(n)  => Ok(Val::Int(*n)),
        Expr::Bool(b) => Ok(Val::Bool(*b)),
        Expr::Null    => Ok(Val::Null),
        Expr::Str(s)  => Ok(Val::Str(s.clone())),

        // Symbol lookup
        Expr::Symbol(name) => {
            env.get(name)
               .cloned()
               .ok_or_else(|| format!("Unbound symbol: '{}'", name))
        }

        // List / special forms
        Expr::List(items) => {
            if items.is_empty() {
                return Ok(Val::List(vec![]));
            }

            // Special form: quote
            if let Expr::Symbol(head) = &items[0] {
                if head == "quote" {
                    if items.len() != 2 {
                        return Err("quote expects exactly one argument".to_string());
                    }
                    return quote_expr(&items[1]);
                }

                // Special form: if
                if head == "if" {
                    if items.len() != 4 {
                        return Err("if expects exactly 3 arguments: (if cond then else)".to_string());
                    }
                    let cond = eval(&items[1], env)?;
                    return match cond {
                        Val::Bool(true)  => eval(&items[2], env),
                        Val::Bool(false) => eval(&items[3], env),
                        other => Err(format!("if condition must be a boolean, got: {}", other)),
                    };
                }

                // Special form: let
                if head == "let" {
                    if items.len() != 3 {
                        return Err("let expects exactly 2 arguments: (let ((x v)...) body)".to_string());
                    }
                    let bindings_expr = &items[1];
                    let body = &items[2];
                    return eval_let(bindings_expr, body, env);
                }
            }

            // Otherwise: evaluate head, then apply
            let head_val = eval(&items[0], env)?;
            match &head_val {
                Val::Builtin(name) => {
                    let name = name.clone();
                    // Evaluate all arguments
                    let args: Result<Vec<Val>, String> = items[1..].iter()
                        .map(|a| eval(a, env))
                        .collect();
                    let args = args?;
                    apply_builtin(&name, args)
                }
                other => Err(format!(
                    "Cannot apply non-procedure value: {}",
                    other
                )),
            }
        }
    }
}

/// Evaluate a `let` binding form.
fn eval_let(bindings_expr: &Expr, body: &Expr, env: &Env) -> Result<Val, String> {
    let pairs = match bindings_expr {
        Expr::List(pairs) => pairs,
        _ => return Err("let bindings must be a list of (name value) pairs".to_string()),
    };

    let mut new_env = env.clone();
    for pair in pairs {
        match pair {
            Expr::List(kv) if kv.len() == 2 => {
                let name = match &kv[0] {
                    Expr::Symbol(s) => s.clone(),
                    _ => return Err("let binding name must be a symbol".to_string()),
                };
                let val = eval(&kv[1], env)?; // evaluate in original env (parallel let)
                new_env.insert(name, val);
            }
            _ => return Err("each let binding must be a (name value) pair".to_string()),
        }
    }
    eval(body, &new_env)
}

/// Quote an expression tree into a Val without evaluating it.
fn quote_expr(expr: &Expr) -> Result<Val, String> {
    match expr {
        Expr::Int(n)  => Ok(Val::Int(*n)),
        Expr::Bool(b) => Ok(Val::Bool(*b)),
        Expr::Null    => Ok(Val::Null),
        Expr::Str(s)  => Ok(Val::Str(s.clone())),
        Expr::Symbol(s) => Ok(Val::Str(s.clone())),
        Expr::List(items) => {
            let vals: Result<Vec<Val>, String> = items.iter().map(quote_expr).collect();
            Ok(Val::List(vals?))
        }
    }
}

/// Apply a built-in procedure to evaluated arguments.
fn apply_builtin(name: &str, args: Vec<Val>) -> Result<Val, String> {
    match name {
        // Arithmetic
        "+" => {
            check_argc(name, &args, 2)?;
            Ok(Val::Int(as_int(name, &args[0])? + as_int(name, &args[1])?))
        }
        "-" => {
            check_argc(name, &args, 2)?;
            Ok(Val::Int(as_int(name, &args[0])? - as_int(name, &args[1])?))
        }
        "*" => {
            check_argc(name, &args, 2)?;
            Ok(Val::Int(as_int(name, &args[0])? * as_int(name, &args[1])?))
        }
        "/" => {
            check_argc(name, &args, 2)?;
            let b = as_int(name, &args[1])?;
            if b == 0 { return Err("Division by zero".to_string()); }
            Ok(Val::Int(as_int(name, &args[0])? / b))
        }

        // Comparison
        "=" => {
            check_argc(name, &args, 2)?;
            Ok(Val::Bool(as_int(name, &args[0])? == as_int(name, &args[1])?))
        }
        "<" => {
            check_argc(name, &args, 2)?;
            Ok(Val::Bool(as_int(name, &args[0])? < as_int(name, &args[1])?))
        }
        ">" => {
            check_argc(name, &args, 2)?;
            Ok(Val::Bool(as_int(name, &args[0])? > as_int(name, &args[1])?))
        }

        // Boolean ops
        "and" => {
            check_argc(name, &args, 2)?;
            Ok(Val::Bool(as_bool(name, &args[0])? && as_bool(name, &args[1])?))
        }
        "or" => {
            check_argc(name, &args, 2)?;
            Ok(Val::Bool(as_bool(name, &args[0])? || as_bool(name, &args[1])?))
        }
        "not" => {
            check_argc(name, &args, 1)?;
            Ok(Val::Bool(!as_bool(name, &args[0])?))
        }

        // List operations
        "cons" => {
            check_argc(name, &args, 2)?;
            let mut result = match &args[1] {
                Val::List(lst) => lst.clone(),
                other => return Err(format!("cons: second argument must be a list, got {}", other)),
            };
            result.insert(0, args[0].clone());
            Ok(Val::List(result))
        }
        "car" => {
            check_argc(name, &args, 1)?;
            let lst = as_list(name, &args[0])?;
            lst.into_iter().next()
               .ok_or_else(|| "car: empty list".to_string())
        }
        "cdr" => {
            check_argc(name, &args, 1)?;
            let lst = as_list(name, &args[0])?;
            if lst.is_empty() {
                return Err("cdr: empty list".to_string());
            }
            Ok(Val::List(lst[1..].to_vec()))
        }
        "length" => {
            check_argc(name, &args, 1)?;
            let lst = as_list(name, &args[0])?;
            Ok(Val::Int(lst.len() as i64))
        }
        "append" => {
            let mut result = Vec::new();
            for arg in &args {
                let lst = as_list(name, arg)?;
                result.extend(lst);
            }
            Ok(Val::List(result))
        }
        "list" => {
            Ok(Val::List(args))
        }

        other => Err(format!("Unknown builtin: '{}'", other)),
    }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

fn check_argc(name: &str, args: &[Val], expected: usize) -> Result<(), String> {
    if args.len() != expected {
        Err(format!(
            "{} expects {} argument(s), got {}",
            name, expected, args.len()
        ))
    } else {
        Ok(())
    }
}

fn as_int(op: &str, v: &Val) -> Result<i64, String> {
    match v {
        Val::Int(n) => Ok(*n),
        other => Err(format!("{}: expected integer, got {}", op, other)),
    }
}

fn as_bool(op: &str, v: &Val) -> Result<bool, String> {
    match v {
        Val::Bool(b) => Ok(*b),
        other => Err(format!("{}: expected boolean, got {}", op, other)),
    }
}

fn as_list(op: &str, v: &Val) -> Result<Vec<Val>, String> {
    match v {
        Val::List(lst) => Ok(lst.clone()),
        other => Err(format!("{}: expected list, got {}", op, other)),
    }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        eprintln!("Usage: pal-eval '<expression>'");
        std::process::exit(1);
    }
    let src = &args[1];

    let tokens = match tokenize(src) {
        Ok(t) => t,
        Err(e) => {
            eprintln!("Tokenize error: {}", e);
            std::process::exit(1);
        }
    };

    let mut pos = 0;
    let expr = match parse(&tokens, &mut pos) {
        Ok(e) => e,
        Err(e) => {
            eprintln!("Parse error: {}", e);
            std::process::exit(1);
        }
    };

    let env = make_global_env();
    let result = match eval(&expr, &env) {
        Ok(v) => v,
        Err(e) => {
            eprintln!("Eval error: {}", e);
            std::process::exit(1);
        }
    };

    println!("{}", result.to_json());
}
