import {
  getCirclePoint,
  getDistanceBetweenPoints,
  getNormalizedAngleBetweenPoints,
  getRotatedPoint,
} from './general'
import { Circle, Loop, Point } from './models'

export interface GetLoopPointApi {
  someLoop: Loop
  pointAngle: number
}

export function getLoopPoint(api: GetLoopPointApi): Point {
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
