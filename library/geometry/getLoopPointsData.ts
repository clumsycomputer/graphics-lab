import { getNormalizedAngleBetweenPoints } from './general'
import { GetLoopPointApi } from './getLoopPoint'
import { getNearestLoopPoint } from './getNearestLoopPoint'
import { LoopPoint, Point } from './models'

export interface GetLoopPointsApi
  extends Pick<GetLoopPointApi, 'someLoopStructure'> {
  sampleCount: number
}

export function getLoopPointsData(api: GetLoopPointsApi): {
  samplesCenter: Point
  samplePoints: Array<LoopPoint>
} {
  const { sampleCount, someLoopStructure } = api
  const samplePoints: Array<Point> = []
  const samplesCenter: Point = { x: 0, y: 0 }
  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
    const samplePoint = getNearestLoopPoint({
      someLoopStructure,
      pointAngle: 2 * Math.PI * (sampleIndex / sampleCount),
    })
    samplesCenter.x = samplesCenter.x + samplePoint.x
    samplesCenter.y = samplesCenter.y + samplePoint.y
    samplePoints.push(samplePoint)
  }
  samplesCenter.x = samplesCenter.x / samplePoints.length
  samplesCenter.y = samplesCenter.y / samplePoints.length
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
