import { getLoopChildCircle } from './getLoopChildCircle'
import { getLoopPoint } from './getLoopPoint'
import { BasedPoint, Loop } from './models'

export interface GetLoopPointsApi {
  someLoop: Loop
  sampleCount: number
}

export function getLoopPoints(api: GetLoopPointsApi): Array<BasedPoint> {
  const { someLoop, sampleCount } = api
  return new Array(sampleCount)
    .fill(undefined)
    .map<BasedPoint>((_, someSampleIndex) => {
      const loopPoint = getLoopPoint({
        someLoop,
        childPointAngle:
          ((2 * Math.PI) / sampleCount) * someSampleIndex + 0.00001,
      })
      const loopChildCircle = getLoopChildCircle({ someLoop })
      const loopPointToChildCircleCenterPointAngle =
        ((Math.atan2(
          loopPoint.y - loopChildCircle.center.y,
          loopPoint.x - loopChildCircle.center.x
        ) %
          (2 * Math.PI)) +
          2 * Math.PI) %
        (2 * Math.PI)
      return {
        ...loopPoint,
        basePoint: loopChildCircle.center,
        baseAngle: loopPointToChildCircleCenterPointAngle,
        baseDistance: Math.sqrt(
          Math.pow(loopPoint.x - loopChildCircle.center.x, 2) +
            Math.pow(loopPoint.y - loopChildCircle.center.y, 2)
        ),
      }
    })
    .sort((pointA, pointB) => pointA.baseAngle - pointB.baseAngle)
}
