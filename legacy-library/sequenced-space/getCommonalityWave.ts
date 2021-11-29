import { getElementIndices, getPhasedSpace } from './general'
import { getAccumulatedWave } from './getAccumulatedWave'
import { DiscreteRhythm, DiscreteWave } from './models'

export interface GetCommonalityWaveApi {
  baseRhythm: DiscreteRhythm
}

export function getCommonalityWave(api: GetCommonalityWaveApi): DiscreteWave {
  const { baseRhythm } = api
  const rhythmAnchors = getElementIndices({
    someSpace: baseRhythm,
    targetValue: true,
  })
  return getAccumulatedWave({
    rhythmParts: rhythmAnchors.map((someRhythmAnchor) =>
      getPhasedSpace({
        baseSpace: baseRhythm,
        spacePhase: someRhythmAnchor,
      })
    ),
  })
}
