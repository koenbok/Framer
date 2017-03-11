
export type Point = {x: number, y: number}
export type Size = {width: number, height: number}
export type Frame = {x: number, y: number, width: number, height: number}
export type HorizontalDirection = "left" | "right"
export type VerticalDirection = "up" | "down"
export type Direction = HorizontalDirection | VerticalDirection
export type Edge = "top" | "right" | "bottom" | "left"
export type Degrees = number

// TODO: Replace this with something real. Maybe automatically convert values like React?
export type CSSStyles = Partial<CSSStyleDeclaration>;

