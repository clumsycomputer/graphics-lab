import { LoopPoint } from './models'
import {
  getCirclePoint,
  getDistanceBetweenPoints,
  getIntersectionPoint,
} from './general'
import { getLoopPointsData } from './getLoopPointsData'

export interface GetTracedLoopPointDataApi {
  someLoopPointsData: ReturnType<typeof getLoopPointsData>
  traceAngle: number
  startingTracePointIndex: number
}

export function getTracedLoopPointData(
  api: GetTracedLoopPointDataApi
): [tracedLoopPoint: LoopPoint, traceIndex: number] {
  const { startingTracePointIndex, someLoopPointsData, traceAngle } = api
  const pointsCount = someLoopPointsData.loopPoints.length
  let pointsTraced = 0
  while (pointsTraced < pointsCount) {
    const traceIndexA = (startingTracePointIndex + pointsTraced) % pointsCount
    const traceIndexB = (traceIndexA + 1) % pointsCount
    const loopPointA = someLoopPointsData.loopPoints[traceIndexA]!
    const loopPointB = someLoopPointsData.loopPoints[traceIndexB]!
    if (
      (traceAngle >= loopPointA.outputAngle &&
        traceAngle <= loopPointB.outputAngle) ||
      (loopPointA.outputAngle > loopPointB.outputAngle &&
        (traceAngle >= loopPointA.outputAngle ||
          traceAngle <= loopPointB.outputAngle))
    ) {
      const tracedLoopPointBase = getIntersectionPoint({
        lineA: [loopPointA, loopPointB],
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
      const inputAngleDelta = loopPointB.inputAngle - loopPointA.inputAngle
      const tracedInputAngleScalar =
        getDistanceBetweenPoints({
          pointA: loopPointA,
          pointB: tracedLoopPointBase,
        }) /
        getDistanceBetweenPoints({
          pointA: loopPointA,
          pointB: loopPointB,
        })
      const approximatedTracedLoopPointInputAngle =
        tracedInputAngleScalar * inputAngleDelta + loopPointA.inputAngle
      return [
        {
          ...tracedLoopPointBase,
          outputAngle: traceAngle,
          inputAngle: approximatedTracedLoopPointInputAngle,
        },
        traceIndexA,
      ]
    }
    pointsTraced = pointsTraced + 1
  }
  throw new Error('wtf? getTracedLoopPointData')
}
