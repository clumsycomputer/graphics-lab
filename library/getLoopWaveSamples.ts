import { getLoopPointsData } from './getLoopPointsData'
import { getTracePointData } from './getTracePointData'
import { Loop } from './models'

export interface GetLoopWaveSamplesApi {
  someLoop: Loop
  sampleCount: number
}

export function getLoopWaveSamples(api: GetLoopWaveSamplesApi) {
  const { someLoop, sampleCount } = api
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
  const loopPointsData = getLoopPointsData({
    sampleCount,
    someLoop: adjustedLoop,
  })
  return loopPointsData.samplePoints.map(
    (somePoint, sampleIndex) =>
      getTracePointData({
        someLoopPointsData: loopPointsData,
        traceAngle:
          2 * Math.PI * (sampleIndex / loopPointsData.samplePoints.length),
        startingTracePointIndex: 0,
      })[0].y - loopPointsData.samplesCenter.y
  )
}
