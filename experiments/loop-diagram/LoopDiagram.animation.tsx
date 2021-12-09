import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import { getNaturalCompositeRhythm } from '@legacy-library/sequenced-space'
import { getLoopPointsData } from '@library/getLoopPointsData'
import { getLoopWaveSample } from '@library/getLoopWaveSample'
import { getLoopWaveSamples } from '@library/getLoopWaveSamples'
import {
  BabyChildLoop,
  ChildLoop,
  Loop,
  ParentChildLoop,
} from '@library/models'
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
      rhythmResolution: 7,
      rhythmPhase: 0,
      rhythmParts: [
        {
          rhythmDensity: 5,
          rhythmPhase: 1,
        },
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
    someRange: [Math.PI / 3, Math.PI / 7],
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
        phaseAngle:
          Math.pow(2, childLoopIndex + 1) * Math.PI * frameStamp +
          childLoopBase.phaseAngle,
        baseRotationAngle:
          baseRotationAngleScalarValues[childLoopIndex]! *
            getLoopWaveSample({
              someLoopPointsData: baseLoopPointsDataA,
              sampleAngle:
                Math.pow(2, childLoopIndex + 1) * Math.PI * frameStamp,
            }) +
          childLoopBase.baseRotationAngle,
      }
    },
  })
  const loopPointsDataA = getLoopPointsData({
    someLoop: loopA,
    sampleCount: 1024,
  })
  const loopWaveSamplesA = getLoopWaveSamples({
    someLoop: loopA,
    sampleCount: 1024,
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

interface GetRangeValuesApi {
  someRange: [number, number]
  someRhythm: Array<boolean>
}

function getRangeValues(api: GetRangeValuesApi) {
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

interface GetUpdatedLoopApi {
  baseLoop: Loop
  getUpdatedChildLoop: <SomeChildLoop extends ChildLoop>(api: {
    baseLoop: Loop
    childLoopBase: SomeChildLoop extends ParentChildLoop
      ? Omit<SomeChildLoop, 'childLoop'>
      : SomeChildLoop extends BabyChildLoop
      ? SomeChildLoop
      : never
    childLoopIndex: number
  }) => SomeChildLoop extends ParentChildLoop
    ? Omit<SomeChildLoop, 'childLoop'>
    : SomeChildLoop extends BabyChildLoop
    ? SomeChildLoop
    : never
}

function getUpdatedLoop(api: GetUpdatedLoopApi): Loop {
  const { baseLoop, getUpdatedChildLoop } = api
  switch (baseLoop.loopType) {
    case 'parentRootLoop':
      const updatedChildLoop = updateChildLoop({
        baseLoop,
        getUpdatedChildLoop,
        scopedLoop: baseLoop.childLoop,
        childLoopIndex: 0,
      })
      return {
        ...baseLoop,
        childLoop: updatedChildLoop,
      }
    case 'soloRootLoop':
      return {
        ...baseLoop,
      }
  }
}

interface UpdateChildLoopApi
  extends Pick<GetUpdatedLoopApi, 'baseLoop' | 'getUpdatedChildLoop'> {
  scopedLoop: ChildLoop
  childLoopIndex: number
}

function updateChildLoop(api: UpdateChildLoopApi): ChildLoop {
  const { scopedLoop, getUpdatedChildLoop, baseLoop, childLoopIndex } = api
  switch (scopedLoop.loopType) {
    case 'parentChildLoop':
      const updatedParentChildLoop = getUpdatedChildLoop({
        baseLoop,
        childLoopIndex,
        childLoopBase: scopedLoop,
      })
      return {
        ...updatedParentChildLoop,
        childLoop: updateChildLoop({
          baseLoop,
          getUpdatedChildLoop,
          scopedLoop: scopedLoop.childLoop,
          childLoopIndex: childLoopIndex + 1,
        }),
      }
    case 'babyChildLoop':
      const updatedBabyChildLoop = getUpdatedChildLoop({
        baseLoop,
        childLoopIndex,
        childLoopBase: scopedLoop,
      })
      return updatedBabyChildLoop
  }
}
