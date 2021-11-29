import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import React from 'react'

const loopDiagramAnimationModule: AnimationModule = {
  animationName: 'LoopDiagram',
  frameSize: 2048,
  frameCount: 10 * 4,
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
  const rootCircle: Circle = {
    center: {
      x: 50,
      y: 50,
    },
    radius: 25,
  }
  const loopA: Loop = {
    baseCircle: rootCircle,
    childRotationAngle: 0,
    childLoop: {
      childLoopType: 'middleChildLoop',
      relativeDepth: 0.5,
      relativeRadius: 1,
      phaseAngle: 0,
      baseRotationAngle: Math.PI / 2,
      childRotationAngle: Math.PI / 2,
      childLoop: {
        childLoopType: 'middleChildLoop',
        relativeDepth: 0,
        relativeRadius: 1,
        phaseAngle: -Math.PI / 2,
        baseRotationAngle: Math.PI / 3,
        childRotationAngle: Math.PI / 2,
        childLoop: {
          childLoopType: 'middleChildLoop',
          relativeDepth: 0.3,
          relativeRadius: 1,
          phaseAngle: Math.PI / 2,
          baseRotationAngle: -Math.PI / 3,
          childRotationAngle: Math.PI / 2,
          childLoop: {
            childLoopType: 'finalChildLoop',
            relativeDepth: 0,
            relativeRadius: 1,
            phaseAngle: -Math.PI / 2,
            baseRotationAngle: Math.PI / 3,
          },
        },
      },
    },
  }
  const loopPointsSampleCountA = 1024
  const loopPointsA = new Array(loopPointsSampleCountA)
    .fill(undefined)
    .map((_, pointIndex) =>
      getLoopPoint({
        someLoop: loopA,
        pointAngle: 2 * Math.PI * (pointIndex / loopPointsSampleCountA),
      })
    )
  return (
    <svg viewBox={`0 0 100 100`}>
      <rect x={0} y={0} width={100} height={100} fill={'black'} />
      <circle
        cx={loopA.baseCircle.center.x}
        cy={loopA.baseCircle.center.y}
        r={loopA.baseCircle.radius}
        fillOpacity={0}
        strokeWidth={0.2}
        stroke={'white'}
      />
      {loopPointsA.map((somePoint) => (
        <circle cx={somePoint.x} cy={somePoint.y} r={0.3} fill={'red'} />
      ))}
      <polygon
        fillOpacity={0}
        strokeWidth={0.2}
        stroke={'orange'}
        points={loopPointsA
          .map((somePoint) => `${somePoint.x},${somePoint.y}`)
          .join(' ')}
      />
    </svg>
  )
}

interface GetLoopPointApi {
  someLoop: Loop
  pointAngle: number
}

function getLoopPoint(api: GetLoopPointApi): Point {
  const { someLoop, pointAngle } = api
  if (someLoop.childLoop) {
    const childCircleDepth =
      someLoop.childLoop.relativeDepth * someLoop.baseCircle.radius
    const unrotatedChildCircle: Circle = {
      center: {
        x:
          childCircleDepth * Math.cos(someLoop.childLoop.phaseAngle) +
          someLoop.baseCircle.center.x,
        y:
          childCircleDepth * Math.sin(someLoop.childLoop.phaseAngle) +
          someLoop.baseCircle.center.y,
      },
      radius:
        someLoop.childLoop.relativeRadius *
        (someLoop.baseCircle.radius - childCircleDepth),
    }
    const childLoopPoint =
      someLoop.childLoop.childLoopType === 'middleChildLoop'
        ? getLoopPoint({
            pointAngle,
            someLoop: {
              childLoop: someLoop.childLoop.childLoop,
              childRotationAngle: someLoop.childLoop.childRotationAngle,
              baseCircle: unrotatedChildCircle,
            },
          })
        : getLoopPoint({
            pointAngle,
            someLoop: {
              childLoop: null,
              childRotationAngle: 0,
              baseCircle: unrotatedChildCircle,
            },
          })
    const { loopBaseCirclePoint } = getLoopBaseCirclePoint({
      childLoopPoint,
      baseCircle: someLoop.baseCircle,
      childCircleCenter: unrotatedChildCircle.center,
    })
    return getRotatedPoint({
      rotationAngle: someLoop.childRotationAngle,
      anchorPoint: getRotatedPoint({
        anchorPoint: someLoop.baseCircle.center,
        basePoint: unrotatedChildCircle.center,
        rotationAngle: someLoop.childLoop.baseRotationAngle,
      }),
      basePoint: getRotatedPoint({
        anchorPoint: someLoop.baseCircle.center,
        rotationAngle: someLoop.childLoop.baseRotationAngle,
        basePoint: {
          x: loopBaseCirclePoint.x,
          y: childLoopPoint.y,
        },
      }),
    })
  } else {
    return getCirclePoint({
      pointAngle,
      someCircle: someLoop.baseCircle,
    })
  }
}

interface getLoopBaseCirclePointApi {
  baseCircle: Circle
  childCircleCenter: Point
  childLoopPoint: Point
}

