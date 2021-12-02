import { getMidPointBetweenPoints } from './general'
import { getLoopPointsData } from './getLoopPointsData'
import { Point } from './models'

export interface GetTracePointDataApi {
  someLoopPoints: ReturnType<typeof getLoopPointsData>['samplePoints']
  traceAngle: number
  startingTracePointIndex: number
}

export function getTracePointData(
  api: GetTracePointDataApi
): [tracePoint: Point, traceIndex: number] {
  const { startingTracePointIndex, someLoopPoints, traceAngle } = api
  const adjustedTraceAngle =
    traceAngle < someLoopPoints[startingTracePointIndex]!.centerAngle
      ? someLoopPoints[startingTracePointIndex]!.centerAngle
      : traceAngle
  for (
    let traceIndex = startingTracePointIndex;
    traceIndex < someLoopPoints.length - 1;
    traceIndex++
  ) {
    const loopPointA = someLoopPoints[startingTracePointIndex]!
    const loopPointB = someLoopPoints[startingTracePointIndex + 1]!
    if (
      adjustedTraceAngle >= loopPointA.centerAngle &&
      adjustedTraceAngle <= loopPointB.centerAngle
    ) {
      return [
        getMidPointBetweenPoints({
          pointA: loopPointA,
          pointB: loopPointB,
        }),
        traceIndex,
      ]
    }
  }
  return [
    getMidPointBetweenPoints({
      pointA: someLoopPoints[someLoopPoints.length - 1]!,
      pointB: someLoopPoints[0]!,
    }),
    someLoopPoints.length - 1,
  ]
}
