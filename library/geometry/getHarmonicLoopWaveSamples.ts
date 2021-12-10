import {
  getHarmonicLoopWaveSampleData,
  GetHarmonicLoopWaveSampleDataApi,
} from './getHarmonicLoopWaveSampleData'
import { getLoopPointsData } from './getLoopPointsData'
import { Loop } from './models/Loop'

export interface GetHarmonicLoopWaveSamplesApi
  extends Pick<GetHarmonicLoopWaveSampleDataApi, 'harmonicDistribution'> {
  someLoop: Loop
  sampleCount: number
}

export function getHarmonicLoopWaveSamples(
  api: GetHarmonicLoopWaveSamplesApi
): Array<number> {
  const { someLoop, sampleCount, harmonicDistribution } = api
  const adjustedLoop = {
    ...someLoop,
    baseCircle: {
      center: {
        x: 0,
        y: 0,
      },
      radius: 1,
    },
  }
  const someLoopPointsData = getLoopPointsData({
    sampleCount,
    someLoop: adjustedLoop,
  })
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
    // todo handle getTracePointData wrap around // startingTracePointIndices = nextStartingTracePointIndices
  }
  return harmonicLoopWaveSamples
}
