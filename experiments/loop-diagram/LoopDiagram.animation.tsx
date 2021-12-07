import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import { DistributiveOmit } from '@legacy-library/miscellaneous/models'
import {
  getElementIndices,
  getNaturalCompositeRhythm,
} from '@legacy-library/sequenced-space'
import { getLoopPoint } from '@library/getLoopPoint'
import { getLoopPointsData } from '@library/getLoopPointsData'
import {
  ChildLoop,
  FinalChildLoop,
  Loop,
  MiddleChildLoop,
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
  const loopA = getFooLoop({
    frameStamp,
    relativeDepthBaseRange: [0.1, 0.3],
    relativeRadiusBaseRange: [0.9, 0.7],
    phaseAngleBaseRange: [Math.PI / 3, Math.PI / 9],
    baseRotationAngleBaseRange: [Math.PI / 9, Math.PI / 3],
    baseRotationScalarRange: [Math.PI / 3, Math.PI / 9],
    loopStructureRhythm: getNaturalCompositeRhythm({
      rhythmResolution: 11,
      rhythmPhase: 1,
      rhythmParts: [
        {
          rhythmDensity: 3,
          rhythmPhase: 0,
        },
      ],
    }),
  })
  const loopPointsDataA = getLoopPointsData({
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
      {loopPointsDataA.samplePoints.map((someWaveSample, sampleIndex) => (
        <circle
          cx={2 * (sampleIndex / loopPointsDataA.samplePoints.length)}
          cy={someWaveSample.y}
          r={0.015}
          fill={'orange'}
          transform={`translate(30, 75) scale(20, 20)`}
        />
      ))}
    </svg>
  )
}

interface GetLoopWaveSampleApi {
  someLoop: Loop
  sampleAngle: number
}

function getLoopWaveSample(api: GetLoopWaveSampleApi) {
  const { someLoop, sampleAngle } = api
  return getLoopPoint({
    someLoop,
    pointAngle: sampleAngle,
  }).y
}

interface GetFooLoopApi {
  frameStamp: number
  loopStructureRhythm: Array<boolean>
  phaseAngleBaseRange: [number, number]
  baseRotationAngleBaseRange: [number, number]
  relativeDepthBaseRange: [number, number]
  relativeRadiusBaseRange: [number, number]
  baseRotationScalarRange: [number, number]
}

function getFooLoop(api: GetFooLoopApi): Loop {
  const {
    loopStructureRhythm,
    phaseAngleBaseRange,
    baseRotationAngleBaseRange,
    relativeDepthBaseRange,
    relativeRadiusBaseRange,
    baseRotationScalarRange,
    frameStamp,
  } = api
  const loopStructureRhythmAnchors = getElementIndices({
    someSpace: loopStructureRhythm,
    targetValue: true,
  })
  const phaseAngleBaseRangeLength =
    phaseAngleBaseRange[1] - phaseAngleBaseRange[0]
  const baseRotationAngleBaseRangeLength =
    baseRotationAngleBaseRange[1] - baseRotationAngleBaseRange[0]
  const relativeDepthBaseRangeLength =
    relativeDepthBaseRange[1] - relativeDepthBaseRange[0]
  const relativeRadiusBaseRangeLength =
    relativeRadiusBaseRange[1] - relativeRadiusBaseRange[0]
  const baseRotationScalarRangeLength =
    baseRotationScalarRange[1] - baseRotationScalarRange[0]
  const childLoopsBaseData = loopStructureRhythmAnchors.reduce<
    Array<{
      phaseAngleBase: number
      baseRotationAngleBase: number
      relativeDepthBase: number
      relativeRadiusBase: number
      baseRotationScalar: number
    }>
  >((result, someLoopStructureAnchor) => {
    const loopStructureRhythmStamp =
      someLoopStructureAnchor / loopStructureRhythm.length
    return [
      ...result,
      {
        phaseAngleBase:
          loopStructureRhythmStamp * phaseAngleBaseRangeLength +
          phaseAngleBaseRange[0],
        baseRotationAngleBase:
          loopStructureRhythmStamp * baseRotationAngleBaseRangeLength +
          baseRotationAngleBaseRange[0],
        relativeDepthBase:
          loopStructureRhythmStamp * relativeDepthBaseRangeLength +
          relativeDepthBaseRange[0],
        relativeRadiusBase:
          loopStructureRhythmStamp * relativeRadiusBaseRangeLength +
          relativeRadiusBaseRange[0],
        baseRotationScalar:
          loopStructureRhythmStamp * baseRotationScalarRangeLength +
          baseRotationScalarRange[0],
      },
    ]
  }, [])
  const fooLoopBase: Loop = {
    baseCircle: {
      center: {
        x: 0,
        y: 0,
      },
      radius: 1,
    },
    childRotationAngle: 0,
    childLoop: childLoopsBaseData
      .reduce<Array<Omit<MiddleChildLoop, 'childLoop'> | FinalChildLoop>>(
        (result, someChildLoopBaseData, childLoopIndex) => {
          const nextChildLoop:
            | Omit<MiddleChildLoop, 'childLoop'>
            | FinalChildLoop =
            childLoopIndex === childLoopsBaseData.length - 1
              ? {
                  phaseAngle: someChildLoopBaseData.phaseAngleBase,
                  relativeDepth: someChildLoopBaseData.relativeDepthBase,
                  relativeRadius: someChildLoopBaseData.relativeRadiusBase,
                  baseRotationAngle:
                    someChildLoopBaseData.baseRotationAngleBase,
                  childLoopType: 'finalChildLoop',
                }
              : {
                  phaseAngle: someChildLoopBaseData.phaseAngleBase,
                  relativeDepth: someChildLoopBaseData.relativeDepthBase,
                  relativeRadius: someChildLoopBaseData.relativeRadiusBase,
                  baseRotationAngle:
                    someChildLoopBaseData.baseRotationAngleBase,
                  childLoopType: 'middleChildLoop',
                  childRotationAngle: 0,
                }
          return [nextChildLoop, ...result]
        },
        []
      )
      .reduce<ChildLoop | null>((result, somePartialChildLoop) => {
        return {
          ...somePartialChildLoop,
          childLoop: result,
        } as ChildLoop
      }, null)!,
  }
  return {
    baseCircle: {
      center: {
        x: 0,
        y: 0,
      },
      radius: 1,
    },
    childRotationAngle: 0,
    childLoop: childLoopsBaseData
      .reduce<Array<Omit<MiddleChildLoop, 'childLoop'> | FinalChildLoop>>(
        (result, someChildLoopBaseData, childLoopIndex) => {
          const childLoopHarmonicScalar = Math.pow(2, childLoopIndex + 1)
          const nextChildLoop:
            | Omit<MiddleChildLoop, 'childLoop'>
            | FinalChildLoop =
            childLoopIndex === childLoopsBaseData.length - 1
              ? {
                  phaseAngle:
                    childLoopHarmonicScalar * Math.PI * frameStamp +
                    someChildLoopBaseData.phaseAngleBase,
                  relativeDepth: someChildLoopBaseData.relativeDepthBase,
                  relativeRadius: someChildLoopBaseData.relativeRadiusBase,
                  baseRotationAngle:
                    someChildLoopBaseData.baseRotationScalar *
                      getLoopWaveSample({
                        someLoop: fooLoopBase,
                        sampleAngle:
                          childLoopHarmonicScalar * Math.PI * frameStamp,
                      }) +
                    someChildLoopBaseData.baseRotationAngleBase,
                  childLoopType: 'finalChildLoop',
                }
              : {
                  phaseAngle:
                    childLoopHarmonicScalar * Math.PI * frameStamp +
                    someChildLoopBaseData.phaseAngleBase,
                  relativeDepth: someChildLoopBaseData.relativeDepthBase,
                  relativeRadius: someChildLoopBaseData.relativeRadiusBase,
                  baseRotationAngle:
                    someChildLoopBaseData.baseRotationScalar *
                      getLoopWaveSample({
                        someLoop: fooLoopBase,
                        sampleAngle:
                          childLoopHarmonicScalar * Math.PI * frameStamp,
                      }) +
                    someChildLoopBaseData.baseRotationAngleBase,
                  childLoopType: 'middleChildLoop',
                  childRotationAngle: 0,
                }
          return [nextChildLoop, ...result]
        },
        []
      )
      .reduce<ChildLoop | null>((result, somePartialChildLoop) => {
        return {
          ...somePartialChildLoop,
          childLoop: result,
        } as ChildLoop
      }, null)!,
  }
}
