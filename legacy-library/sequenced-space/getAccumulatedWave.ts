import { DiscreteRhythm, DiscreteWave } from './models'

export interface GetAccumulatedWaveApi {
  rhythmParts: Array<DiscreteRhythm>
}

export function getAccumulatedWave(api: GetAccumulatedWaveApi): DiscreteWave {
  const { rhythmParts } = api
  const waveLength = rhythmParts[0]?.length
  if (waveLength) {
    return rhythmParts.reduce((result, someRhythm) => {
      someRhythm.forEach((someCellValue, cellIndex) => {
        if (someCellValue) {
          result[cellIndex] += 1
        }
      })
      return result
    }, new Array(waveLength).fill(0))
  } else {
    throw new Error('wtf? getAccumulatedWave')
  }
}
