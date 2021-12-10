import { getLoopPointsData } from './getLoopPointsData'
import { getLoopWaveSampleData } from './getLoopWaveSampleData'
import { Loop } from './models/Loop'

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
  const someLoopPointsData = getLoopPointsData({
    sampleCount,
    someLoop: adjustedLoop,
  })
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
