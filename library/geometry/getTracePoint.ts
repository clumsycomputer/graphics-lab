import { getMidPointBetweenPoints } from './general'
import { BasedPoint, Point } from './models'

export interface GetTracePointApi {
  someBasedPoints: Array<BasedPoint>
  traceAngle: number
}

export function getTracePoint(api: GetTracePointApi): Point {
  const { someBasedPoints, traceAngle } = api
  return someBasedPoints.reduce<Point | null>(
    (result, basePointA, loopPointIndex) => {
      if (result) {
        return result
      } else if (
        loopPointIndex < someBasedPoints.length - 1 &&
        basePointA.baseAngle <= traceAngle &&
        someBasedPoints[loopPointIndex + 1]!.baseAngle >= traceAngle
      ) {
        return getMidPointBetweenPoints({
          pointA: basePointA,
          pointB: someBasedPoints[loopPointIndex + 1]!,
        })
      } else if (loopPointIndex === someBasedPoints.length - 1) {
        return getMidPointBetweenPoints({
          pointA: basePointA,
          pointB: someBasedPoints[0]!,
        })
      } else {
        return null
      }
    },
    null
  )!
}
