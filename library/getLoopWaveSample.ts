import { getLoopPointsData } from './getLoopPointsData'
import { getTracePointData } from './getTracePointData'

export interface GetLoopWaveSampleApi {
  someLoopPointsData: ReturnType<typeof getLoopPointsData>
  sampleAngle: number
}

export function getLoopWaveSample(api: GetLoopWaveSampleApi) {
  const { someLoopPointsData, sampleAngle } = api
  return (
    getTracePointData({
      someLoopPointsData: someLoopPointsData,
      traceAngle: sampleAngle,
      startingTracePointIndex: 0,
    })[0].y - someLoopPointsData.samplesCenter.y
  )
}
