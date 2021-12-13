import {
  getLoopWaveSampleData,
  GetLoopWaveSampleDataApi,
} from './getLoopWaveSampleData'

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
