export type Rhythm = Array<boolean>

export interface RootRhythmSkeleton
  extends RhythmBase<'rootRhythmSkeleton'>,
    ContainerRhythmSkeletonBase {
  containerResolution: number
}

export interface ContainerRhythmSkeleton
  extends RhythmBase<'containerRhythmSkeleton'>,
    RhythmSkeletonBase,
    ContainerRhythmSkeletonBase {}

export interface TerminalRhythmSkeleton
  extends RhythmBase<'terminalRhythmSkeleton'>,
    RhythmSkeletonBase {}

interface ContainerRhythmSkeletonBase {
  containerSkeleton: ContainerRhythmSkeleton | TerminalRhythmSkeleton
  containerPhase: number
}

interface RhythmSkeletonBase {
  skeletonDensity: number
  skeletonPhase: number
}

interface RhythmBase<RhythmType extends string> {
  rhythmType: RhythmType
}
