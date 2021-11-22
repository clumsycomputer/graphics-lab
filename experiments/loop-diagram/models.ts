export type Loop = BasicLoop | BaseCircleRotatedLoop | ChildCircleRotatedLoop

export interface BasicLoop extends LoopBase<'basicLoop'> {}

export interface BaseCircleRotatedLoop
  extends RotatedLoopBase<'baseCircleRotatedLoop'> {}

export interface ChildCircleRotatedLoop
  extends RotatedLoopBase<'childCircleRotatedLoop'> {}

interface RotatedLoopBase<RotatedLoopType extends string>
  extends LoopBase<RotatedLoopType> {
  rotationAngle: number
}

export interface LoopBase<LoopType extends string> {
  loopType: LoopType
  baseCircle: Circle
  childCircle: {
    relativeDepth: number
    relativeRadius: number
    phaseAngle: number
  }
}

export interface ChildCircle extends Circle {
  depth: number
}

export interface Circle {
  center: Point
  radius: number
}

export interface TraceablePoint extends Point {
  originAngle: number
}

export interface Point {
  x: number
  y: number
}
