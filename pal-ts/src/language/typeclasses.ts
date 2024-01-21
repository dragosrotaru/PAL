/* Learning from Haskell, here is an attempt at some TypeClasses */

export interface Guard<T> {
  is: (a: unknown) => a is T;
}

export interface Equality<T> {
  equals: (a: T, b: T) => boolean;
}

export interface Write<T> {
  write: (a: T) => string;
}

export interface Parse<T> {
  parse: (v: string) => T;
}

export interface Type<T> extends Guard<T>, Equality<T>, Write<T>, Parse<T> {}

export interface UI<T> {
  render: (a: T) => Element;
}

export interface Order<T> {
  compare: (a: T, b: T) => number; // should return negative if a < b, zero if a == b, and positive if a > b
}

export interface Enumerable<T> {
  succ: (a: T) => T; // get successor of a value
  pred: (a: T) => T; // get predecessor of a value
}

export interface Bounded<T> {
  minBound: () => T;
  maxBound: () => T;
}

export interface Numeric<T> {
  add: (a: T, b: T) => T;
  subtract: (a: T, b: T) => T;
  multiply: (a: T, b: T) => T;
}

export interface Fractional<T> extends Numeric<T> {
  divide: (a: T, b: T) => T;
}

export interface Functor<T> {
  fmap: <U>(f: (a: T) => U) => Functor<U>;
}

export interface Applicative<T> extends Functor<T> {
  apply: <U>(f: Applicative<(a: T) => U>) => Applicative<U>;
  pure: <U>(value: U) => Applicative<U>;
}

export interface Monad<T> extends Applicative<T> {
  bind: <U>(f: (a: T) => Monad<U>) => Monad<U>;
}
