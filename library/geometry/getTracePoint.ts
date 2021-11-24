import { BasedPoint, Point } from './models'

export interface GetTracePointApi {
  someTracerPoints: Array<BasedPoint>
  traceAngle: number
}

export function getTracePoint(api: GetTracePointApi): Point {
  const { someTracerPoints, traceAngle } = api
  return someTracerPoints.reduce<Point | null>(
    (result, someLoopTraceablePointA, loopPointIndex) => {
      if (result) {
        return result
      } else if (
        loopPointIndex < someTracerPoints.length - 1 &&
        someLoopTraceablePointA.baseAngle <= traceAngle &&
        someTracerPoints[loopPointIndex + 1]!.baseAngle >= traceAngle
      ) {
        const someLoopTraceablePointB = someTracerPoints[loopPointIndex + 1]!
        return {
          x: (someLoopTraceablePointA.x + someLoopTraceablePointB.x) / 2,
          y: (someLoopTraceablePointA.y + someLoopTraceablePointB.y) / 2,
        }
      } else if (loopPointIndex === someTracerPoints.length - 1) {
        const someLoopTraceablePointB = someTracerPoints[0]!
        return {
          x: (someLoopTraceablePointA.x + someLoopTraceablePointB.x) / 2,
          y: (someLoopTraceablePointA.y + someLoopTraceablePointB.y) / 2,
        }
      } else {
        return null
      }
    },
    null
  )!
}
