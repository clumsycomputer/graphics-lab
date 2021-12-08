import {
  getCirclePoint,
  getIntersectionPoint,
  getMidPointBetweenPoints,
} from './general'
import { getLoopPointsData } from './getLoopPointsData'
import { LoopPoint, Point } from './models'

export interface GetTracePointDataApi {
  someLoopPointsData: ReturnType<typeof getLoopPointsData>
  traceAngle: number
  startingTracePointIndex: number
}

export function getTracePointData(
  api: GetTracePointDataApi
): [tracePoint: Point, traceIndex: number] {
  const { startingTracePointIndex, someLoopPointsData, traceAngle } = api
  const adjustedTraceAngle =
    traceAngle <
    someLoopPointsData.samplePoints[startingTracePointIndex]!.centerAngle
      ? someLoopPointsData.samplePoints[startingTracePointIndex]!.centerAngle
      : traceAngle
  for (
    let traceIndex = startingTracePointIndex;
    traceIndex < someLoopPointsData.samplePoints.length - 1;
    traceIndex++
  ) {
    const loopPointA = someLoopPointsData.samplePoints[startingTracePointIndex]!
    const loopPointB =
      someLoopPointsData.samplePoints[startingTracePointIndex + 1]!
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
  const loopPointA = someLoopPointsData.samplePoints[startingTracePointIndex]!
  const loopPointB =
    someLoopPointsData.samplePoints[startingTracePointIndex + 1]!
  return [
    getMidPointBetweenPoints({
      pointA: loopPointA,
      pointB: loopPointB,
    }),
    someLoopPointsData.samplePoints.length - 1,
  ]
  // throw new Error('wtf? getTracePointData')
}
