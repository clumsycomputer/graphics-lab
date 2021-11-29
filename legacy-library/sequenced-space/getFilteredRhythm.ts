import { getElementIndices } from './general'
import { DiscreteRhythm } from './models'

export interface GetFilteredRhythmApi {
  rhythmSequence: Array<DiscreteRhythm>
}

export function getFilteredRhythm(api: GetFilteredRhythmApi): DiscreteRhythm {
  const { rhythmSequence } = api
  const baseRhythmLength = rhythmSequence[0]?.length
  if (baseRhythmLength) {
    const baseRhythmAnchors = rhythmSequence.reduce(
      (remainingRhythmsAnchors, currentRhythm) => {
        const currentRhythmAnchors = getElementIndices({
          someSpace: currentRhythm,
          targetValue: true,
        })
        return currentRhythmAnchors.map(
          (someRhythmAnchor) => remainingRhythmsAnchors[someRhythmAnchor]!
        )
      },
      new Array(baseRhythmLength)
        .fill(undefined)
        .map((_, cellIndex) => cellIndex)
    )
    return baseRhythmAnchors.reduce<DiscreteRhythm>(
      (result, someRhythmAnchor) => {
        result[someRhythmAnchor] = true
        return result
      },
      new Array(baseRhythmLength).fill(false)
    )
  } else {
    throw new Error('wtf? getFilteredRhythm')
  }
}
