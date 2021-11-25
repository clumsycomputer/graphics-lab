import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import {
  BasedPoint,
  Circle,
  CompositeLoop,
  getCompositeLoopCircles,
  getCompositeLoopPoints,
  getDistanceBetweenPoints,
  getLoopBaseCirclePointBase,
  getMirroredPoint,
  getNormalizedAngleBetweenPoints,
  getTracePoint,
  Point,
} from '@library/geometry'
import {
  DiscreteRhythm,
  getElementIndices,
  getNaturalCompositeRhythm,
} from '@library/sequenced-space'
import React, { Fragment } from 'react'
import { getWaveFrequency } from './helpers'

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
  const currentLoopPoints = getCompositeLoopPoints({
    someCompositeLoop: currentLoop,
    sampleCount: 2048,
  })
  // const currentSecondaryLoopPoints = getSecondaryLoopPoints({
  //   someCompositeLoop: currentLoop,
  //   sampleCount: 2048,
  // })
  const nestRhythm = getNaturalCompositeRhythm({
    rhythmResolution: frameCount,
    rhythmPhase: 0,
    rhythmParts: [
      {
        rhythmDensity: 17,
        rhythmPhase: 1,
      },
      {
        rhythmDensity: 13,
        rhythmPhase: 1,
      },
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
        rhythmDensity: 4,
        rhythmPhase: 0,
      },
    ],
  })
  const nestRhythmAnchors = getElementIndices({
    someSpace: nestRhythm,
    targetValue: true,
  })
  const layersPointsData = nestRhythmAnchors.map<[Array<Point>, Array<Point>]>(
    (nestAnchor, layerIndex) => {
      const getBaseLayerCellOscillation = (sampleAngle: number) =>
        (10 - 3 * Math.sin(Math.PI * (frameIndex / frameCount))) *
        Math.sin(
          (startFrequency +
            (targetFrequency - startFrequency) * (frameIndex / frameCount)) *
            sampleAngle +
            2 * Math.PI * (frameIndex / frameCount) +
            Math.PI / 2
        )
      const getOverlayLayerCellOscillation = (
        sampleAngle: number,
        baseAngle: number
      ) =>
        (10 - 3 * Math.sin(Math.PI * (frameIndex / frameCount))) *
        Math.sin(
          (startFrequency +
            (targetFrequency - startFrequency) * (frameIndex / frameCount)) *
            baseAngle +
            2 * Math.PI * (frameIndex / frameCount) +
            Math.PI / 2
        )
      const layerRadiusScalar = 1 - nestAnchor / nestRhythm.length
      const startFrequency = getWaveFrequency({
        baseFrequency: 220,
        scaleResolution: nestRhythm.length,
        frequencyIndex: nestAnchor,
      })
      const targetFrequency = getWaveFrequency({
        baseFrequency: 220,
        scaleResolution: nestRhythm.length,
        frequencyIndex: nestAnchor + nestRhythm.length,
      })
      const layerBaseLoopPoints = getLoopWavePoints({
        someLoopPoints: currentLoopPoints,
        getWaveSampleOscillation: getBaseLayerCellOscillation,
        getPointRadiusScalar: () => layerRadiusScalar,
      })
      // const layerBaseSecondaryLoopPoints = getLoopCellsPoints({
      //   someLoopPoints: currentSecondaryLoopPoints,
      //   getCellOscillation: getBaseLayerCellOscillation,
      //   getCellRadiusScalar: () => layerRadiusScalar,
      // })
      // const layerBaseMirroredPoints = [
      //   ...layerBaseLoopPoints,
      //   // ...layerBaseSecondaryLoopPoints,
      // ].map((somePoint) => {
      //   const mirroredPoint = getMirroredPoint({
      //     basePoint: somePoint,
      //     originPoint: currentBaseCircle.center,
      //     mirrorAngle: Math.PI / 2,
      //   })
      //   return {
      //     ...somePoint,
      //     ...mirroredPoint,
      //   }
      // })
      const layerOverlayLoopPoints = getLoopWavePoints({
        someLoopPoints: currentLoopPoints,
        getWaveSampleOscillation: getOverlayLayerCellOscillation,
        getPointRadiusScalar: () => layerRadiusScalar,
      })
      // const layerOverlaySecondaryLoopPoints = getLoopCellsPoints({
      //   someLoopPoints: currentSecondaryLoopPoints,
      //   getCellOscillation: getOverlayLayerCellOscillation,
      //   getCellRadiusScalar: () => layerRadiusScalar,
      // })
      // const layerOverlayMirroredPoints = [
      //   ...layerOverlayLoopPoints,
      //   // ...layerOverlaySecondaryLoopPoints,
      // ].map((somePoint) => {
      //   const mirroredPoint = getMirroredPoint({
      //     basePoint: somePoint,
      //     originPoint: currentBaseCircle.center,
      //     mirrorAngle: Math.PI / 2,
      //   })
      //   return {
      //     ...somePoint,
      //     ...mirroredPoint,
      //   }
      // })
      return [
        [
          ...layerBaseLoopPoints,
          // ...layerBaseSecondaryLoopPoints,
          // ...layerBaseMirroredPoints,
        ],
        [
          ...layerOverlayLoopPoints,
          // ...layerOverlaySecondaryLoopPoints,
          // ...layerOverlayMirroredPoints,
        ],
      ]
    }
  )
  return (
    <svg viewBox={`0 0 100 100`}>
      <rect x={0} y={0} width={100} height={100} fill={'black'} />
      {layersPointsData.map(([basePoints, overlayPoints], layerIndex) => {
        const layerScalar = 1 - layerIndex / layersPointsData.length / 2
        const cellLength =
          layerScalar * 1.75 -
          0.5 * Math.sin(Math.PI * (frameIndex / frameCount))
        const halfCellLength = cellLength / 2
        return (
          <Fragment>
            <mask id={`${layerIndex}`}>
              {basePoints.map((someBasePoint) => (
                <rect
                  x={someBasePoint.x - halfCellLength}
                  y={someBasePoint.y - halfCellLength}
                  width={cellLength}
                  height={cellLength}
                  fill={'white'}
                />
              ))}
              {overlayPoints.map((someOverlayPoint) => (
                <rect
                  x={someOverlayPoint.x - halfCellLength}
                  y={someOverlayPoint.y - halfCellLength}
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
  layerPointsBase: {
    visiblePoints: Array<BasedPoint>
    maskPoints: Array<BasedPoint>
  }
  getWaveSampleOscillation: (api: {
    sampleAngle: number
    baseAngle: number
    layerIndex: number
    rhythmIndex: number
  }) => number
  getLayerRadiusScalar: (api: {
    layerIndex: number
    rhythmIndex: number
  }) => number
}

function getNestedLayersData(api: GetNestedLayersDataApi) {
  const { nestRhythm } = api
}

interface GetLoopWavePointsApi {
  someLoopPoints: Array<BasedPoint>
  getWaveSampleOscillation: (sampleAngle: number, baseAngle: number) => number
  getPointRadiusScalar: () => number
}

function getLoopWavePoints(api: GetLoopWavePointsApi) {
  const { someLoopPoints, getWaveSampleOscillation, getPointRadiusScalar } = api
  return someLoopPoints.map((someLoopPoint, sampleIndex) => {
    const sampleAngle = ((2 * Math.PI) / someLoopPoints.length) * sampleIndex
    const cellRadius =
      getWaveSampleOscillation(sampleAngle, someLoopPoint.baseAngle) +
      someLoopPoint.baseDistance * getPointRadiusScalar()
    return {
      ...someLoopPoint,
      x:
        cellRadius * Math.cos(someLoopPoint.baseAngle) +
        someLoopPoint.basePoint.x,
      y:
        cellRadius * Math.sin(someLoopPoint.baseAngle) +
        someLoopPoint.basePoint.y,
    }
  })
}

interface GetSecondaryPointsApi {
  someCompositeLoop: CompositeLoop
  sampleCount: number
}

function getSecondaryLoopPoints(api: GetSecondaryPointsApi): Array<BasedPoint> {
  const { sampleCount, someCompositeLoop } = api
  const currentLoopPoints = getCompositeLoopPoints({
    sampleCount,
    someCompositeLoop,
  })
  const [baseCircle, childCircle] = getCompositeLoopCircles({
    someCompositeLoop,
  })
  return new Array(sampleCount).fill(undefined).map((_, sampleIndex) => {
    const sampleAngle = ((2 * Math.PI) / sampleCount) * sampleIndex
    const loopPoint = getTracePoint({
      someBasedPoints: currentLoopPoints,
      traceAngle: sampleAngle,
    })
    const basePoint = getLoopBaseCirclePointBase({
      baseCircle,
      childCenter: childCircle.center,
      childPoint: loopPoint,
    })
    const secondaryLoopPoint: Point = {
      x: loopPoint.x,
      y: basePoint.y,
    }
    return {
      ...secondaryLoopPoint,
      baseAngle: getNormalizedAngleBetweenPoints({
        basePoint: childCircle.center,
        targetPoint: secondaryLoopPoint,
      }),
      baseDistance: getDistanceBetweenPoints({
        pointA: childCircle.center,
        pointB: secondaryLoopPoint,
      }),
      basePoint: childCircle.center,
    }
  })
}
