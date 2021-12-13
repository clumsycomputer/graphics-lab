import {
  InterposedSpatialStructureBase,
  RecursiveSpatialStructure,
  TerminalSpatialStructureBase,
} from '@library/general'

export type Rhythm = Array<boolean>

export type RhythmSkeleton = Array<number>

export interface RhythmMap {
  rhythmResolution: number
  rhythmSkeleton: RhythmSkeleton
}

export interface RhythmStructure
  extends RecursiveSpatialStructure<
      InterposedRhythmStructure,
      TerminalRhythmStructure
    >,
    BaseRhythmStructureBase {
  rhythmResolution: number
}

export interface InterposedRhythmStructure
  extends InterposedSpatialStructureBase<
      InterposedRhythmStructure | TerminalRhythmStructure
    >,
    BaseRhythmStructureBase,
    SubRhythmStructureBase {}

export interface TerminalRhythmStructure
  extends TerminalSpatialStructureBase,
    SubRhythmStructureBase {}

interface BaseRhythmStructureBase {
  rhythmPhase: number
}

interface SubRhythmStructureBase {
  rhythmDensity: number
  rhythmOrientation: number
}

export interface BasicRhythmStructure
  extends Pick<RhythmStructure, 'rhythmResolution'>,
    Pick<BaseRhythmStructureBase, 'rhythmPhase'>,
    SubRhythmStructureBase {}
