import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import {
  getHarmonicLoopWaveSampleData,
  getLoopPointsData,
  getLoopWaveSampleData,
  getLoopWaveSamples,
  getNormalizedAngle,
  getUpdatedLoop,
  Loop,
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
        structureType: 'rootStructure',
        containerResolution: 5,
        containerPhase: 0,
        layerStructure: {
          structureType: 'leafStructure',
          skeletonDensity: 3,
          skeletonPhase: 0,
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
        structureType: 'rootStructure',
        containerResolution: 7,
        containerPhase: 0,
        layerStructure: {
          structureType: 'leafStructure',
          skeletonDensity: 3,
          skeletonPhase: 0,
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
        structureType: 'rootStructure',
        containerResolution: 11,
        containerPhase: 0,
        layerStructure: {
          structureType: 'leafStructure',
          skeletonDensity: 3,
          skeletonPhase: 0,
        },
      },
    }),
  })
  const baseLoopA: Loop = {
    loopType: 'parentRootLoop',
    childRotationAngle: 0,
    baseCircle: {
      center: { x: 0, y: 0 },
      radius: 1,
    },
    childLoop: {
      loopType: 'parentChildLoop',
      relativeDepth: 0.1,
      relativeRadius: 0.875,
      phaseAngle: phaseAngleBaseValues[0]!,
      baseRotationAngle: baseRotationAngleBaseValues[0]!,
      childRotationAngle: 0,
      childLoop: {
        loopType: 'parentChildLoop',
        relativeDepth: 0.15,
        relativeRadius: 0.9,
        phaseAngle: phaseAngleBaseValues[1]!,
        baseRotationAngle: baseRotationAngleBaseValues[1]!,
        childRotationAngle: 0,
        childLoop: {
          loopType: 'babyChildLoop',
          relativeDepth: 0.2,
          relativeRadius: 0.95,
          phaseAngle: phaseAngleBaseValues[2]!,
          baseRotationAngle: baseRotationAngleBaseValues[2]!,
        },
      },
    },
  }
  const baseLoopPointsDataA = getLoopPointsData({
    someLoop: baseLoopA,
    sampleCount: 1024,
  })
  const loopA = getUpdatedLoop({
    baseLoop: baseLoopA,
    getUpdatedChildLoop: ({ childLoopBase, childLoopIndex }) => {
      return {
        ...childLoopBase,
        phaseAngle: getNormalizedAngle({
          someAngle:
            Math.pow(2, childLoopIndex + 1) * Math.PI * frameStamp +
            childLoopBase.phaseAngle,
        }),
        baseRotationAngle:
          baseRotationAngleScalarValues[childLoopIndex]! *
            getHarmonicLoopWaveSampleData({
              someLoopPointsData: baseLoopPointsDataA,
              harmonicDistribution: [
                1,
                0.2 *
                  getLoopWaveSampleData({
                    someLoopPointsData: baseLoopPointsDataA,
                    traceAngle: 2 * Math.PI * frameStamp,
                    startingTracePointIndex: 0,
                  })[0] +
                  0.4,
              ],
              startingTracePointIndices: [0, 0],
              traceAngle: getNormalizedAngle({
                someAngle:
                  Math.pow(2, childLoopIndex + 1) * Math.PI * frameStamp,
              }),
            })[0] +
          childLoopBase.baseRotationAngle,
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

interface LoopDisplayProps {
  someLoop: Loop
  targetRectangle: Rectangle
}

interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}

function LoopDisplay(props: LoopDisplayProps) {
  const { someLoop } = props
  return null
}
