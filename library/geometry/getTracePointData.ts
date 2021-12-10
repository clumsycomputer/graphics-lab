import { getCirclePoint, getIntersectionPoint } from './general'
import { getLoopPointsData } from './getLoopPointsData'
import { Point } from './models/general'

export interface GetTracePointDataApi {
  someLoopPointsData: ReturnType<typeof getLoopPointsData>
  traceAngle: number
  startingTracePointIndex: number
}

export function getTracePointData(
  api: GetTracePointDataApi
): [tracePoint: Point, traceIndex: number] {
  const { startingTracePointIndex, someLoopPointsData, traceAngle } = api
  const minimumSampleCenterAngle =
    someLoopPointsData.samplePoints[startingTracePointIndex]!.centerAngle
  const adjustedTraceAngle = // workaround
    traceAngle < minimumSampleCenterAngle
      ? minimumSampleCenterAngle
      : traceAngle
  for (
    let traceIndex = startingTracePointIndex;
    traceIndex <
    someLoopPointsData.samplePoints.length + startingTracePointIndex;
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
              pointAngle: adjustedTraceAngle,
              someCircle: {
                center: someLoopPointsData.samplesCenter,
                radius: 1000000, // some big number
              },
            }),
          ],
        }),
        traceIndex,
      ]
    }
  }
  throw new Error('wtf? getTracePointData')
}
