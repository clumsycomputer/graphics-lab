import { getDistanceBetweenPoints } from '@library/general'
import { Point } from '@library/models'
import { getLoopPointsData } from './getLoopPointsData'
import { getTracedLoopPointData } from './getTracedLoopPointData'

export interface GetOscillatedLoopPointsApi {
  sampleCount: number
  someLoopPointsData: ReturnType<typeof getLoopPointsData>
  getPointOscillationDelta: (
    sampleAngle: number,
    basePointRadius: number
  ) => number
}

export function getOscillatedLoopPoints(
  api: GetOscillatedLoopPointsApi
): Array<Point> {
  const { sampleCount, someLoopPointsData, getPointOscillationDelta } = api
  const oscillatedLoopPointsResult: Array<Point> = []
  let startingTracePointIndex = 0
  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
    const sampleAngle = 2 * Math.PI * (sampleIndex / sampleCount)
    const [basePoint, nextStartingTracePointIndex] = getTracedLoopPointData({
      someLoopPointsData,
      startingTracePointIndex,
      traceAngle: sampleAngle,
    })
    const basePointRadius = getDistanceBetweenPoints({
      pointA: someLoopPointsData.loopCenter,
      pointB: basePoint as unknown as Point,
    })
    const pointOscillationDelta = getPointOscillationDelta(
      sampleAngle,
      basePointRadius
    )
    const oscillatedPointRadius = basePointRadius + pointOscillationDelta
    oscillatedLoopPointsResult.push([
      oscillatedPointRadius * Math.cos(sampleAngle) +
        someLoopPointsData.loopCenter[0],
      oscillatedPointRadius * Math.sin(sampleAngle) +
        someLoopPointsData.loopCenter[1],
    ])
    startingTracePointIndex = nextStartingTracePointIndex
  }
  return oscillatedLoopPointsResult
}
