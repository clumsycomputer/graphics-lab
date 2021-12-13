import {
  getCirclePoint,
  getDistanceBetweenPoints,
  getNormalizedAngleBetweenPoints,
  getRotatedPoint,
} from './general'
import { Circle, LoopStructure, Point } from './models'

export interface GetLoopPointApi {
  someLoopStructure: LoopStructure
  pointAngle: number
}

export function getLoopPoint(api: GetLoopPointApi): Point {
  const { pointAngle, someLoopStructure } = api
  return getSubLoopPoint({
    pointAngle,
    baseCircle: someLoopStructure.loopBase,
    someSubLoopStructure: someLoopStructure.subStructure,
  })
}

interface GetSubLoopPointApi {
  pointAngle: number
  baseCircle: Circle
  someSubLoopStructure: LoopStructure['subStructure']
}

function getSubLoopPoint(api: GetSubLoopPointApi): Point {
  const { someSubLoopStructure, baseCircle, pointAngle } = api
  switch (someSubLoopStructure.structureType) {
    case 'interposedStructure':
      const foundationCircleDepth =
        someSubLoopStructure.subStructure.relativeFoundationDepth *
        baseCircle.radius
      const unrotatedFoundationCircle: Circle = {
        center: {
          x:
            foundationCircleDepth *
              Math.cos(someSubLoopStructure.subStructure.foundationPhaseAngle) +
            baseCircle.center.x,
          y:
            foundationCircleDepth *
              Math.sin(someSubLoopStructure.subStructure.foundationPhaseAngle) +
            baseCircle.center.y,
        },
        radius:
          someSubLoopStructure.subStructure.relativeFoundationRadius *
          (baseCircle.radius - foundationCircleDepth),
      }
      const subLoopPoint = getSubLoopPoint({
        pointAngle,
        baseCircle: unrotatedFoundationCircle,
        someSubLoopStructure: someSubLoopStructure.subStructure,
      })
      const { loopBaseCirclePoint } = getLoopBaseCirclePoint({
        baseCircle,
        subLoopPoint,
        unrotatedFoundationCircleCenter: unrotatedFoundationCircle.center,
      })
      return getRotatedPoint({
        rotationAngle: someSubLoopStructure.subLoopRotationAngle,
        anchorPoint: getRotatedPoint({
          anchorPoint: baseCircle.center,
          basePoint: unrotatedFoundationCircle.center,
          rotationAngle: someSubLoopStructure.subStructure.baseOrientationAngle,
        }),
        basePoint: getRotatedPoint({
          anchorPoint: baseCircle.center,
          rotationAngle: someSubLoopStructure.subStructure.baseOrientationAngle,
          basePoint: {
            x: loopBaseCirclePoint.x,
            y: subLoopPoint.y,
          },
        }),
      })
    case 'terminalStructure':
      return getCirclePoint({
        pointAngle,
        someCircle: baseCircle,
      })
  }
}

interface getLoopBaseCirclePointApi {
  baseCircle: Circle
  unrotatedFoundationCircleCenter: Point
  subLoopPoint: Point
}

function getLoopBaseCirclePoint(api: getLoopBaseCirclePointApi) {
  const { baseCircle, subLoopPoint, unrotatedFoundationCircleCenter } = api
  const childDepth = getDistanceBetweenPoints({
    pointA: baseCircle.center,
    pointB: unrotatedFoundationCircleCenter,
  })
  const childRadius = getDistanceBetweenPoints({
    pointA: unrotatedFoundationCircleCenter,
    pointB: subLoopPoint,
  })
  const childPointAngle = getNormalizedAngleBetweenPoints({
    basePoint: unrotatedFoundationCircleCenter,
    targetPoint: subLoopPoint,
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
      Math.pow(subLoopPoint.x - baseCircle.center.x, 2) +
        Math.pow(subLoopPoint.y - baseCircle.center.y, 2)
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
          unrotatedFoundationCircleCenter.x,
        y:
          childCircleCenterToBaseCirclePointLength * Math.sin(childPointAngle) +
          unrotatedFoundationCircleCenter.y,
      },
    }
  }
}
