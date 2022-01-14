import { getNormalizedAngle } from './general'
import { getLoopPoint, GetLoopPointApi } from './getLoopPoint'
import { AsymPoint, Point } from './models'

export interface GetLoopPointsApi
  extends Pick<GetLoopPointApi, 'someLoopStructure'> {
  sampleCount: number
}

export function getLoopPointsData(api: GetLoopPointsApi): {
  loopCenter: Point
  loopPoints: Array<AsymPoint>
} {
  const { sampleCount, someLoopStructure } = api
  const loopPoints: Array<AsymPoint> = []
  const loopCenter: Point = [0, 0]
  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
    const inputAngle = 2 * Math.PI * (sampleIndex / sampleCount)
    const samplePoint = getNearestLoopPoint({
      someLoopStructure,
      pointAngle: inputAngle,
    })
    loopCenter[0] = loopCenter[0] + samplePoint[0]
    loopCenter[1] = loopCenter[1] + samplePoint[1]
    loopPoints.push([samplePoint[0], samplePoint[1], inputAngle])
  }
  loopCenter[0] = loopCenter[0] / loopPoints.length
  loopCenter[1] = loopCenter[1] / loopPoints.length
  return {
    loopCenter,
    loopPoints,
  }
}

interface GetNearestLoopPointApi extends GetLoopPointApi {}

function getNearestLoopPoint(api: GetNearestLoopPointApi): Point {
  const { someLoopStructure, pointAngle } = api
  const someLoopPoint = getLoopPoint({ someLoopStructure, pointAngle })
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
      pointAngle: getNormalizedAngle({
        someAngle: pointAngle + 0.00000001,
      }),
    })
  }
}
