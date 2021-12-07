import { getNormalizedAngleBetweenPoints } from './general'
import { getLoopPoint } from './getLoopPoint'
import { Loop, LoopPoint, Point } from './models'

export interface GetLoopPointsApi {
  someLoop: Loop
  sampleCount: number
}

export function getLoopPointsData(api: GetLoopPointsApi): {
  samplesCenter: Point
  samplePoints: Array<LoopPoint>
} {
  const { sampleCount, someLoop } = api
  const samplePoints: Array<Point> = []
  const samplesCenter: Point = { x: 0, y: 0 }
  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
    const samplePoint = getLoopPoint({
      someLoop,
      pointAngle: getAdjustedSampleAngle({
        sampleAngle: 2 * Math.PI * (sampleIndex / sampleCount),
      }),
    })
    samplesCenter.x = samplesCenter.x + samplePoint.x
    samplesCenter.y = samplesCenter.y + samplePoint.y
    samplePoints.push(samplePoint)
  }
  samplesCenter.x = samplesCenter.x / sampleCount
  samplesCenter.y = samplesCenter.y / sampleCount
  return {
    samplesCenter,
    samplePoints: (samplePoints as Array<LoopPoint>).sort((pointA, pointB) => {
      if (!pointA.centerAngle) {
        pointA.centerAngle = getNormalizedAngleBetweenPoints({
          basePoint: samplesCenter,
          targetPoint: pointA,
        })
      }
      if (!pointB.centerAngle) {
        pointB.centerAngle = getNormalizedAngleBetweenPoints({
          basePoint: samplesCenter,
          targetPoint: pointB,
        })
      }
      return pointA.centerAngle - pointB.centerAngle
    }),
  }
}

interface GetAdjustedSampleAngleApi {
  sampleAngle: number
}

function getAdjustedSampleAngle(api: GetAdjustedSampleAngleApi) {
  const { sampleAngle } = api
  return sampleAngle + 0.000001
  //   const positiveSampleAngle =
  //     ((sampleAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
  //   return (positiveSampleAngle === 0 &&
  //     positiveSampleAngle === (2 * Math.PI) / 4) ||
  //     positiveSampleAngle === ((2 * Math.PI) / 4) * 3 ||
  //     positiveSampleAngle === 2 * Math.PI
  //     ? positiveSampleAngle + 0.000001
  //     : positiveSampleAngle
}
