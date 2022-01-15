import { getNormalizedAngle, getNormalizedAngleBetweenPoints } from '../general'
import { getLoopPoint, GetLoopPointApi } from './getLoopPoint'
import { AsymPoint, Point } from '../models'

export interface GetLoopPointsApi
  extends Pick<GetLoopPointApi, 'someLoopStructure'> {
  sampleCount: number
}

export function getLoopPointsData(api: GetLoopPointsApi): {
  loopCenter: Point
  loopPoints: Array<AsymPoint>
} {
  const { sampleCount, someLoopStructure } = api
  const loopPoints: Array<[x: number, y: number, inputAngle: number]> = []
  const loopCenter: Point = [0, 0]
  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
    const inputAngle = 2 * Math.PI * (sampleIndex / sampleCount)
    const samplePoint = getNearestLoopPoint({
      someLoopStructure,
      inputAngle,
    })
    loopPoints.push([samplePoint[0], samplePoint[1], inputAngle])
    loopCenter[0] = loopCenter[0] + samplePoint[0]
    loopCenter[1] = loopCenter[1] + samplePoint[1]
  }
  loopCenter[0] = loopCenter[0] / loopPoints.length
  loopCenter[1] = loopCenter[1] / loopPoints.length
  return {
    loopCenter,
    loopPoints: (loopPoints as unknown as Array<AsymPoint>).sort(
      (pointA, pointB) => {
        if (!pointA[3]) {
          pointA.push(
            getNormalizedAngleBetweenPoints({
              basePoint: loopCenter,
              targetPoint: pointA as unknown as Point,
            })
          )
        }
        if (!pointB[3]) {
          pointB.push(
            getNormalizedAngleBetweenPoints({
              basePoint: loopCenter,
              targetPoint: pointB as unknown as Point,
            })
          )
        }
        return pointA[3] - pointB[3]
      }
    ),
  }
}

interface GetNearestLoopPointApi extends GetLoopPointApi {}

function getNearestLoopPoint(api: GetNearestLoopPointApi): Point {
  const { someLoopStructure, inputAngle } = api
  const someLoopPoint = getLoopPoint({ someLoopStructure, inputAngle })
  if (
    someLoopPoint[0] &&
    someLoopPoint[1] &&
    someLoopPoint[0] !== someLoopStructure.loopBase.center[0] &&
    someLoopPoint[1] !== someLoopStructure.loopBase.center[1]
  ) {
    return someLoopPoint
  } else {
    return getNearestLoopPoint({
      someLoopStructure,
      inputAngle: getNormalizedAngle({
        someAngle: inputAngle + 0.00000001,
      }),
    })
  }
}
