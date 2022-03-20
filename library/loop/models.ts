import {
  Circle,
  InterposedSpatialStructureBase,
  RecursiveSpatialStructure,
  TerminalSpatialStructureBase,
} from '@library/models'

export interface LoopStructure
  extends RecursiveSpatialStructure<
      InterposedLoopStructure,
      TerminalLoopStructure
    >,
    BaseLoopStructureBase {
  loopBase: Circle
}

export interface InterposedLoopStructure
  extends InterposedSpatialStructureBase<
      InterposedLoopStructure | TerminalLoopStructure
    >,
    BaseLoopStructureBase,
    SubLoopStructureBase {}

export interface TerminalLoopStructure
  extends TerminalSpatialStructureBase,
    SubLoopStructureBase {}

interface BaseLoopStructureBase {
  subLoopRotationAngle: number
}

interface SubLoopStructureBase {
  relativeSubDepth: number
  relativeSubRadius: number
  subPhaseAngle: number
  baseOrientationAngle: number
}
