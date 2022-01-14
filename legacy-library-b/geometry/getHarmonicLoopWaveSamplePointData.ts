import { getNormalizedAngle } from './general'
import {
  getLoopWaveSamplePointData,
  GetLoopWaveSamplePointDataApi,
} from './getLoopWaveSamplePointData'
import { Point } from './models'

export interface GetHarmonicLoopWaveSamplePointDataApi
  extends Pick<
    GetLoopWaveSamplePointDataApi,
    'someLoopPointsData' | 'traceAngle'
  > {
  harmonicDistribution: Array<number>
  startingTracePointIndices: Array<
    ReturnType<typeof getLoopWaveSamplePointData>[1]
  >
}

export function getHarmonicLoopWaveSamplePointData(
  api: GetHarmonicLoopWaveSamplePointDataApi
): [
  harmonicLoopWaveSamplePoint: Point,
  harmonicTracePointIndices: Array<number>
] {
  const {
    harmonicDistribution,
    someLoopPointsData,
    startingTracePointIndices,
    traceAngle,
  } = api
  return harmonicDistribution.reduce<[Point, Array<number>]>(
    (result, currentHarmonicWeight, harmonicIndex) => {
      const [currentLoopWaveSamplePoint, currentLoopWaveSampleTraceIndex] =
        getLoopWaveSamplePointData({
          someLoopPointsData,
          startingTracePointIndex: startingTracePointIndices[harmonicIndex]!,
          traceAngle: getNormalizedAngle({
            someAngle: Math.pow(2, harmonicIndex) * traceAngle,
          }),
        })
      return [
        {
          x: currentHarmonicWeight * currentLoopWaveSamplePoint.x + result[0].x,
          y: currentHarmonicWeight * currentLoopWaveSamplePoint.y + result[0].y,
        },
        [...result[1], currentLoopWaveSampleTraceIndex],
      ]
    },
    [{ x: 0, y: 0 }, []]
  )
}
