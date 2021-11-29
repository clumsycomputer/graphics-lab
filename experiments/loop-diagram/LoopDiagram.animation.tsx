import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import {
  BasedPoint,
  Circle,
  CompositeLoop,
  getBasicLoopChildCircle,
  getCirclePoint,
  getCompositeLoopCircles,
  getCompositeLoopPoints,
  getLoopBaseCirclePointBase,
  getLoopChildCircle,
  getRotatedPoint,
  Loop,
  Point,
} from '@legacy-library/geometry'
import { getTriangleWaveSample } from '@legacy-library/miscellaneous'
import { DistributiveOmit } from '@legacy-library/miscellaneous/models'
import React from 'react'

const loopGroupAnimationModule: AnimationModule = {
  animationName: 'LoopGroup',
  frameSize: 2048,
  frameCount: 10 * 4,
  animationSettings: {
    frameRate: 10,
    constantRateFactor: 15,
  },
  FrameDescriptor: LoopGroupFrame,
}

export default loopGroupAnimationModule

interface LoopGroupFrameProps {
  frameCount: number
  frameIndex: number
}

function LoopGroupFrame(props: LoopGroupFrameProps) {
  const { frameIndex, frameCount } = props
  const frameStamp = frameIndex / frameCount
  const baseCircle: Circle = {
    center: {
      x: 50,
      y: 50,
    },
    radius: 30,
  }
  const baseLoop: CompositeLoop = {
    loopParts: [
      {
        baseCircle: baseCircle,
        loopType: 'baseCircleRotatedLoop',
        rotationAngle: Math.PI / 5,
        childCircle: {
          relativeDepth:
            0.2 * Math.sin(2 * Math.PI * frameStamp + Math.PI) + 0.25,
          relativeRadius: 0.3 * Math.sin(2 * Math.PI * frameStamp) + 0.6,
          phaseAngle:
            2 *
              Math.PI *
              getTriangleWaveSample({
                sampleAngle: Math.PI * frameStamp,
              }) +
            Math.PI / 3,
        },
      },
      {
        baseCircle: baseCircle,
        loopType: 'baseCircleRotatedLoop',
        rotationAngle: Math.PI / 5,
        childCircle: {
          relativeDepth:
            -0.2 * Math.sin(2 * Math.PI * frameStamp + Math.PI) + 0.25,
          relativeRadius: -0.3 * Math.sin(2 * Math.PI * frameStamp) + 0.6,
          phaseAngle:
            2 *
              Math.PI *
              getTriangleWaveSample({
                sampleAngle: Math.PI * frameStamp,
              }) -
            Math.PI / 3,
        },
      },
      // {
      //   baseCircle: baseCircle,
      //   loopType: 'baseCircleRotatedLoop',
      //   rotationAngle: -Math.PI / 7,
      //   childCircle: {
      //     relativeDepth: 0.6,
      //     relativeRadius: 0.3 * Math.sin(-Math.PI * frameStamp) + 0.6,
      //     phaseAngle:
      //       2 *
      //         Math.PI *
      //         getTriangleWaveSample({
      //           sampleAngle: Math.PI * frameStamp,
      //         }) +
      //       Math.PI / 5,
      //   },
      // },
    ],
    rotationAngle: (Math.PI / 3) * Math.sin(2 * Math.PI * frameStamp),
  }
  const [_, baseChildCircle] = getCompositeLoopCircles({
    someCompositeLoop: baseLoop,
  })
  const basePoints = getCompositeLoopPoints({
    someCompositeLoop: baseLoop,
    sampleCount: 2048,
  })

  // const sectionPointsA = getLoopSectionPoints({
  //   someLoopPoints: basePoints,
  //   minAngle: 2 * Math.PI * (0 / 4),
  //   maxAngle: 2 * Math.PI * (1 / 4),
  // })
  // const sectionPointsB = getLoopSectionPoints({
  //   someLoopPoints: basePoints,
  //   minAngle: 2 * Math.PI * (1 / 4),
  //   maxAngle: 2 * Math.PI * (2 / 4),
  // })
  // const sectionPointsC = getLoopSectionPoints({
  //   someLoopPoints: basePoints,
  //   minAngle: 2 * Math.PI * (2 / 4),
  //   maxAngle: 2 * Math.PI * (3 / 4),
  // })
  // const sectionPointsD = getLoopSectionPoints({
  //   someLoopPoints: basePoints,
  //   minAngle: 2 * Math.PI * (3 / 4),
  //   maxAngle: 2 * Math.PI * (4 / 4),
  // })
  return (
    <svg viewBox={`0 0 100 100`}>
      <rect x={0} y={0} width={100} height={100} fill={'black'} />
      {basePoints.map((somePoint, pointIndex) => (
        <circle
          cx={(50 / basePoints.length) * pointIndex + 25}
          cy={somePoint.y - baseChildCircle.center.y + 50}
          r={0.3}
          fill={'white'}
        />
      ))}
      {/* <polygon
        fillOpacity={0}
        strokeWidth={0.2}
        stroke={'orange'}
        points={basePoints
          .map((somePoint) => `${somePoint.x},${somePoint.y}`)
          .join(' ')}
      /> */}
      {/* <g
        transform={`translate(${
          -baseCircle.center.x -
          (baseChildCircle.center.x - baseCircle.center.x)
        } ${
          -baseCircle.center.y -
          (baseChildCircle.center.y - baseCircle.center.y)
        })`}
      >
        <polyline
          fillOpacity={0}
          strokeWidth={0.2}
          stroke={'orange'}
          points={sectionPointsA
            .map((somePoint) => `${somePoint.x},${somePoint.y}`)
            .join(' ')}
        />
      </g>
      <g
        transform={`translate(${
          baseCircle.center.x - (baseChildCircle.center.x - baseCircle.center.x)
        } ${
          -baseCircle.center.y -
          (baseChildCircle.center.y - baseCircle.center.y)
        })`}
      >
        <polyline
          fillOpacity={0}
          strokeWidth={0.2}
          stroke={'orange'}
          points={sectionPointsB
            .map((somePoint) => `${somePoint.x},${somePoint.y}`)
            .join(' ')}
        />
      </g>
      <g
        transform={`translate(${
          baseCircle.center.x - (baseChildCircle.center.x - baseCircle.center.x)
        } ${
          baseCircle.center.y - (baseChildCircle.center.y - baseCircle.center.y)
        })`}
      >
        <polyline
          fillOpacity={0}
          strokeWidth={0.2}
          stroke={'orange'}
          points={sectionPointsC
            .map((somePoint) => `${somePoint.x},${somePoint.y}`)
            .join(' ')}
        />
      </g>
      <g
        transform={`translate(${
          -baseCircle.center.x -
          (baseChildCircle.center.x - baseCircle.center.x)
        } ${
          baseCircle.center.y - (baseChildCircle.center.y - baseCircle.center.y)
        })`}
      >
        <polyline
          fillOpacity={0}
          strokeWidth={0.2}
          stroke={'orange'}
          points={sectionPointsD
            .map((somePoint) => `${somePoint.x},${somePoint.y}`)
            .join(' ')}
        />
      </g> */}
    </svg>
  )
}

