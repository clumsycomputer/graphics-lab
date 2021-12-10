import { GetLoopWaveSampleDataApi } from '.'
import { getLoopPointsData } from './getLoopPointsData'
import { getLoopWaveSampleData } from './getLoopWaveSampleData'
import { Loop } from './models/Loop'

export interface GetLoopWaveSamplesApi
  extends Pick<GetLoopWaveSampleDataApi, 'someLoopPointsData'> {
  sampleCount: number
}

export function getLoopWaveSamples(api: GetLoopWaveSamplesApi) {
  const { someLoopPointsData, sampleCount } = api
  const loopWaveSamples = []
  let startingTracePointIndex = 0
  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
    const [newLoopWaveSample, nextStartingTraceIndex] = getLoopWaveSampleData({
      someLoopPointsData,
      startingTracePointIndex,
      traceAngle: 2 * Math.PI * (sampleIndex / sampleCount),
    })
    loopWaveSamples.push(newLoopWaveSample)
    startingTracePointIndex = nextStartingTraceIndex
  }
  return loopWaveSamples
}