function getLoopBaseCirclePoint(api: getLoopBaseCirclePointApi) {
  const { baseCircle, childLoopPoint, childCircleCenter } = api
  const childDepth = getDistanceBetweenPoints({
    pointA: baseCircle.center,
    pointB: childCircleCenter,
  })
  const childRadius = getDistanceBetweenPoints({
    pointA: childCircleCenter,
    pointB: childLoopPoint,
  })
  const childPointAngle = getNormalizedAngleBetweenPoints({
    basePoint: childCircleCenter,
    targetPoint: childLoopPoint,
  })
  if (childDepth === 0) {
    return {
      loopBaseCirclePoint: getCirclePoint({
        someCircle: baseCircle,
        pointAngle: childPointAngle,
      }),
    }
  } else {
    const baseCircleCenterToChildCirclePointLength = Math.sqrt(
      Math.pow(childLoopPoint.x - baseCircle.center.x, 2) +
        Math.pow(childLoopPoint.y - baseCircle.center.y, 2)
    )
    const baseCircleCenterToBaseCirclePointAngle = Math.acos(
      (Math.pow(childDepth, 2) +
        Math.pow(childRadius, 2) -
        Math.pow(baseCircleCenterToChildCirclePointLength, 2)) /
        (2 * childDepth * childRadius)
    )
    const baseCircleCenterToChildCircleCenterAngle = Math.asin(
      (Math.sin(baseCircleCenterToBaseCirclePointAngle) / baseCircle.radius) *
        childDepth
    )
    const childCircleCenterToBaseCirclePointAngle =
      Math.PI -
      baseCircleCenterToBaseCirclePointAngle -
      baseCircleCenterToChildCircleCenterAngle
    const childCircleCenterToBaseCirclePointLength =
      Math.sin(childCircleCenterToBaseCirclePointAngle) *
      (baseCircle.radius / Math.sin(baseCircleCenterToBaseCirclePointAngle))
    return {
      loopBaseCirclePoint: {
        x:
          childCircleCenterToBaseCirclePointLength * Math.cos(childPointAngle) +
          childCircleCenter.x,
        y:
          childCircleCenterToBaseCirclePointLength * Math.sin(childPointAngle) +
          childCircleCenter.y,
      },
    }
  }
}

interface Loop {
  baseCircle: Circle
  childLoop: ChildLoop | null
  childRotationAngle: number
}

type ChildLoop = MiddleChildLoop | FinalChildLoop

interface MiddleChildLoop extends ChildLoopBase<'middleChildLoop'> {
  childRotationAngle: number
  childLoop: ChildLoop
}

interface FinalChildLoop extends ChildLoopBase<'finalChildLoop'> {}

interface ChildLoopBase<ChildLoopType extends string> {
  childLoopType: ChildLoopType
  relativeDepth: number
  relativeRadius: number
  phaseAngle: number
  baseRotationAngle: number
}

interface Circle {
  center: Point
  radius: number
}

interface Point {
  x: number
  y: number
}

interface GetCirclePointApi {
  someCircle: Circle
  pointAngle: number
}

function getCirclePoint(api: GetCirclePointApi): Point {
  const { pointAngle, someCircle } = api
  const circlePoint = {
    x: Math.cos(pointAngle) * someCircle.radius + someCircle.center.x,
    y: Math.sin(pointAngle) * someCircle.radius + someCircle.center.y,
  }
  return circlePoint
}
interface GetRotatedPointApi {
  basePoint: Point
  anchorPoint: Point
  rotationAngle: number
}
function getRotatedPoint(api: GetRotatedPointApi) {
  const { basePoint, anchorPoint, rotationAngle } = api
  const originCenteredPoint = {
    x: basePoint.x - anchorPoint.x,
    y: basePoint.y - anchorPoint.y,
  }
  return {
    x:
      originCenteredPoint.x * Math.cos(rotationAngle) -
      originCenteredPoint.y * Math.sin(rotationAngle) +
      anchorPoint.x,
    y:
      originCenteredPoint.x * Math.sin(rotationAngle) +
      originCenteredPoint.y * Math.cos(rotationAngle) +
      anchorPoint.y,
  }
}

interface GetNormalizedAngleBetweenPointsApi {
  basePoint: Point
  targetPoint: Point
}

function getNormalizedAngleBetweenPoints(
  api: GetNormalizedAngleBetweenPointsApi
) {
  const { targetPoint, basePoint } = api
  return getNormalizedAngle({
    someAngle: Math.atan2(
      targetPoint.y - basePoint.y,
      targetPoint.x - basePoint.x
    ),
  })
}

interface GetDistanceBetweenPointsApi {
  pointA: Point
  pointB: Point
}

function getDistanceBetweenPoints(api: GetDistanceBetweenPointsApi) {
  const { pointA, pointB } = api
  const deltaX = pointB.x - pointA.x
  const deltaY = pointB.y - pointA.y
  return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2))
}

interface GetNormalizedAngleApi {
  someAngle: number
}

function getNormalizedAngle(api: GetNormalizedAngleApi) {
  const { someAngle } = api
  return ((someAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
}
