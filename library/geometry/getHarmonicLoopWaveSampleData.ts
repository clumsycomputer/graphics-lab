import { getNormalizedAngle } from './general'
import {
  getLoopWaveSampleData,
  GetLoopWaveSampleDataApi,
} from './getLoopWaveSampleData'

export interface GetHarmonicLoopWaveSampleDataApi
  extends Pick<GetLoopWaveSampleDataApi, 'someLoopPointsData' | 'traceAngle'> {
  harmonicDistribution: Array<number>
  startingTracePointIndices: Array<ReturnType<typeof getLoopWaveSampleData>[1]>
}

export function getHarmonicLoopWaveSampleData(
  api: GetHarmonicLoopWaveSampleDataApi
): [harmonicLoopWaveSample: number, harmonicTracePointIndices: Array<number>] {
  const {
    harmonicDistribution,
    someLoopPointsData,
    startingTracePointIndices,
    traceAngle,
  } = api
  return harmonicDistribution.reduce<[number, Array<number>]>(
    (result, currentHarmonicWeight, harmonicIndex) => {
      const [currentLoopWaveSample, currentLoopWaveSampleTraceIndex] =
        getLoopWaveSampleData({
          someLoopPointsData,
          startingTracePointIndex: startingTracePointIndices[harmonicIndex]!,
          traceAngle: getNormalizedAngle({
            someAngle: Math.pow(2, harmonicIndex) * traceAngle,
          }),
        })
      return [
        currentHarmonicWeight * currentLoopWaveSample + result[0],
        [...result[1], currentLoopWaveSampleTraceIndex],
      ]
    },
    [0, []]
  )
}