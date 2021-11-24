import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import {
  BasedPoint,
  Circle,
  CompositeLoop,
  getCompositeLoopCircles,
  getCompositeLoopPoints,
  getDistanceBetweenPoints,
  getLoopBaseCirclePointBase,
  getNormalizedAngleBetweenPoints,
  getTracePoint,
  Point,
} from '@library/geometry'
import {
  getElementIndices,
  getNaturalCompositeRhythm,
} from '@library/sequenced-space'
import React from 'react'

const loopDiagramAnimationModule: AnimationModule = {
  animationName: 'LoopDiagram',
  frameSize: 2048,
  frameCount: 320,
  animationSettings: {
    frameRate: 60,
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
  const { frameCount, frameIndex } = props
  const currentBaseCircle: Circle = {
    center: {
      x: 50,
      y: 50,
    },
    radius: 20,
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
      {
        loopType: 'baseCircleRotatedLoop',
        baseCircle: currentBaseCircle,
        childCircle: {
          phaseAngle: -2 * Math.PI * (frameIndex / frameCount) + Math.PI / 2,
          relativeDepth:
            Math.sin(Math.PI * (frameIndex / frameCount)) * 0.5 + 0.00001,
          relativeRadius:
            0.9999 - Math.sin(Math.PI * (frameIndex / frameCount)) * 0.5,
        },
        rotationAngle: -2 * Math.PI * (frameIndex / frameCount),
      },
      {
        loopType: 'baseCircleRotatedLoop',
        baseCircle: currentBaseCircle,
        childCircle: {
          phaseAngle:
            Math.PI * (frameIndex / frameCount) + Math.PI / 2 - Math.PI / 3,
          relativeDepth:
            Math.sin(Math.PI * (frameIndex / frameCount)) * 0.5 + 0.00001,
          relativeRadius:
            0.9999 - Math.sin(Math.PI * (frameIndex / frameCount)) * 0.5,
        },
        rotationAngle: -Math.PI * (frameIndex / frameCount),
      },
      {
        loopType: 'baseCircleRotatedLoop',
        baseCircle: currentBaseCircle,
        childCircle: {
          phaseAngle:
            -Math.PI * (frameIndex / frameCount) + Math.PI / 2 + Math.PI / 3,
          relativeDepth:
            Math.sin(Math.PI * (frameIndex / frameCount)) * 0.5 + 0.00001,
          relativeRadius:
            0.9999 - Math.sin(Math.PI * (frameIndex / frameCount)) * 0.5,
        },
        rotationAngle: Math.PI * (frameIndex / frameCount),
      },
      // {
      //   loopType: 'baseCircleRotatedLoop',
      //   baseCircle: currentBaseCircle,
      //   childCircle: {
      //     phaseAngle: Math.PI * (frameIndex / frameCount) + Math.PI / 3,
      //     relativeDepth:
      //       Math.sin(-Math.PI * (frameIndex / frameCount)) * 0.5 + 0.00001,
      //     relativeRadius:
      //       0.9999 - Math.sin(-Math.PI * (frameIndex / frameCount)) * 0.5,
      //   },
      //   rotationAngle: 4 * Math.PI * (frameIndex / frameCount),
      // },
    ],
    rotationAngle: (-Math.PI / 2) * (frameIndex / frameCount),
  }

  const currentLoopPoints = getCompositeLoopPoints({
    someCompositeLoop: currentLoop,
    sampleCount: 2048,
  })
  const currentFooPoints = getFooPoints({
    someCompositeLoop: currentLoop,
    sampleCount: 2048,
  })
  const [currentLoopBaseCircle, currentLoopChildCircle] =
    getCompositeLoopCircles({
      someCompositeLoop: currentLoop,
    })
  return (
    <svg viewBox={`0 0 100 100`}>
      <rect x={0} y={0} width={100} height={100} fill={'black'} />
      {/* <circle
        cx={currentLoopBaseCircle.center.x}
        cy={currentLoopBaseCircle.center.y}
        r={currentLoopBaseCircle.radius}
        fillOpacity={0}
        stroke={'white'}
        strokeWidth={0.3}
      />
      <circle
        cx={currentLoopChildCircle.center.x}
        cy={currentLoopChildCircle.center.y}
        r={currentLoopChildCircle.radius}
        fillOpacity={0}
        stroke={'white'}
        strokeWidth={0.3}
      /> */}
      <polygon
        points={currentLoopPoints
          .map((somePoint) => `${somePoint.x},${somePoint.y}`)
          .join(' ')}
        fillOpacity={0}
        stroke={'white'}
        strokeWidth={0.3}
      />
      <polygon
        points={currentFooPoints
          .map((somePoint) => `${somePoint.x},${somePoint.y}`)
          .join(' ')}
        fillOpacity={0}
        stroke={'white'}
        strokeWidth={0.3}
      />
    </svg>
  )
}

interface GetFooPointsApi {
  someCompositeLoop: CompositeLoop
  sampleCount: number
}

function getFooPoints(api: GetFooPointsApi): Array<BasedPoint> {
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
    const fooPoint: Point = {
      x: loopPoint.x,
      y: basePoint.y,
    }
    return {
      ...fooPoint,
      baseAngle: getNormalizedAngleBetweenPoints({
        basePoint: childCircle.center,
        targetPoint: fooPoint,
      }),
      baseDistance: getDistanceBetweenPoints({
        pointA: childCircle.center,
        pointB: fooPoint,
      }),
      basePoint: childCircle.center,
    }
  })
}
