import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import {
  getHarmonicLoopWaveSampleData,
  getLoopPointsData,
  getLoopWaveSampleData,
  getLoopWaveSamples,
  getNormalizedAngle,
  getUpdatedLoopStructure,
  InterposedLoopStructure,
  LoopStructure,
  TerminalLoopStructure,
} from '@library/geometry'
import { getRangedRhythmValues, getStructuredRhythmMap } from '@library/rhythm'
import React from 'react'

const loopDiagramAnimationModule: AnimationModule = {
  animationName: 'LoopDiagram',
  frameSize: 2048,
  frameCount: 10 * 10,
  animationSettings: {
    frameRate: 10,
    constantRateFactor: 15,
  },
  FrameDescriptor: LoopDiagramFrame,
}

export default loopDiagramAnimationModule

interface LoopDiagramFrameProps {
  frameCount: number
  frameIndex: number
}

function LoopDiagramFrame(props: LoopDiagramFrameProps) {
  const { frameIndex, frameCount } = props
  const frameStamp = frameIndex / frameCount
  const phaseAngleBaseValues = getRangedRhythmValues({
    someNumberRange: {
      startValue: 0,
      targetValue: Math.PI / 2,
    },
    someRhythmMap: getStructuredRhythmMap({
      someRhythmStructure: {
        structureType: 'initialStructure',
        rhythmResolution: 5,
        rhythmPhase: 0,
        subStructure: {
          structureType: 'terminalStructure',
          rhythmDensity: 3,
          rhythmOrientation: 0,
        },
      },
    }),
  })
  const baseRotationAngleBaseValues = getRangedRhythmValues({
    someNumberRange: {
      startValue: Math.PI / 2,
      targetValue: 0,
    },
    someRhythmMap: getStructuredRhythmMap({
      someRhythmStructure: {
        structureType: 'initialStructure',
        rhythmResolution: 7,
        rhythmPhase: 0,
        subStructure: {
          structureType: 'terminalStructure',
          rhythmDensity: 3,
          rhythmOrientation: 0,
        },
      },
    }),
  })
  const baseRotationAngleScalarValues = getRangedRhythmValues({
    someNumberRange: {
      startValue: Math.PI / 4,
      targetValue: Math.PI / 11,
    },
    someRhythmMap: getStructuredRhythmMap({
      someRhythmStructure: {
        structureType: 'initialStructure',
        rhythmResolution: 11,
        rhythmPhase: 0,
        subStructure: {
          structureType: 'terminalStructure',
          rhythmDensity: 3,
          rhythmOrientation: 0,
        },
      },
    }),
  })
  const baseLoopStructureA: LoopStructure = {
    structureType: 'initialStructure',
    loopBase: {
      center: { x: 0, y: 0 },
      radius: 1,
    },
    subLoopRotationAngle: 0,
    subStructure: {
      structureType: 'interposedStructure',
      relativeFoundationDepth: 0.1,
      relativeFoundationRadius: 0.875,
      foundationPhaseAngle: phaseAngleBaseValues[0]!,
      baseOrientationAngle: baseRotationAngleBaseValues[0]!,
      subLoopRotationAngle: 0,
      subStructure: {
        structureType: 'interposedStructure',
        relativeFoundationDepth: 0.15,
        relativeFoundationRadius: 0.9,
        foundationPhaseAngle: phaseAngleBaseValues[1]!,
        baseOrientationAngle: baseRotationAngleBaseValues[1]!,
        subLoopRotationAngle: 0,
        subStructure: {
          structureType: 'terminalStructure',
          relativeFoundationDepth: 0.2,
          relativeFoundationRadius: 0.95,
          foundationPhaseAngle: phaseAngleBaseValues[2]!,
          baseOrientationAngle: baseRotationAngleBaseValues[2]!,
        },
      },
    },
  }
  const baseLoopPointsDataA = getLoopPointsData({
    someLoopStructure: baseLoopA,
    sampleCount: 1024,
  })
  const loopA = getUpdatedLoopStructure({
    baseStructure: baseLoopStructureA,
    getScopedStructureUpdates: ({ scopedStructureBase }) => {
      switch (scopedStructureBase.structureType) {
        case 'initialStructure':
          return {
            loopBase: scopedStructureBase.loopBase,
            subLoopRotationAngle: scopedStructureBase.subLoopRotationAngle,
          } // as Omit<LoopStructure, 'structureType'>
        case 'interposedStructure':
          return {
            subLoopRotationAngle: scopedStructureBase.subLoopRotationAngle,
            foundationPhaseAngle: 0,
            relativeFoundationDepth: 0,
            relativeFoundationRadius: 0,
            baseOrientationAngle: 0,
          } // as Omit<InterposedLoopStructure, 'subStructure' | 'structureType'>
        case 'terminalStructure':
          return {
            foundationPhaseAngle: 0,
            relativeFoundationDepth: 0,
            relativeFoundationRadius: 0,
            baseOrientationAngle: 0,
          } // as Omit<TerminalLoopStructure, 'structureType'>
      }
    },
  })
  const loopPointsDataA = getLoopPointsData({
    someLoop: loopA,
    sampleCount: 1024,
  })
  const loopWaveSamplesA = getLoopWaveSamples({
    someLoopPointsData: loopPointsDataA,
    sampleCount: 1024,
  })
  // const rhythmStructureA: RhythmStructure = {
  //   layerType: 'rootContainer',
  //   containerResolution: 12,
  //   containerPhase: 0,
  //   layerSkeleton: {
  //     layerType: 'containerSkeleton',
  //     containerPhase: 0,
  //     skeletonDensity: 7,
  //     skeletonPhase: 0,
  //     layerSkeleton: {
  //       layerType: 'terminalSkeleton',
  //       skeletonDensity: 3,
  //       skeletonPhase: 0,
  //     },
  //   },
  // }
  // const skeletonBonesTableA = getRhythmSkeletonBonesTable({
  //   someRhythmStructure: rhythmStructureA,
  // })
  return (
    <svg viewBox={`0 0 100 100`}>
      <rect x={0} y={0} width={100} height={100} fill={'black'} />
      {/* {skeletonBonesTableA
        .map(([someSkeletonLayerRootBones], skeletonLayerIndex) => {
          return someSkeletonLayerRootBones.map((someRootBone) => (
            <circle
              cx={
                100 * (someRootBone / rhythmStructureA.containerResolution) +
                100 / rhythmStructureA.containerResolution / 2
              }
              cy={50}
              r={
                (100 / rhythmStructureA.containerResolution / 2) *
                ((skeletonLayerIndex + 1) / skeletonBonesTableA.length)
              }
              fillOpacity={0}
              strokeWidth={0.2}
              stroke={'white'}
            />
          ))
        })
        .flat()} */}
      <g transform={`translate(50, 25) scale(20, 20)`}>
        {loopPointsDataA.samplePoints.map((somePoint) => (
          <circle cx={somePoint.x} cy={somePoint.y} r={0.015} fill={'orange'} />
        ))}
      </g>
      {loopWaveSamplesA.map((someWaveSample, sampleIndex) => (
        <circle
          cx={2 * (sampleIndex / loopWaveSamplesA.length)}
          cy={someWaveSample}
          r={0.015}
          fill={'orange'}
          transform={`translate(30, 75) scale(20, 20)`}
        />
      ))}
    </svg>
  )
}

// interface LoopDisplayProps {
//   someLoop: Loop
//   targetRectangle: Rectangle
// }

// interface Rectangle {
//   x: number
//   y: number
//   width: number
//   height: number
// }

// function LoopDisplay(props: LoopDisplayProps) {
//   const { someLoop } = props
//   return null
// }
