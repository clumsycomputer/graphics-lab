import { getLoopPointsData } from './getLoopPointsData'
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
  const adjustedLoopPointsData = getLoopPointsData({
    sampleCount,
    someLoop: adjustedLoop,
  })
  return adjustedLoopPointsData.samplePoints.map(
    (somePoint) => somePoint.y - adjustedLoopPointsData.samplesCenter.y
  )
}
