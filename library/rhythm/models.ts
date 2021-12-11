export type Rhythm = Array<boolean>

export type RhythmStructure = RootContainerLayer

export interface RootContainerLayer
  extends RhythmLayerBase<'rootContainer'>,
    SkeletonContainerBase {
  containerResolution: number
}

export interface ContainerSkeletonLayer
  extends RhythmLayerBase<'containerSkeleton'>,
    SkeletonContainerBase,
    SkeletonBase {}

export interface TerminalSkeletonLayer
  extends RhythmLayerBase<'terminalSkeleton'>,
    SkeletonBase {}

interface SkeletonContainerBase {
  containerPhase: number
  layerSkeleton: ContainerSkeletonLayer | TerminalSkeletonLayer
}

interface SkeletonBase {
  skeletonDensity: number
  skeletonPhase: number
}

interface RhythmLayerBase<LayerType extends string> {
  layerType: LayerType
}
