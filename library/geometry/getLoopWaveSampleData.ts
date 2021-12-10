import { getLoopPointsData } from './getLoopPointsData'
import { getTracePointData, GetTracePointDataApi } from './getTracePointData'

export interface GetLoopWaveSampleDataApi
  extends Pick<GetTracePointDataApi, 'traceAngle' | 'startingTracePointIndex'> {
  someLoopPointsData: ReturnType<typeof getLoopPointsData>
}

export function getLoopWaveSampleData(
  api: GetLoopWaveSampleDataApi
): [loopWaveSample: number, tracePointIndex: number] {
  const { traceAngle, startingTracePointIndex, someLoopPointsData } = api
  const [loopWaveSamplePoint, tracePointIndex] = getTracePointData({
    traceAngle,
    startingTracePointIndex,
    someLoopPointsData: someLoopPointsData,
  })
  return [
    loopWaveSamplePoint.y - someLoopPointsData.samplesCenter.y,
    tracePointIndex,
  ]
}
