/**
 * Global master types that are accessible everywhere
 */

type Mutable = {
  -readonly [key in keyof Immutable]: Immutable[key];
};

type ImageSize = {
  width: number;
  height: number;
};