interface GetLoopSectionPointsApi {
  someLoopPoints: Array<BasedPoint>
  minAngle: number
  maxAngle: number
}

function getLoopSectionPoints(api: GetLoopSectionPointsApi) {
  const { someLoopPoints, minAngle, maxAngle } = api
  return someLoopPoints.filter(
    (someBasedPoint) =>
      someBasedPoint.baseAngle >= minAngle &&
      someBasedPoint.baseAngle <= maxAngle
  )
}

interface GetFooLoopPointApi {
  baseCircle: Circle
  loopNest: Array<DistributiveOmit<Loop, 'baseCircle'>>
  pointAngle: number
}

function getFooLoopPoint(api: GetFooLoopPointApi): Point {
  const { baseCircle, loopNest, pointAngle } = api
  const [currentChildLoop, ...nextLoopNest] = loopNest
  if (currentChildLoop) {
    // const childLoopCircle = getLoopChildCircle({
    //   someLoop: {
    //     ...currentChildLoop,
    //     baseCircle,
    //   },
    // })
    const childLoopCircle = getBasicLoopChildCircle({
      someBasicLoop: {
        ...currentChildLoop,
        baseCircle,
      },
    })
    const childFooLoopPoint = getFooLoopPoint({
      pointAngle,
      baseCircle: childLoopCircle,
      loopNest: nextLoopNest,
    })
    const baseCirclePoint = getLoopBaseCirclePointBase({
      baseCircle,
      childCenter: childLoopCircle.center,
      childPoint: childFooLoopPoint,
    })
    const fooLoopPoint = {
      x: childFooLoopPoint.x,
      y: baseCirclePoint.y,
    }
    switch (currentChildLoop.loopType) {
      case 'basicLoop':
        return fooLoopPoint
      case 'baseCircleRotatedLoop':
        return getRotatedPoint({
          basePoint: fooLoopPoint,
          anchorPoint: baseCircle.center,
          rotationAngle: currentChildLoop.rotationAngle,
        })
      case 'childCircleRotatedLoop':
        return getRotatedPoint({
          basePoint: fooLoopPoint,
          anchorPoint: childLoopCircle.center,
          rotationAngle: currentChildLoop.rotationAngle,
        })
    }
  } else {
    return getCirclePoint({
      pointAngle,
      someCircle: baseCircle,
    })
  }
}
