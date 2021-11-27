import {
  getDistanceBetweenPoints,
  getNormalizedAngleBetweenPoints,
} from './general'
import { getCompositeLoopCircles } from './getCompositeLoopCircles'
import { getLoopChildCircle } from './getLoopChildCircle'
import { getLoopPoints } from './getLoopPoints'
import { getTracePointData } from './getTracePointData'
import { BasedPoint, Circle, CompositeLoop } from './models'

export interface GetCompositeLoopPointsApi {
  someCompositeLoop: CompositeLoop
  sampleCount: number
}

export function getCompositeLoopPoints(
  api: GetCompositeLoopPointsApi
): Array<BasedPoint> {
  const { someCompositeLoop, sampleCount } = api
  const [_, compositeLoopChildCircle] = getCompositeLoopCircles({
    someCompositeLoop,
  })
  const { loopPartsChildCircles, loopPartsPoints, traceStartIndices } =
    someCompositeLoop.loopParts.reduce<{
      loopPartsChildCircles: Array<Circle>
      loopPartsPoints: Array<Array<BasedPoint>>
      traceStartIndices: Array<number>
    }>(
      (result, someLoop) => {
        result.loopPartsChildCircles.push(
          getLoopChildCircle({
            someLoop,
          })
        )
        result.loopPartsPoints.push(
          getLoopPoints({
            sampleCount,
            someLoop,
          })
        )
        result.traceStartIndices.push(0)
        return result
      },
      {
        loopPartsChildCircles: [],
        loopPartsPoints: [],
        traceStartIndices: [],
      }
    )
  return new Array(sampleCount)
    .fill(undefined)
    .map<BasedPoint>((_, sampleIndex) => {
      const sampleAngle = ((2 * Math.PI) / sampleCount) * sampleIndex
      const samplePointVector = loopPartsPoints.reduce<[x: number, y: number]>(
        (result, someLoopPoints, partIndex) => {
          const [tracePoint, traceIndex] = getTracePointData({
            traceAngle: sampleAngle,
            someBasedPoints: someLoopPoints,
            startingTraceIndex: traceStartIndices[partIndex]!,
          })
          traceStartIndices[partIndex] = traceIndex
          const traceVector = [
            tracePoint.x - loopPartsChildCircles[partIndex]!.center.x,
            tracePoint.y - loopPartsChildCircles[partIndex]!.center.y,
          ]
          return [traceVector[0]! + result[0], traceVector[1]! + result[1]]
        },
        [0, 0]
      )
      const samplePointBase = {
        x:
          samplePointVector[0] / someCompositeLoop.loopParts.length +
          compositeLoopChildCircle.center.x,
        y:
          samplePointVector[1] / someCompositeLoop.loopParts.length +
          compositeLoopChildCircle.center.y,
      }
      return {
        ...samplePointBase,
        basePoint: compositeLoopChildCircle.center,
        baseAngle: getNormalizedAngleBetweenPoints({
          targetPoint: samplePointBase,
          basePoint: compositeLoopChildCircle.center,
        }),
        baseDistance: getDistanceBetweenPoints({
          pointA: compositeLoopChildCircle.center,
          pointB: samplePointBase,
        }),
      }
    })
}
