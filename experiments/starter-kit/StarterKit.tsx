import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import {
  BasedPoint,
  Circle,
  CompositeLoop,
  getCompositeLoopPoints,
  getLoopWavePoints,
  getMirroredPoint,
  GetMirroredPointApi,
  Loop,
  Point,
} from '@library/geometry'
import { getWaveFrequency } from '@library/miscellaneous'
import {
  DiscreteRhythm,
  getElementIndices,
  getNaturalCompositeRhythm,
} from '@library/sequenced-space'
import React, { Fragment } from 'react'

const starterKitAnimationModule: AnimationModule = {
  animationName: 'StarterKit',
  frameSize: 2048,
  frameCount: 10 * 4,
  animationSettings: {
    frameRate: 10,
    constantRateFactor: 15,
  },
  FrameDescriptor: StarterKitFrame,
}

export default starterKitAnimationModule

const colorPalette = [
  '#72f5ff',
  '#ff7b72',
  '#72ffc2',
  '#72afff',
  '#7b72ff',
  '#ff72f6',
]

interface StarterKitFrameProps {
  frameCount: number
  frameIndex: number
}

function StarterKitFrame(props: StarterKitFrameProps) {
  const { frameCount, frameIndex } = props
  const frameStamp = frameIndex / frameCount
  const currentBaseCircle: Circle = {
    center: {
      x: 50,
      y: 50,
    },
    radius: 30,
  }
  const loopPartsRhythm = getNaturalCompositeRhythm({
    rhythmResolution: 13,
    rhythmPhase: 0,
    rhythmParts: [
      {
        rhythmDensity: 11,
        rhythmPhase: 1,
      },
      {
        rhythmDensity: 7,
        rhythmPhase: 1,
      },
      {
        rhythmDensity: 5,
        rhythmPhase: 1,
      },
      {
        rhythmDensity: 3,
        rhythmPhase: 0,
      },
    ],
  })
  const loopPartsRhythmIndices = getElementIndices({
    someSpace: loopPartsRhythm,
    targetValue: true,
  })
  const currentLoopParts = loopPartsRhythmIndices.map<Loop>(
    (someRhythmIndex, partIndex) => {
      const rhythmStamp = someRhythmIndex / loopPartsRhythm.length
      const partAlternator = partIndex % 2 === 1 ? 1 : -1
      const minMinDepth = 0.2
      const midDepthRange = 0.075
      const minDepth = midDepthRange * rhythmStamp + minMinDepth
      const depthRange = 0.075
      const maxDepth = minDepth + depthRange
      const midDepth = (minDepth + maxDepth) / 2
      const maxDepthAmplitude = depthRange / 2
      const minMidRadius = 0.7
      const minRadiusRange = 0.075
      const minRadius = (1 - rhythmStamp) * minRadiusRange + minMidRadius
      const radiusRange = 0.075
      const maxRadius = minRadius + radiusRange
      const midRadius = (minRadius + maxRadius) / 2
      const maxRadiusAmplitude = radiusRange / 2
      return {
        loopType: 'baseCircleRotatedLoop',
        baseCircle: currentBaseCircle,
        childCircle: {
          phaseAngle: 2 * Math.PI * rhythmStamp,
          relativeDepth:
            maxDepthAmplitude * Math.sin(Math.PI * frameStamp) + midDepth,
          relativeRadius:
            maxRadiusAmplitude * Math.sin(Math.PI * frameStamp) + midRadius,
        },
        rotationAngle: 2 * Math.PI * frameStamp * partAlternator + Math.PI / 2,
      }
    }
  )
  const currentLoop: CompositeLoop = {
    loopParts: currentLoopParts,
    rotationAngle: 2 * Math.PI * frameStamp,
  }
  const nestedLayersData = getNestedLayersData({
    nestRhythm: getNaturalCompositeRhythm({
      rhythmResolution: 13,
      rhythmPhase: 0,
      rhythmParts: [
        {
          rhythmDensity: 11,
          rhythmPhase: 2,
        },
        {
          rhythmDensity: 7,
          rhythmPhase: 1,
        },
      ],
    }),
    pointsBase: [
      ...getCompositeLoopPoints({
        someCompositeLoop: currentLoop,
        sampleCount: 2048,
      }),
      // ...getSecondaryLoopPoints({
      //   someCompositeLoop: currentLoop,
      //   sampleCount: 2048,
      // }),
    ],
    nestMirrors: [],
    getUnderlayWaveSampleOscillation: ({
      rhythmResolution,
      rhythmIndex,
      sampleAngle,
      layerIndex,
    }) => {
      const rhythmStamp = 1 - rhythmIndex / rhythmResolution
      const minAmplitude = 0.5
      const maxAmplitude = 5
      const amplitudeRange = maxAmplitude - minAmplitude
      const amplitudeScalar = rhythmStamp * amplitudeRange + minAmplitude
      const underlayFrequency = getWaveFrequency({
        baseFrequency: 220,
        scaleResolution: rhythmResolution,
        frequencyIndex: rhythmIndex,
      })
      const layerAlternator = layerIndex % 2 === 0 ? 1 : -1
      return (
        (amplitudeScalar * Math.sin(Math.PI * frameStamp) + minAmplitude) *
        Math.sin(
          underlayFrequency * sampleAngle +
            2 * Math.PI * frameStamp * layerAlternator
        )
      )
    },
    getOverlayWaveSampleOscillation: ({
      rhythmResolution,
      rhythmIndex,
      baseAngle,
      layerIndex,
    }) => {
      const rhythmStamp = 1 - rhythmIndex / rhythmResolution
      const minAmplitude = 0.5
      const maxAmplitude = 5
      const amplitudeRange = maxAmplitude - minAmplitude
      const amplitudeScalar = rhythmStamp * amplitudeRange + minAmplitude
      const overlayFrequency = getWaveFrequency({
        baseFrequency: 220,
        scaleResolution: rhythmResolution,
        frequencyIndex: rhythmIndex,
      })
      const layerAlternator = layerIndex % 2 === 0 ? 1 : -1
      return (
        (amplitudeScalar * Math.sin(Math.PI * frameStamp) + minAmplitude) *
        Math.sin(
          overlayFrequency * baseAngle +
            2 * Math.PI * frameStamp * layerAlternator
        )
      )
    },
    getLayerRadiusScalar: ({ rhythmIndex, rhythmResolution }) =>
      1 - rhythmIndex / rhythmResolution,
    getLayerShiftPoint: () => ({
      x: 0,
      y: 0,
    }),
  })
  return (
    <svg viewBox={`0 0 100 100`}>
      <rect x={0} y={0} width={100} height={100} fill={'black'} />
      {nestedLayersData.map(([underlayPoints, overlayPoints], layerIndex) => {
        const cellLength =
          1 -
          1 * Math.sin((Math.PI / 4) * (layerIndex / nestedLayersData.length))
        const halfCellLength = cellLength / 2
        return (
          <Fragment>
            <mask id={`${layerIndex}`}>
              {underlayPoints.map((someUnderlayPoint) => (
                <rect
                  x={someUnderlayPoint.x - halfCellLength}
                  y={someUnderlayPoint.y - halfCellLength}
                  width={cellLength}
                  height={cellLength}
                  fill={'white'}
                />
              ))}
              {overlayPoints.map((someOverlayPoints) => (
                <rect
                  x={someOverlayPoints.x - halfCellLength}
                  y={someOverlayPoints.y - halfCellLength}
                  width={cellLength}
                  height={cellLength}
                  fill={'black'}
                />
              ))}
            </mask>
            <rect
              mask={`url(#${layerIndex})`}
              x={0}
              y={0}
              width={100}
              height={100}
              fill={
                colorPalette[
                  layerIndex === 0
                    ? 0
                    : layerIndex === 1
                    ? 4
                    : layerIndex === 2
                    ? 1
                    : layerIndex === 3
                    ? 5
                    : layerIndex === 4
                    ? 0
                    : layerIndex === 5
                    ? 1
                    : layerIndex === 6
                    ? 2
                    : -1
                ]
              }
            />
          </Fragment>
        )
      })}
    </svg>
  )
}

