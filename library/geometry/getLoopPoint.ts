import {
  getAdjustedSampleAngle,
  getCirclePoint,
  getDistanceBetweenPoints,
  getNormalizedAngleBetweenPoints,
  getRotatedPoint,
} from './general'
import { getBasicLoopChildCircle } from './getLoopChildCircle'
import {
  BaseCircleRotatedLoop,
  ChildCircleRotatedLoop,
  Circle,
  Loop,
  LoopBase,
  Point,
} from './models'

export interface GetLoopPointApi {
  someLoop: Loop
  childPointAngle: number
}

export function getLoopPoint(api: GetLoopPointApi) {
  const { someLoop, childPointAngle } = api
  switch (someLoop.loopType) {
    case 'basicLoop':
      return getBasicLoopPoint({
        childPointAngle: getAdjustedSampleAngle({
          sampleAngle: childPointAngle,
        }),
        someBasicLoop: someLoop,
      })
    case 'baseCircleRotatedLoop':
      return getBaseCircleRotatedLoopPoint({
        childPointAngle,
        someBaseCircleRotatedLoop: someLoop,
      })
    case 'childCircleRotatedLoop':
      return getChildCircleRotatedLoopPoint({
        childPointAngle,
        someChildCircleRotatedLoop: someLoop,
      })
    default:
      throw new Error('wtf? getLoopPoint')
  }
}

interface GetBasicLoopPointApi {
  someBasicLoop: LoopBase<string>
  childPointAngle: number
}

function getBasicLoopPoint(api: GetBasicLoopPointApi): Point {
  const { someBasicLoop, childPointAngle } = api
  const childCirclePoint = getBasicLoopChildCirclePoint({
    someBasicLoop,
    childPointAngle,
  })
  const baseCirclePoint = getBasicLoopBaseCirclePoint({
    someBasicLoop,
    childPointAngle,
  })
  const loopPoint = {
    x: childCirclePoint.x,
    y: baseCirclePoint.y,
  }
  return loopPoint
}

interface GetBasicLoopChildCirclePointApi {
  someBasicLoop: LoopBase<string>
  childPointAngle: number
}

function getBasicLoopChildCirclePoint(api: GetBasicLoopChildCirclePointApi) {
  const { someBasicLoop, childPointAngle } = api
  const childCircle = getBasicLoopChildCircle({
    someBasicLoop,
  })
  const childCirclePoint = getCirclePoint({
    pointAngle: childPointAngle,
    someCircle: childCircle,
  })
  return childCirclePoint
}

interface GetBasicLoopBaseCirclePointApi {
  someBasicLoop: LoopBase<string>
  childPointAngle: number
}

function getBasicLoopBaseCirclePoint(api: GetBasicLoopBaseCirclePointApi) {
  const { someBasicLoop, childPointAngle } = api
  const basicLoopChildCircle = getBasicLoopChildCircle({
    someBasicLoop,
  })
  return getLoopBaseCirclePointBase({
    baseCircle: someBasicLoop.baseCircle,
    childCenter: basicLoopChildCircle.center,
    childPoint: getCirclePoint({
      someCircle: basicLoopChildCircle,
      pointAngle: childPointAngle,
    }),
  })
}

export interface GetLoopBaseCirclePointBaseApi {
  baseCircle: Circle
  childCenter: Point
  childPoint: Point
}

export function getLoopBaseCirclePointBase(api: GetLoopBaseCirclePointBaseApi) {
  const { baseCircle, childPoint, childCenter } = api
  const childDepth = getDistanceBetweenPoints({
    pointA: baseCircle.center,
    pointB: childCenter,
  })
  const childRadius = getDistanceBetweenPoints({
    pointA: childCenter,
    pointB: childPoint,
  })
  const childPointAngle = getNormalizedAngleBetweenPoints({
    basePoint: childCenter,
    targetPoint: childPoint,
  })
  const baseCircleCenterToChildCirclePointLength = Math.sqrt(
    Math.pow(childPoint.x - baseCircle.center.x, 2) +
      Math.pow(childPoint.y - baseCircle.center.y, 2)
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
  const baseCirclePoint: Point = {
    x:
      childCircleCenterToBaseCirclePointLength * Math.cos(childPointAngle) +
      childCenter.x,
    y:
      childCircleCenterToBaseCirclePointLength * Math.sin(childPointAngle) +
      childCenter.y,
  }
  return baseCirclePoint
}

interface GetBaseCircleRotatedLoopPointApi {
  someBaseCircleRotatedLoop: BaseCircleRotatedLoop
  childPointAngle: number
}

function getBaseCircleRotatedLoopPoint(api: GetBaseCircleRotatedLoopPointApi) {
  const { childPointAngle, someBaseCircleRotatedLoop } = api
  return getRotatedPoint({
    basePoint: getBasicLoopPoint({
      childPointAngle,
      someBasicLoop: someBaseCircleRotatedLoop,
    }),
    rotationAngle: someBaseCircleRotatedLoop.rotationAngle,
    anchorPoint: someBaseCircleRotatedLoop.baseCircle.center,
  })
}

interface GetChildCircleRotatedLoopPointApi {
  someChildCircleRotatedLoop: ChildCircleRotatedLoop
  childPointAngle: number
}

function getChildCircleRotatedLoopPoint(
  api: GetChildCircleRotatedLoopPointApi
) {
  const { childPointAngle, someChildCircleRotatedLoop } = api
  return getRotatedPoint({
    basePoint: getBasicLoopPoint({
      childPointAngle,
      someBasicLoop: someChildCircleRotatedLoop,
    }),
    rotationAngle: someChildCircleRotatedLoop.rotationAngle,
    anchorPoint: getBasicLoopChildCircle({
      someBasicLoop: someChildCircleRotatedLoop,
    }).center,
  })
}
