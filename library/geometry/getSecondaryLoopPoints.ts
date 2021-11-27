import {
  getDistanceBetweenPoints,
  getNormalizedAngleBetweenPoints,
} from './general'
import { getCompositeLoopCircles } from './getCompositeLoopCircles'
import { getCompositeLoopPoints } from './getCompositeLoopPoints'
import { getLoopBaseCirclePointBase } from './getLoopPoint'
import { getTracePointData } from './getTracePointData'
import { BasedPoint, CompositeLoop, Point } from './models'

export interface GetSecondaryPointsApi {
  someCompositeLoop: CompositeLoop
  sampleCount: number
}

export function getSecondaryLoopPoints(
  api: GetSecondaryPointsApi
): Array<BasedPoint> {
  const { sampleCount, someCompositeLoop } = api
  const primaryLoopPoints = getCompositeLoopPoints({
    sampleCount,
    someCompositeLoop,
  })
  const [baseCircle, childCircle] = getCompositeLoopCircles({
    someCompositeLoop,
  })
  let startingTraceIndex = 0
  let secondaryLoopPoints: Array<BasedPoint> = []
  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
    const sampleAngle = ((2 * Math.PI) / sampleCount) * sampleIndex
    const [primaryLoopPoint, traceIndex] = getTracePointData({
      startingTraceIndex,
      someBasedPoints: primaryLoopPoints,
      traceAngle: sampleAngle,
    })
    startingTraceIndex = traceIndex
    const basePoint = getLoopBaseCirclePointBase({
      baseCircle,
      childCenter: childCircle.center,
      childPoint: primaryLoopPoint,
    })
    const secondaryLoopPoint: Point = {
      x: primaryLoopPoint.x,
      y: basePoint.y,
    }
    secondaryLoopPoints.push({
      ...secondaryLoopPoint,
      basePoint: childCircle.center,
      baseAngle: getNormalizedAngleBetweenPoints({
        basePoint: childCircle.center,
        targetPoint: secondaryLoopPoint,
      }),
      baseDistance: getDistanceBetweenPoints({
        pointA: childCircle.center,
        pointB: secondaryLoopPoint,
      }),
    })
  }
  return secondaryLoopPoints
}
