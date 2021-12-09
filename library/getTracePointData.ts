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
    traceIndex < someLoopPointsData.samplePoints.length;
    traceIndex++
  ) {
    const loopPointA = someLoopPointsData.samplePoints[traceIndex]!
    const loopPointB =
      someLoopPointsData.samplePoints[
        (traceIndex + 1) % someLoopPointsData.samplePoints.length
      ]!
    if (
      (adjustedTraceAngle >= loopPointA.centerAngle &&
        adjustedTraceAngle <= loopPointB.centerAngle) ||
      traceIndex === someLoopPointsData.samplePoints.length - 1
    ) {
      return [
        getIntersectionPoint({
          lineA: [loopPointA, loopPointB],
          lineB: [
            someLoopPointsData.samplesCenter,
            getCirclePoint({
              someCircle: {
                center: someLoopPointsData.samplesCenter,
                radius: 1000000,
              },
              pointAngle: adjustedTraceAngle,
            }),
          ],
        }),
        traceIndex,
      ]
    }
  }
  throw new Error('wtf? getTracePointData')
}
