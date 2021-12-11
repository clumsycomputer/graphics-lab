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

export type Loop = RootLoop

export type RootLoop = SoloRootLoop | ParentRootLoop

export interface SoloRootLoop extends LoopBase<'soloRootLoop'>, RootLoopBase {}

export interface ParentRootLoop
  extends LoopBase<'parentRootLoop'>,
    RootLoopBase,
    ParentLoopBase {}

interface RootLoopBase {
  baseCircle: Circle
}

export type ChildLoop = ParentChildLoop | BabyChildLoop

export interface ParentChildLoop
  extends LoopBase<'parentChildLoop'>,
    ParentLoopBase,
    ChildLoopBase {}

export interface BabyChildLoop
  extends LoopBase<'babyChildLoop'>,
    ChildLoopBase {}

interface ChildLoopBase {
  relativeDepth: number
  relativeRadius: number
  phaseAngle: number
  baseRotationAngle: number
}

interface ParentLoopBase {
  childLoop: ChildLoop
  childRotationAngle: number
}

interface LoopBase<LoopType extends string> {
  loopType: LoopType
}
