import { getLoopChildCircle } from './getLoopChildCircle'
import { Circle, CompositeLoop } from './models'

export interface GetCompositeLoopChildCircleApi {
  someCompositeLoop: CompositeLoop
}

export function getCompositeLoopCircles(
  api: GetCompositeLoopChildCircleApi
): [Circle, Circle] {
  const { someCompositeLoop } = api
  const loopPartsCount = someCompositeLoop.loopParts.length
  const compositeLoopCircles = someCompositeLoop.loopParts.reduce<{
    baseCircle: Circle
    childCircle: Circle
  }>(
    (result, someLoopPart, loopPartIndex) => {
      const someLoopPartChildCircle = getLoopChildCircle({
        someLoop: someLoopPart,
      })
      const nextResult = {
        baseCircle: {
          center: {
            x: result.baseCircle.center.x + someLoopPart.baseCircle.center.x,
            y: result.baseCircle.center.y + someLoopPart.baseCircle.center.y,
          },
          radius: result.baseCircle.radius + someLoopPart.baseCircle.radius,
        },
        childCircle: {
          center: {
            x: result.childCircle.center.x + someLoopPartChildCircle.center.x,
            y: result.childCircle.center.y + someLoopPartChildCircle.center.y,
          },
          radius: result.childCircle.radius + someLoopPartChildCircle.radius,
        },
      }
      if (loopPartIndex === loopPartsCount - 1) {
        nextResult.baseCircle.center.x =
          nextResult.baseCircle.center.x / loopPartsCount
        nextResult.baseCircle.center.y =
          nextResult.baseCircle.center.y / loopPartsCount
        nextResult.baseCircle.radius =
          nextResult.baseCircle.radius / loopPartsCount
        nextResult.childCircle.center.x =
          nextResult.childCircle.center.x / loopPartsCount
        nextResult.childCircle.center.y =
          nextResult.childCircle.center.y / loopPartsCount
        nextResult.childCircle.radius =
          nextResult.childCircle.radius / loopPartsCount
      }
      return nextResult
    },
    {
      baseCircle: {
        center: { x: 0, y: 0 },
        radius: 0,
      },
      childCircle: {
        center: { x: 0, y: 0 },
        radius: 0,
      },
    }
  )
  return [compositeLoopCircles.baseCircle, compositeLoopCircles.childCircle]
}