interface GetNestedLayersDataApi {
  nestRhythm: DiscreteRhythm
  nestMirrors: Array<Pick<GetMirroredPointApi, 'originPoint' | 'mirrorAngle'>>
  pointsBase: Array<BasedPoint>
  getUnderlayWaveSampleOscillation: (api: {
    sampleAngle: number
    baseAngle: number
    layerIndex: number
    rhythmResolution: number
    rhythmIndex: number
  }) => number
  getOverlayWaveSampleOscillation: (api: {
    sampleAngle: number
    baseAngle: number
    layerIndex: number
    rhythmResolution: number
    rhythmIndex: number
  }) => number
  getLayerRadiusScalar: (api: {
    layerIndex: number
    rhythmResolution: number
    rhythmIndex: number
  }) => number
  getLayerShiftPoint: (api: {
    layerIndex: number
    rhythmResolution: number
    rhythmIndex: number
  }) => Point
}

function getNestedLayersData(
  api: GetNestedLayersDataApi
): Array<[Array<Point>, Array<Point>]> {
  const {
    nestRhythm,
    pointsBase,
    getLayerShiftPoint,
    getUnderlayWaveSampleOscillation,
    getLayerRadiusScalar,
    getOverlayWaveSampleOscillation,
    nestMirrors,
  } = api
  const rhythmResolution = nestRhythm.length
  const nestRhythmIndices = getElementIndices({
    someSpace: nestRhythm,
    targetValue: true,
  })
  return nestRhythmIndices.map((rhythmIndex, layerIndex) => {
    const layerShiftPoint = getLayerShiftPoint({
      layerIndex,
      rhythmIndex,
      rhythmResolution,
    })
    const underlayPoints = getLoopWavePoints({
      someLoopPoints: pointsBase,
      loopShiftPoint: layerShiftPoint,
      baseRadiusScalar: getLayerRadiusScalar({
        rhythmResolution,
        rhythmIndex,
        layerIndex,
      }),
      getWaveSampleOscillation: ({ sampleAngle, baseAngle }) =>
        getUnderlayWaveSampleOscillation({
          rhythmResolution,
          rhythmIndex,
          layerIndex,
          sampleAngle,
          baseAngle,
        }),
    })
    const overlayPoints = getLoopWavePoints({
      someLoopPoints: pointsBase,
      loopShiftPoint: layerShiftPoint,
      baseRadiusScalar: getLayerRadiusScalar({
        rhythmResolution,
        rhythmIndex,
        layerIndex,
      }),
      getWaveSampleOscillation: ({ sampleAngle, baseAngle }) =>
        getOverlayWaveSampleOscillation({
          rhythmResolution,
          rhythmIndex,
          layerIndex,
          sampleAngle,
          baseAngle,
        }),
    })
    let mirroredUnderlayPoints: Array<Point> = []
    let mirroredOverlayPoints: Array<Point> = []
    for (
      let mirrorPointIndex = 0;
      mirrorPointIndex < pointsBase.length;
      mirrorPointIndex++
    ) {
      for (
        let mirrorIndex = 0;
        mirrorIndex < nestMirrors.length;
        mirrorIndex++
      ) {
        const someNestMirror = nestMirrors[mirrorIndex]!
        mirroredUnderlayPoints.push(
          getMirroredPoint({
            mirrorAngle: someNestMirror.mirrorAngle,
            originPoint: someNestMirror.originPoint,
            basePoint: underlayPoints[mirrorPointIndex]!,
          })
        )
        mirroredOverlayPoints.push(
          getMirroredPoint({
            mirrorAngle: someNestMirror.mirrorAngle,
            originPoint: someNestMirror.originPoint,
            basePoint: overlayPoints[mirrorPointIndex]!,
          })
        )
      }
    }
    return [
      [...underlayPoints, ...mirroredUnderlayPoints],
      [...overlayPoints, ...mirroredOverlayPoints],
    ]
  })
}
