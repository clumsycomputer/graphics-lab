import {
  getCirclePoint,
  getDistanceBetweenPoints,
  getIntersectionPoint,
} from '@library/general'
import { AsymPoint, Point } from '@library/models'
import { getLoopPointsData } from './getLoopPointsData'

export interface GetTracedLoopPointDataApi {
  someLoopPointsData: ReturnType<typeof getLoopPointsData>
  traceAngle: number
  startingTracePointIndex: number
}

export function getTracedLoopPointData(
  api: GetTracedLoopPointDataApi
): [tracedLoopPoint: AsymPoint, traceIndex: number] {
  const { startingTracePointIndex, someLoopPointsData, traceAngle } = api
  const pointsCount = someLoopPointsData.loopPoints.length
  let pointsTraced = 0
  while (pointsTraced < pointsCount) {
    const traceIndexA = (startingTracePointIndex + pointsTraced) % pointsCount
    const traceIndexB = (traceIndexA + 1) % pointsCount
    const loopPointA = someLoopPointsData.loopPoints[traceIndexA]!
    const loopPointB = someLoopPointsData.loopPoints[traceIndexB]!
    if (
      (traceAngle >= loopPointA[3] && traceAngle <= loopPointB[3]) ||
      (loopPointA[3] > loopPointB[3] &&
        (traceAngle >= loopPointA[3] || traceAngle <= loopPointB[3]))
    ) {
      const tracedLoopPointBase = getIntersectionPoint({
        lineA: [loopPointA, loopPointB] as unknown as [Point, Point],
        lineB: [
          someLoopPointsData.loopCenter,
          getCirclePoint({
            pointAngle: traceAngle,
            someCircle: {
              center: someLoopPointsData.loopCenter,
              radius: 1000000, // some big number
            },
          }),
        ],
      })
      const inputAngleDelta = loopPointB[2] - loopPointA[2]
      const tracedInputAngleScalar =
        getDistanceBetweenPoints({
          pointA: loopPointA as unknown as Point,
          pointB: tracedLoopPointBase,
        }) /
        getDistanceBetweenPoints({
          pointA: loopPointA as unknown as Point,
          pointB: loopPointB as unknown as Point,
        })
      const approximatedTracedLoopPointInputAngle =
        tracedInputAngleScalar * inputAngleDelta + loopPointA[2]
      return [
        [
          tracedLoopPointBase[0],
          tracedLoopPointBase[1],
          approximatedTracedLoopPointInputAngle,
          traceAngle,
        ],
        traceIndexA,
      ]
    }
    pointsTraced = pointsTraced + 1
  }
  throw new Error('wtf? getTracedLoopPointData')
}
