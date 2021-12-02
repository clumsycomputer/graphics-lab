export interface Loop {
  baseCircle: Circle
  childLoop: ChildLoop | null
  childRotationAngle: number
}

export type ChildLoop = MiddleChildLoop | FinalChildLoop

export interface MiddleChildLoop extends ChildLoopBase<'middleChildLoop'> {
  childRotationAngle: number
  childLoop: ChildLoop
}

export interface FinalChildLoop extends ChildLoopBase<'finalChildLoop'> {}

interface ChildLoopBase<ChildLoopType extends string> {
  childLoopType: ChildLoopType
  relativeDepth: number
  relativeRadius: number
  phaseAngle: number
  baseRotationAngle: number
}

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
