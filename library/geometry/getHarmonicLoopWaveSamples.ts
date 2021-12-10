import {
  getHarmonicLoopWaveSampleData,
  GetHarmonicLoopWaveSampleDataApi,
} from './getHarmonicLoopWaveSampleData'

export interface GetHarmonicLoopWaveSamplesApi
  extends Pick<
    GetHarmonicLoopWaveSampleDataApi,
    'someLoopPointsData' | 'harmonicDistribution'
  > {
  sampleCount: number
}

export function getHarmonicLoopWaveSamples(
  api: GetHarmonicLoopWaveSamplesApi
): Array<number> {
  const { harmonicDistribution, sampleCount, someLoopPointsData } = api
  const harmonicLoopWaveSamples: Array<number> = []
  let startingTracePointIndices = harmonicDistribution.map(() => 0)
  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
    const [harmonicLoopWaveSample, nextStartingTracePointIndices] =
      getHarmonicLoopWaveSampleData({
        harmonicDistribution,
        someLoopPointsData,
        startingTracePointIndices,
        traceAngle: 2 * Math.PI * (sampleIndex / sampleCount),
      })
    harmonicLoopWaveSamples.push(harmonicLoopWaveSample)
    startingTracePointIndices = nextStartingTracePointIndices
  }
  return harmonicLoopWaveSamples
}
