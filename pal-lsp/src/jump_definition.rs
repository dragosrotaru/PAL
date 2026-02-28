//! Go-to-definition provider.
//!
//! Given a cursor offset inside a source file, resolves it to the declaration site
//! (the `Spanned<String>` of the name at its definition point).
//! Called by `main.rs::goto_definition`.

use std::collections::HashMap;
use im_rc::Vector;
use crate::chumsky::{Expr, Func, Spanned};

/// Find the declaration site of the symbol at `ident_offset`.
///
/// Searches function names first, then walks function bodies via [`get_definition_of_expr`].
/// Returns the `(name, span)` of the declaration, or `None` if not found.
pub fn get_definition(ast: &HashMap<String, Func>, ident_offset: usize) -> Option<Spanned<String>> {
    let mut vector = Vector::new();
    for (_, v) in ast.iter() {
        if v.name.1.start < ident_offset && v.name.1.end > ident_offset {
            return Some(v.name.clone());
        }
        if v.name.1.end < ident_offset {
            vector.push_back(v.name.clone());
        }
    }

    for (_, v) in ast.iter() {
        let args = v.args.iter().cloned().collect::<Vector<_>>();
        if let (_, Some(value)) =
            get_definition_of_expr(&v.body, args + vector.clone(), ident_offset)
        {
            return Some(value);
        }
    }
    None
}

/// Recursive AST walk for definition lookup.
///
/// `definition_ass_list` is an association list of names in scope (most-recently-bound first).
/// Returns `(continue_search, result)`:
/// - `(true, None)` — cursor not found here; keep looking.
/// - `(false, Some(_))` — found the declaration site.
/// - `(false, None)` — cursor is here but no declaration found (unbound reference).
pub fn get_definition_of_expr(
    expr: &Spanned<Expr>,
    definition_ass_list: Vector<Spanned<String>>,
    ident_offset: usize,
) -> (bool, Option<Spanned<String>>) {
    match &expr.0 {
        Expr::Error => (true, None),
        Expr::Value(_) => (true, None),
        // Expr::List(exprs) => exprs
        //     .iter()
        //     .for_each(|expr| get_definition(expr, definition_ass_list)),
        Expr::Local(local) => {
            if ident_offset >= local.1.start && ident_offset < local.1.end {
                let index = definition_ass_list
                    .iter()
                    .position(|decl| decl.0 == local.0);
                (
                    false,
                    index.map(|i| definition_ass_list.get(i).unwrap().clone()),
                )
            } else {
                (true, None)
            }
        }
        Expr::Let(name, lhs, rest, name_span) => {
            let new_decl = Vector::unit((name.clone(), name_span.clone()));

            match get_definition_of_expr(lhs, definition_ass_list.clone(), ident_offset) {
                (true, None) => {
                    get_definition_of_expr(rest, new_decl + definition_ass_list, ident_offset)
                }
                (true, Some(value)) => (false, Some(value)),
                (false, None) => (false, None),
                (false, Some(value)) => (false, Some(value)),
            }
        }
        Expr::Then(first, second) => {
            match get_definition_of_expr(first, definition_ass_list.clone(), ident_offset) {
                (true, None) => get_definition_of_expr(second, definition_ass_list, ident_offset),
                (false, None) => (false, None),
                (true, Some(value)) | (false, Some(value)) => (false, Some(value)),
            }
        }
        Expr::Binary(lhs, _, rhs) => {
            match get_definition_of_expr(lhs, definition_ass_list.clone(), ident_offset) {
                (true, None) => get_definition_of_expr(rhs, definition_ass_list, ident_offset),
                (false, None) => (false, None),
                (true, Some(value)) | (false, Some(value)) => (false, Some(value)),
            }
        }
        Expr::Call(callee, args) => {
            match get_definition_of_expr(callee, definition_ass_list.clone(), ident_offset) {
                (true, None) => {}
                (true, Some(value)) => return (false, Some(value)),
                (false, None) => return (false, None),
                (false, Some(value)) => return (false, Some(value)),
            }
            for expr in &args.0 {
                match get_definition_of_expr(expr, definition_ass_list.clone(), ident_offset) {
                    (true, None) => continue,
                    (true, Some(value)) => return (false, Some(value)),
                    (false, None) => return (false, None),
                    (false, Some(value)) => return (false, Some(value)),
                }
            }
            (true, None)
        }
        Expr::If(test, consequent, alternative) => {
            match get_definition_of_expr(test, definition_ass_list.clone(), ident_offset) {
                (true, None) => {}
                (true, Some(value)) => return (false, Some(value)),
                (false, None) => return (false, None),
                (false, Some(value)) => return (false, Some(value)),
            }
            match get_definition_of_expr(consequent, definition_ass_list.clone(), ident_offset) {
                (true, None) => {}
                (true, Some(value)) => return (false, Some(value)),
                (false, None) => return (false, None),
                (false, Some(value)) => return (false, Some(value)),
            }
            match get_definition_of_expr(alternative, definition_ass_list, ident_offset) {
                (true, None) => (true, None),
                (true, Some(value)) => (false, Some(value)),
                (false, None) => (false, None),
                (false, Some(value)) => (false, Some(value)),
            }
        }
        Expr::Print(expr) => get_definition_of_expr(expr, definition_ass_list, ident_offset),
        Expr::List(lst) => {
            for expr in lst {
                match get_definition_of_expr(expr, definition_ass_list.clone(), ident_offset) {
                    (true, None) => continue,
                    (true, Some(value)) => return (false, Some(value)),
                    (false, None) => return (false, None),
                    (false, Some(value)) => return (false, Some(value)),
                }
            }
            (true, None)
        }
    }
}
