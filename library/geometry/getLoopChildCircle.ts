import { Circle } from '.'
import { getRotatedPoint } from './general'
import { BaseCircleRotatedLoop, Loop, LoopBase } from './models'

export interface GetLoopChildCircleApi {
  someLoop: Loop
}

export function getLoopChildCircle(api: GetLoopChildCircleApi) {
  const { someLoop } = api
  switch (someLoop.loopType) {
    case 'basicLoop':
    case 'childCircleRotatedLoop':
      return getBasicLoopChildCircle({
        someBasicLoop: someLoop,
      })
    case 'baseCircleRotatedLoop':
      return getBaseCircleRotatedLoopChildCircle({
        someBaseCircleRotatedLoop: someLoop,
      })
    default:
      throw new Error('wtf? getLoopChildCircle')
  }
}

export interface GetBasicLoopChildCircleApi {
  someBasicLoop: LoopBase<string>
}

export function getBasicLoopChildCircle(
  api: GetBasicLoopChildCircleApi
): Circle {
  const { someBasicLoop } = api
  const childCircleDepth =
    someBasicLoop.childCircle.relativeDepth * someBasicLoop.baseCircle.radius
  return {
    center: {
      x:
        Math.cos(someBasicLoop.childCircle.phaseAngle) * childCircleDepth +
        someBasicLoop.baseCircle.center.x,
      y:
        Math.sin(someBasicLoop.childCircle.phaseAngle) * childCircleDepth +
        someBasicLoop.baseCircle.center.y,
    },
    radius:
      someBasicLoop.childCircle.relativeRadius *
      (someBasicLoop.baseCircle.radius - childCircleDepth),
  }
}

interface GetBaseCircleRotatedLoopChildCircleApi {
  someBaseCircleRotatedLoop: BaseCircleRotatedLoop
}

function getBaseCircleRotatedLoopChildCircle(
  api: GetBaseCircleRotatedLoopChildCircleApi
) {
  const { someBaseCircleRotatedLoop } = api
  const unrotatedChildCircle = getBasicLoopChildCircle({
    someBasicLoop: someBaseCircleRotatedLoop,
  })
  return {
    ...unrotatedChildCircle,
    center: getRotatedPoint({
      rotationAngle: someBaseCircleRotatedLoop.rotationAngle,
      basePoint: unrotatedChildCircle.center,
      anchorPoint: someBaseCircleRotatedLoop.baseCircle.center,
    }),
  }
}
