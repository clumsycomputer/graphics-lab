import { getLoopPointsData } from './getLoopPointsData'
import { getLoopWaveSample } from './getLoopWaveSample'
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
  return loopPointsData.samplePoints.map((_, sampleIndex) =>
    getLoopWaveSample({
      someLoopPointsData: loopPointsData,
      sampleAngle:
        2 * Math.PI * (sampleIndex / loopPointsData.samplePoints.length),
    })
  )
}
