import {
  getLoopWaveSamplePointData,
  GetLoopWaveSamplePointDataApi,
} from './getLoopWaveSamplePointData'
import { Point } from './models'

export interface GetLoopWaveSamplesApi
  extends Pick<GetLoopWaveSamplePointDataApi, 'someLoopPointsData'> {
  sampleCount: number
}

export function getLoopWaveSamplePoints(
  api: GetLoopWaveSamplesApi
): Array<Point> {
  const { someLoopPointsData, sampleCount } = api
  const loopWaveSamplePoints = []
  let startingTracePointIndex = 0
  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
    const [newLoopWaveSamplePoint, nextStartingTraceIndex] =
      getLoopWaveSamplePointData({
        someLoopPointsData,
        startingTracePointIndex,
        traceAngle: 2 * Math.PI * (sampleIndex / sampleCount),
      })
    loopWaveSamplePoints.push(newLoopWaveSamplePoint)
    startingTracePointIndex = nextStartingTraceIndex
  }
  return loopWaveSamplePoints
}
