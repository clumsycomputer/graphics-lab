export interface Circle {
  center: Point
  radius: number
}

export interface Point {
  x: number
  y: number
}

export interface LoopPoint extends Point {
  centerAngle: number
}
