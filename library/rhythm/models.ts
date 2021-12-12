export type Rhythm = Array<boolean>

export type RhythmSkeleton = Array<number>

export interface RhythmMap {
  rhythmResolution: number
  rhythmSkeleton: RhythmSkeleton
}

export type RhythmStructure = RootContainerLayer

export interface RootContainerLayer
  extends RhythmStructureBase<'rootStructure'>,
    SkeletonContainerBase {
  containerResolution: number
}

export interface ContainerSkeletonLayer
  extends RhythmStructureBase<'branchStructure'>,
    SkeletonContainerBase,
    SkeletonStructureBase {}

export interface TerminalSkeletonLayer
  extends RhythmStructureBase<'leafStructure'>,
    SkeletonStructureBase {}

interface SkeletonContainerBase {
  containerPhase: number
  layerStructure: ContainerSkeletonLayer | TerminalSkeletonLayer
}

interface SkeletonStructureBase {
  skeletonDensity: number
  skeletonPhase: number
}

interface RhythmStructureBase<StructureType extends string> {
  structureType: StructureType
}

export interface BasicRhythmStructure
  extends Pick<RootContainerLayer, 'containerResolution'>,
    Pick<SkeletonContainerBase, 'containerPhase'>,
    SkeletonStructureBase {}
