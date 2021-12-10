import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import { getNaturalCompositeRhythm } from '@legacy-library/sequenced-space'
import {
  getHarmonicLoopWaveSampleData,
  getHarmonicLoopWaveSamples,
  getLoopPointsData,
  getLoopWaveSampleData,
  getNormalizedAngle,
  getUpdatedLoop,
  Loop,
} from '@library/geometry'
import { RhythmSkeleton } from '@library/rhythm/models'
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
  const phaseAngleBaseValues = getRangeValues({
    someRange: [0, Math.PI / 2],
    someRhythm: getNaturalCompositeRhythm({
      rhythmResolution: 5,
      rhythmPhase: 0,
      rhythmParts: [
        {
          rhythmDensity: 3,
          rhythmPhase: 0,
        },
      ],
    }),
  })
  const baseRotationAngleBaseValues = getRangeValues({
    someRange: [Math.PI / 2, 0],
    someRhythm: getNaturalCompositeRhythm({
      rhythmResolution: 7,
      rhythmPhase: 0,
      rhythmParts: [
        {
          rhythmDensity: 3,
          rhythmPhase: 0,
        },
      ],
    }),
  })
  const baseRotationAngleScalarValues = getRangeValues({
    someRange: [Math.PI / 4, Math.PI / 11],
    someRhythm: getNaturalCompositeRhythm({
      rhythmResolution: 11,
      rhythmPhase: 0,
      rhythmParts: [
        {
          rhythmDensity: 3,
          rhythmPhase: 0,
        },
      ],
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
  const loopWaveSamplesA = getHarmonicLoopWaveSamples({
    someLoopPointsData: loopPointsDataA,
    sampleCount: 1024,
    harmonicDistribution: [
      1,
      0.2 *
        getLoopWaveSampleData({
          someLoopPointsData: loopPointsDataA,
          traceAngle: 2 * Math.PI * frameStamp,
          startingTracePointIndex: 0,
        })[0] +
        0.4,
    ],
  })
  return (
    <svg viewBox={`0 0 100 100`}>
      <rect x={0} y={0} width={100} height={100} fill={'black'} />
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

export interface GetRangeValuesApi {
  someRange: [startValue: number, targetValue: number]
  someRhythm: Array<boolean>
}

export function getRangeValues(api: GetRangeValuesApi) {
  const { someRange, someRhythm } = api
  const rangeLength = someRange[1] - someRange[0]
  return someRhythm.reduce<Array<number>>((result, someCell, cellIndex) => {
    if (someCell === true) {
      const cellStamp = cellIndex / someRhythm.length
      result.push(rangeLength * cellStamp)
    }
    return result
  }, [])
}
