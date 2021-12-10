import { getNormalizedAngle } from './general'
import { getLoopPoint, GetLoopPointApi } from './getLoopPoint'
import { Point } from './models/general'

export interface GetNearestLoopPointApi extends GetLoopPointApi {}

export function getNearestLoopPoint(api: GetNearestLoopPointApi): Point {
  const { someLoop, pointAngle } = api
  const someLoopPoint = getLoopPoint({ someLoop, pointAngle })
  if (someLoopPoint.x && someLoopPoint.y) {
    return someLoopPoint
  } else {
    return getNearestLoopPoint({
      someLoop,
      pointAngle: getNormalizedAngle({
        someAngle: pointAngle + 0.00000001,
      }),
    })
  }
}
