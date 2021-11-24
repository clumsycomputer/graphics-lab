import { getCirclePoint, getRotatedPoint } from './general'
import { getBasicLoopChildCircle } from './getLoopChildCircle'
import {
  BaseCircleRotatedLoop,
  ChildCircleRotatedLoop,
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
        childPointAngle,
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
  const childCircle = getBasicLoopChildCircle({
    someBasicLoop,
  })
  const childCirclePoint = getBasicLoopChildCirclePoint({
    someBasicLoop,
    childPointAngle,
  })
  const baseCircleCenterToChildCirclePointLength = Math.sqrt(
    Math.pow(childCirclePoint.x - someBasicLoop.baseCircle.center.x, 2) +
      Math.pow(childCirclePoint.y - someBasicLoop.baseCircle.center.y, 2)
  )
  const baseCircleCenterToBaseCirclePointAngle = Math.acos(
    (Math.pow(childCircle.depth, 2) +
      Math.pow(childCircle.radius, 2) -
      Math.pow(baseCircleCenterToChildCirclePointLength, 2)) /
      (2 * childCircle.depth * childCircle.radius)
  )
  const baseCircleCenterToChildCircleCenterAngle = Math.asin(
    (Math.sin(baseCircleCenterToBaseCirclePointAngle) /
      someBasicLoop.baseCircle.radius) *
      childCircle.depth
  )
  const childCircleCenterToBaseCirclePointAngle =
    Math.PI -
    baseCircleCenterToBaseCirclePointAngle -
    baseCircleCenterToChildCircleCenterAngle
  const childCircleCenterToBaseCirclePointLength =
    Math.sin(childCircleCenterToBaseCirclePointAngle) *
    (someBasicLoop.baseCircle.radius /
      Math.sin(baseCircleCenterToBaseCirclePointAngle))
  const baseCirclePoint: Point = {
    x:
      childCircleCenterToBaseCirclePointLength * Math.cos(childPointAngle) +
      childCircle.center.x,
    y:
      childCircleCenterToBaseCirclePointLength * Math.sin(childPointAngle) +
      childCircle.center.y,
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
