import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import {
  BasedPoint,
  Circle,
  CompositeLoop,
  getCompositeLoopPoints,
  getLoopWavePoints,
  getMirroredPoint,
  GetMirroredPointApi,
  getSecondaryLoopPoints,
  Point,
} from '@library/geometry'
import { getWaveFrequency } from '@library/miscellaneous'
import {
  DiscreteRhythm,
  getElementIndices,
  getNaturalCompositeRhythm,
} from '@library/sequenced-space'
import React, { Fragment } from 'react'

const loopDiagramAnimationModule: AnimationModule = {
  animationName: 'LoopDiagram',
  frameSize: 2048,
  frameCount: 40 * 1,
  animationSettings: {
    frameRate: 40,
    constantRateFactor: 15,
  },
  FrameDescriptor: LoopDiagramFrame,
}

export default loopDiagramAnimationModule

const colorPalette = [
  '#eb58c3',
  '#58eb7f',
  '#c858eb',
  '#eb587a',
  '#eb7f58',
  '#c3eb58',
]

interface LoopDiagramFrameProps {
  frameCount: number
  frameIndex: number
}

function LoopDiagramFrame(props: LoopDiagramFrameProps) {
  const { frameCount, frameIndex } = props
  const currentBaseCircle: Circle = {
    center: {
      x: 50,
      y: 50,
    },
    radius: 30,
  }
  const currentLoop: CompositeLoop = {
    loopParts: [
      {
        loopType: 'baseCircleRotatedLoop',
        baseCircle: currentBaseCircle,
        childCircle: {
          phaseAngle: 2 * Math.PI * (frameIndex / frameCount) + Math.PI / 2,
          relativeDepth:
            Math.sin(Math.PI * (frameIndex / frameCount)) * 0.5 + 0.00001,
          relativeRadius:
            0.9999 - Math.sin(Math.PI * (frameIndex / frameCount)) * 0.5,
        },
        rotationAngle: 2 * Math.PI * (frameIndex / frameCount),
      },
      // {
      //   loopType: 'baseCircleRotatedLoop',
      //   baseCircle: currentBaseCircle,
      //   childCircle: {
      //     phaseAngle: -2 * Math.PI * (frameIndex / frameCount) + Math.PI / 2,
      //     relativeDepth:
      //       Math.sin(Math.PI * (frameIndex / frameCount)) * 0.5 + 0.00001,
      //     relativeRadius:
      //       0.9999 - Math.sin(Math.PI * (frameIndex / frameCount)) * 0.5,
      //   },
      //   rotationAngle: -2 * Math.PI * (frameIndex / frameCount),
      // },
      {
        loopType: 'baseCircleRotatedLoop',
        baseCircle: currentBaseCircle,
        childCircle: {
          phaseAngle: Math.PI * (frameIndex / frameCount) + Math.PI / 2,
          relativeDepth:
            Math.sin(Math.PI * (frameIndex / frameCount)) * 0.5 + 0.00001,
          relativeRadius:
            0.9999 - Math.sin(Math.PI * (frameIndex / frameCount)) * 0.5,
        },
        rotationAngle: -Math.PI * (frameIndex / frameCount),
      },
      // {
      //   loopType: 'baseCircleRotatedLoop',
      //   baseCircle: currentBaseCircle,
      //   childCircle: {
      //     phaseAngle:
      //       -Math.PI * (frameIndex / frameCount) + Math.PI / 2 + Math.PI / 3,
      //     relativeDepth:
      //       Math.sin(Math.PI * (frameIndex / frameCount)) * 0.5 + 0.00001,
      //     relativeRadius:
      //       0.9999 - Math.sin(Math.PI * (frameIndex / frameCount)) * 0.5,
      //   },
      //   rotationAngle: Math.PI * (frameIndex / frameCount),
      // },
    ],
    rotationAngle: 2 * Math.PI * (frameIndex / frameCount),
  }
  const nestedLayersData = getNestedLayersData({
    nestRhythm: getNaturalCompositeRhythm({
      rhythmResolution: 12,
      rhythmPhase: 0,
      rhythmParts: [
        {
          rhythmDensity: 7,
          rhythmPhase: 3,
        },
      ],
    }),
    nestMirrors: [],
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
    getUnderlayWaveSampleOscillation: ({
      rhythmResolution,
      rhythmIndex,
      sampleAngle,
    }) => 0,
    getOverlayWaveSampleOscillation: ({
      rhythmResolution,
      rhythmIndex,
      baseAngle,
    }) => 0,
    getLayerRadiusScalar: ({ rhythmIndex, rhythmResolution }) =>
      1 - rhythmIndex / rhythmResolution,
  })
  return (
    <svg viewBox={`0 0 100 100`}>
      <rect x={0} y={0} width={100} height={100} fill={'black'} />
      {nestedLayersData.map(([underlayPoints, overlayPoints], layerIndex) => {
        const layerScalar = 1 - layerIndex / nestedLayersData.length / 2
        const cellLength = 0.2
        // layerScalar * 1.75 -
        // 0.5 * Math.sin(Math.PI * (frameIndex / frameCount))
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
              {/* {overlayPoints.map((someOverlayPoints) => (
                <rect
                  x={someOverlayPoints.x - halfCellLength}
                  y={someOverlayPoints.y - halfCellLength}
                  width={cellLength}
                  height={cellLength}
                  fill={'black'}
                />
              ))} */}
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
}

function getNestedLayersData(
  api: GetNestedLayersDataApi
): Array<[Array<Point>, Array<Point>]> {
  const {
    nestRhythm,
    pointsBase,
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
    const underlayPoints = getLoopWavePoints({
      someLoopPoints: pointsBase,
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
