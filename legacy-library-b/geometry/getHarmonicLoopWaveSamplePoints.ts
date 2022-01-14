import {
  getHarmonicLoopWaveSamplePointData,
  GetHarmonicLoopWaveSamplePointDataApi,
} from './getHarmonicLoopWaveSamplePointData'
import { Point } from './models'

export interface GetHarmonicLoopWaveSamplesApi
  extends Pick<
    GetHarmonicLoopWaveSamplePointDataApi,
    'someLoopPointsData' | 'harmonicDistribution'
  > {
  sampleCount: number
}

export function getHarmonicLoopWaveSamples(
  api: GetHarmonicLoopWaveSamplesApi
): Array<Point> {
  const { harmonicDistribution, sampleCount, someLoopPointsData } = api
  const harmonicLoopWaveSamplePoints: Array<Point> = []
  let startingTracePointIndices = harmonicDistribution.map(() => 0)
  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
    const [harmonicLoopWaveSamplePoint, nextStartingTracePointIndices] =
      getHarmonicLoopWaveSamplePointData({
        harmonicDistribution,
        someLoopPointsData,
        startingTracePointIndices,
        traceAngle: 2 * Math.PI * (sampleIndex / sampleCount),
      })
    harmonicLoopWaveSamplePoints.push(harmonicLoopWaveSamplePoint)
    startingTracePointIndices = nextStartingTracePointIndices
  }
  return harmonicLoopWaveSamplePoints
}
