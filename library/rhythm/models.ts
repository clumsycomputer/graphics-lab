export type Rhythm = Array<boolean>

export type RhythmSkeleton = Array<number>

export interface RhythmMap {
  rhythmResolution: number
  rhythmSkeleton: RhythmSkeleton
}

export type RhythmStructure = RootRhythmStructure

export interface RootRhythmStructure
  extends RhythmStructureBase<'rootStructure'>,
    SkeletonRhythmStructureBase {
  structureResolution: number
}

export interface BranchRhythmStructure
  extends RhythmStructureBase<'branchStructure'>,
    ContainerRhythmStructureBase,
    SkeletonRhythmStructureBase {}

export interface LeafRhythmStructure
  extends RhythmStructureBase<'leafStructure'>,
    SkeletonRhythmStructureBase {}

interface ContainerRhythmStructureBase {
  skeletonStructure: BranchRhythmStructure | LeafRhythmStructure
  skeletonStructurePhase: number
}

interface SkeletonRhythmStructureBase {
  boneDensity: number
  bonePhase: number
}

interface RhythmStructureBase<StructureType extends string> {
  structureType: StructureType
}

export interface BasicRhythmStructure
  extends Pick<RootRhythmStructure, 'structureResolution'>,
    Pick<ContainerRhythmStructureBase, 'skeletonStructurePhase'>,
    SkeletonRhythmStructureBase {}
