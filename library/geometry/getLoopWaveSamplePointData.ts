import { getLoopPointsData } from './getLoopPointsData'
import {
  getTracedLoopPointData,
  GetTracedLoopPointDataApi,
} from './getTracedLoopPointData'
import { LoopPoint } from './models'

export interface GetLoopWaveSamplePointDataApi
  extends Pick<
    GetTracedLoopPointDataApi,
    'traceAngle' | 'startingTracePointIndex'
  > {
  someLoopPointsData: ReturnType<typeof getLoopPointsData>
}

export function getLoopWaveSamplePointData(
  api: GetLoopWaveSamplePointDataApi
): [loopWaveSamplePoint: LoopPoint, tracePointIndex: number] {
  const { traceAngle, startingTracePointIndex, someLoopPointsData } = api
  const [loopWaveSamplePoint, tracePointIndex] = getTracedLoopPointData({
    someLoopPointsData,
    traceAngle,
    startingTracePointIndex,
  })
  return [
    {
      ...loopWaveSamplePoint,
      x: loopWaveSamplePoint.x - someLoopPointsData.loopCenter.x,
      y: loopWaveSamplePoint.y - someLoopPointsData.loopCenter.y,
    },
    tracePointIndex,
  ]
}
