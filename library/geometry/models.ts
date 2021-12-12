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

export type LoopStructure = RootLoopStructure

export interface RootLoopStructure
  extends LoopStructureBase<'rootStructure'>,
    BaseLoopStructureBase {
  structureBase: Circle
}

export interface BranchLoopStructure
  extends LoopStructureBase<'branchStructure'>,
    BaseLoopStructureBase,
    SkeletonLoopStructureBase {}

export interface LeafLoopStructure
  extends LoopStructureBase<'leafStructure'>,
    SkeletonLoopStructureBase {}

interface BaseLoopStructureBase {
  skeletonStructure: BranchLoopStructure | LeafLoopStructure
  skeletonStructureRotationAngle: number
}

interface SkeletonLoopStructureBase {
  relativeFoundationDepth: number
  relativeFoundationRadius: number
  foundationPhaseAngle: number
  baseRotationAngle: number
}

interface LoopStructureBase<StructureType extends string> {
  structureType: StructureType
}
