import { getLoopChildCircle } from './getLoopChildCircle'
import { CompositeLoop, Point } from './models'

export interface GetCompositeLoopCenterApi {
  someCompositeLoop: CompositeLoop
}

export function getCompositeLoopCenter(api: GetCompositeLoopCenterApi): Point {
  const { someCompositeLoop } = api
  const loopPartsChildCircles = someCompositeLoop.loopParts.map((someLoop) =>
    getLoopChildCircle({
      someLoop,
    })
  )
  const compositeLoopCenterVector = loopPartsChildCircles.reduce<
    [x: number, y: number]
  >(
    (result, someLoopChildCircle) => [
      result[0] + someLoopChildCircle.center.x,
      result[1] + someLoopChildCircle.center.y,
    ],
    [0, 0]
  )
  const compositeLoopCenter = {
    x: compositeLoopCenterVector[0] / someCompositeLoop.loopParts.length,
    y: compositeLoopCenterVector[1] / someCompositeLoop.loopParts.length,
  }
  return compositeLoopCenter
}
