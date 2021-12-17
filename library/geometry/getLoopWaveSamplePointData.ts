import { getLoopPointsData } from './getLoopPointsData'
import { getTracePointData, GetTracePointDataApi } from './getTracePointData'
import { Point } from './models'

export interface GetLoopWaveSamplePointDataApi
  extends Pick<GetTracePointDataApi, 'traceAngle' | 'startingTracePointIndex'> {
  someLoopPointsData: ReturnType<typeof getLoopPointsData>
}

export function getLoopWaveSamplePointData(
  api: GetLoopWaveSamplePointDataApi
): [loopWaveSamplePoint: Point, tracePointIndex: number] {
  const { traceAngle, startingTracePointIndex, someLoopPointsData } = api
  const [loopWaveSamplePoint, tracePointIndex] = getTracePointData({
    someLoopPointsData,
    traceAngle,
    startingTracePointIndex,
  })
  return [
    {
      x: loopWaveSamplePoint.x - someLoopPointsData.samplesCenter.x,
      y: loopWaveSamplePoint.y - someLoopPointsData.samplesCenter.y,
    },
    tracePointIndex,
  ]
}
