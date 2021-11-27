import { getMidPointBetweenPoints } from './general'
import { BasedPoint, Point } from './models'

export interface GetTracePointDataApi {
  someBasedPoints: Array<BasedPoint>
  traceAngle: number
  startingTraceIndex: number
}

export function getTracePointData(
  api: GetTracePointDataApi
): [tracePoint: Point, traceIndex: number] {
  const { startingTraceIndex, someBasedPoints, traceAngle } = api
  const adjustedTraceAngle =
    traceAngle < someBasedPoints[startingTraceIndex]!.baseAngle
      ? someBasedPoints[startingTraceIndex]!.baseAngle
      : traceAngle
  for (
    let traceIndex = startingTraceIndex;
    traceIndex < someBasedPoints.length - 1;
    traceIndex++
  ) {
    const basedPointA = someBasedPoints[traceIndex]!
    const basedPointB = someBasedPoints[traceIndex + 1]!
    if (
      adjustedTraceAngle >= basedPointA.baseAngle &&
      adjustedTraceAngle <= basedPointB.baseAngle
    ) {
      return [
        getMidPointBetweenPoints({
          pointA: basedPointA,
          pointB: basedPointB,
        }),
        traceIndex,
      ]
    }
  }
  return [
    getMidPointBetweenPoints({
      pointA: someBasedPoints[someBasedPoints.length - 1]!,
      pointB: someBasedPoints[0]!,
    }),
    someBasedPoints.length - 1,
  ]
}
