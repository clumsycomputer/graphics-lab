import { getCirclePoint, getIntersectionPoint } from './general'
import { getLoopPointsData } from './getLoopPointsData'
import { Point } from './models'

export interface GetTracePointDataApi {
  someLoopPointsData: ReturnType<typeof getLoopPointsData>
  traceAngle: number
  startingTracePointIndex: number
}

export function getTracePointData(
  api: GetTracePointDataApi
): [tracePoint: Point, traceIndex: number] {
  const { startingTracePointIndex, someLoopPointsData, traceAngle } = api
  const pointsCount = someLoopPointsData.samplePoints.length
  let pointsTraced = 0
  while (pointsTraced < pointsCount) {
    const traceIndexA = (startingTracePointIndex + pointsTraced) % pointsCount
    const traceIndexB = (traceIndexA + 1) % pointsCount
    const loopPointA = someLoopPointsData.samplePoints[traceIndexA]!
    const loopPointB = someLoopPointsData.samplePoints[traceIndexB]!
    if (
      (traceAngle >= loopPointA.centerAngle &&
        traceAngle <= loopPointB.centerAngle) ||
      (loopPointA.centerAngle > loopPointB.centerAngle &&
        (traceAngle >= loopPointA.centerAngle ||
          traceAngle <= loopPointB.centerAngle))
    ) {
      return [
        getIntersectionPoint({
          lineA: [loopPointA, loopPointB],
          lineB: [
            someLoopPointsData.samplesCenter,
            getCirclePoint({
              pointAngle: traceAngle,
              someCircle: {
                center: someLoopPointsData.samplesCenter,
                radius: 1000000, // some big number
              },
            }),
          ],
        }),
        traceIndexA,
      ]
    }
    pointsTraced = pointsTraced + 1
  }
  throw new Error('wtf? getTracePointData')
}
