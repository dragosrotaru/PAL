import type { IEnv } from "../interfaces.js";
import type { Lang } from "../language/ast.js";
import { STATIC } from "../language/typesystem.js";

/*
process:

-   macro expansion - match and replace the ast
    -   pattern matching - matches ast to the correct macro
    -   substitution - takes the ast and binds its constituents to the template
    -   evaluation - continue evaluating the ast
*/

type Macro = {
  pattern: Lang.AST;
  template: Lang.AST;
};

type Bindings = Record<symbol, Lang.AST>;

const macros: Macro[] = [];

// (macro pattern template)
export type Form = [typeof Identifier, Lang.AST, Lang.AST];

export const Identifier = Symbol.for("macro");

const IsPattern = (ast: Lang.AST): boolean => {
  // todo? pattern validation
  return true;
};

const IsTemplate = (ast: Lang.AST): boolean => {
  // todo? template validation
  return true;
};

const PatternTemplateInvariantsMet = (
  pattern: Lang.AST,
  template: Lang.AST
): boolean => {
  // todo validate that the combination of pattern and template dont break some rules
  // This function checks that the pattern-template combination is valid.
  // For instance, we might check if every identifier in the template also appears in the pattern.
  // For now, let's keep it simple and always return true.
  // This can be fleshed out further based on your specific requirements.
  return true;
};

const PatternEnvInvariantsMet = (env: IEnv, pattern: Lang.AST): boolean => {
  // todo validate that the combination of pattern and environment dont break some rules
  // Here, we can validate any environment-specific rules that the pattern must respect.
  // For now, we'll just return true.
  return true;
};

const TemplateEnvInvariantsMet = (env: IEnv, template: Lang.AST): boolean => {
  // todo validate that the combination of template and environment dont break some rules
  // Here, we can validate any environment-specific rules that the template must respect.
  // For now, we'll just return true.
  return true;
};

export const Is = (ast: Lang.AST): ast is Form => {
  if (!STATIC.IsList(ast)) return false;
  if (ast.length !== 3) return false;
  const id = ast[0];
  const pattern = ast[1];
  const template = ast[2];
  if (id !== Identifier) return false;
  if (!IsPattern(pattern)) return false;
  if (!IsTemplate(template)) return false;
  return true;
};

export const Define = (env: IEnv) => (ast: Form) => {
  const pattern = ast[1];
  const template = ast[2];
  return defineMacro(env)(pattern, template);
};

// macro definition - DSL for the features wanted in macro definition, at define-time
const defineMacro = (env: IEnv) => (pattern: Lang.AST, template: Lang.AST) => {
  if (!PatternTemplateInvariantsMet(pattern, template)) {
    return undefined;
  }
  if (!PatternEnvInvariantsMet(env, pattern)) {
    return undefined;
  }
  if (!TemplateEnvInvariantsMet(env, pattern)) {
    return undefined;
  }

  macros.push({ pattern, template });
  return true;
};

/*  EXPANSION Time */

export const Expand = (env: IEnv) => (ast: Lang.AST) => {
  const bindingMatch = (
    pattern: Lang.AST,
    ast: Lang.AST
  ): Record<symbol, Lang.AST> | null => {
    if (!STATIC.IsList(pattern) && !STATIC.IsID(pattern)) {
      return env.ts.valueEquals(pattern, ast) ? {} : null;
    }

    if (STATIC.IsID(pattern)) {
      if (env.ts.typeEquals(ast, pattern)) {
        return { [pattern]: ast };
      } else {
        return null;
      }
    }

    if (
      STATIC.IsList(pattern) &&
      STATIC.IsList(ast) &&
      pattern.length === ast.length
    ) {
      const bindings: Record<symbol, Lang.AST> = {};

      for (let i = 0; i < pattern.length; i++) {
        const innerBindings = bindingMatch(pattern[i], ast[i]);
        if (!innerBindings) {
          return null; // The patterns don't match.
        }
        const innerKeys = Object.getOwnPropertySymbols(innerBindings);

        // Combine bindings from sub-pattern matches.
        for (let key of innerKeys) {
          bindings[key] = innerBindings[key];
        }
      }

      return bindings;
    }

    return null; // No match found.
  };

  const matches: { macro: Macro; binding: Bindings }[] = [];
  for (let i = 0; i < macros.length; i++) {
    const macro = macros[i];
    const binding = bindingMatch(macro.pattern, ast);
    if (binding !== null) {
      matches.push({ macro, binding });
    }
  }
  if (matches.length === 0) return ast;
  if (matches.length > 1)
    throw new Error("multiple macros match, this is not supported yet");
  const theOne = matches[0];

  return substitute(theOne.macro.template, theOne.binding);
};

/* 

TODO add support for these type of things:

`x - quasiquote
,q - unquote
(,@) - Unquote-splicing Splices a list into another list during quasi-quoting.
(...) - expansion

*/
// returns true if the pattern matches the ast
/* const match = (pattern: Lang.AST) => (ast: Lang.AST) => {
  if (!STATIC.IsList(pattern) && !STATIC.IsID(pattern)) {
    // if the pattern is not a Id or List, then we are matching against a fixed value, in which case we only return true if there is strict equality
    return ASTEquals(pattern, ast);
  }
  if (STATIC.IsID(pattern)) {
    // if the pattern is an identifier, we need to apply type checking rules
    // TODO deal with special identifiers starting with unquote
    return ASTEqualsIdentifierType(ast, pattern);
  }
  if (!STATIC.IsList(ast)) {
    return false;
  }
  // if the pattern is a list, then we match
  return pattern.length === ast.length && pattern.every(match);
}; */

// substitution - takes the ast and binds its constituents to the template
// todo implement hygenic magic
const substitute = (template: Lang.AST, bindings: Bindings): Lang.AST => {
  if (STATIC.IsID(template)) {
    return bindings[template] || template; // Return the binding if it exists; otherwise, return the identifier unchanged.
  }

  if (STATIC.IsList(template)) {
    return template.map((item) => substitute(item, bindings)); // Recursively substitute in list items.
  }

  // For other types, simply return the template value as it is.
  return template;
};
