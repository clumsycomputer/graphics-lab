import { getNormalizedAngleBetweenPoints } from './general'
import { getCompositeLoopCenter } from './getCompositeLoopCenter'
import { getLoopChildCircle } from './getLoopChildCircle'
import { getLoopPoints } from './getLoopPoints'
import { BasedPoint, ChildCircle, CompositeLoop } from './models'

export interface GetCompositeLoopPointsApi {
  someCompositeLoop: CompositeLoop
  sampleCount: number
}

export function getCompositeLoopPoints(
  api: GetCompositeLoopPointsApi
): Array<BasedPoint> {
  const { someCompositeLoop, sampleCount } = api
  const compositeLoopCenter = getCompositeLoopCenter({
    someCompositeLoop,
  })
  const { loopPartsChildCircles, loopPartsPoints, traceStartIndices } =
    someCompositeLoop.loopParts.reduce<{
      loopPartsChildCircles: Array<ChildCircle>
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
          const { firstPointIndex } = getFirstPointIndex({
            sampleAngle,
            someLoopPoints,
            traceStartIndex: traceStartIndices[partIndex]!,
          })
          traceStartIndices[partIndex] = firstPointIndex
          const pointA = someLoopPoints[firstPointIndex]!
          const pointB =
            someLoopPoints[(firstPointIndex + 1) % someLoopPoints.length]!
          // const baseLine = [pointA, pointB]
          // const targetLine = [
          //   loopPartsChildCircles[partIndex].center,
          //   {
          //     x:
          //       1000000 * Math.cos(sampleAngle) +
          //       loopPartsChildCircles[partIndex].center.x,
          //     y:
          //       1000000 * Math.sin(sampleAngle) +
          //       loopPartsChildCircles[partIndex].center.y,
          //   },
          // ]
          // const intersectionScalar =
          //   ((targetLine[1].x - targetLine[0].x) *
          //     (baseLine[0].y - targetLine[0].y) -
          //     (targetLine[1].y - targetLine[0].y) *
          //       (baseLine[0].x - targetLine[0].x)) /
          //   ((targetLine[1].y - targetLine[0].y) *
          //     (baseLine[1].x - baseLine[0].x) -
          //     (targetLine[1].x - targetLine[0].x) *
          //       (baseLine[1].y - baseLine[0].y))
          // const intersectionPoint = {
          //   x:
          //     baseLine[0].x +
          //     intersectionScalar * (baseLine[1].x - baseLine[0].x),
          //   y:
          //     baseLine[0].y +
          //     intersectionScalar * (baseLine[1].y - baseLine[0].y),
          // }
          const intersectionPoint = {
            x: (pointA.x + pointB.x) / 2,
            y: (pointA.y + pointB.y) / 2,
          }
          const partVector = [
            intersectionPoint.x - loopPartsChildCircles[partIndex]!.center.x,
            intersectionPoint.y - loopPartsChildCircles[partIndex]!.center.y,
          ]
          return [partVector[0]! + result[0], partVector[1]! + result[1]]
        },
        [0, 0]
      )
      const samplePointBase = {
        x:
          samplePointVector[0] / someCompositeLoop.loopParts.length +
          compositeLoopCenter.x,
        y:
          samplePointVector[1] / someCompositeLoop.loopParts.length +
          compositeLoopCenter.y,
      }
      return {
        ...samplePointBase,
        basePoint: compositeLoopCenter,
        baseAngle: getNormalizedAngleBetweenPoints({
          targetPoint: samplePointBase,
          basePoint: compositeLoopCenter,
        }),
        baseDistance: Math.sqrt(
          Math.pow(
            samplePointVector[0] / someCompositeLoop.loopParts.length,
            2
          ) +
            Math.pow(
              samplePointVector[1] / someCompositeLoop.loopParts.length,
              2
            )
        ),
      }
    })
}

interface GetFirstPointIndexApi {
  sampleAngle: number
  someLoopPoints: Array<BasedPoint>
  traceStartIndex: number
}

function getFirstPointIndex(api: GetFirstPointIndexApi) {
  const { traceStartIndex, someLoopPoints, sampleAngle } = api
  let traceIndex = traceStartIndex
  while (true) {
    const angleA = someLoopPoints[traceIndex]!.baseAngle
    if (
      traceIndex < someLoopPoints.length - 1 &&
      angleA <= sampleAngle &&
      someLoopPoints[traceIndex + 1]!.baseAngle >= sampleAngle
    ) {
      return {
        firstPointIndex: traceIndex,
      }
    } else if (traceIndex === someLoopPoints.length - 1) {
      return {
        firstPointIndex: traceIndex,
      }
    } else if (sampleAngle < angleA) {
      return {
        firstPointIndex: traceIndex,
      }
    } else {
      traceIndex = traceIndex + 1
    }
  }
}
