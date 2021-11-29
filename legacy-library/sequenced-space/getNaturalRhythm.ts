import { getPhasedSpace } from './general'
import { getEuclideanRhythm } from './getEuclideanRhythm'
import { DiscreteRhythm } from './models'

export interface GetNaturalRhythmApi {
  rhythmResolution: number
  rhythmDensity: number
  rhythmPhase: number
}

export function getNaturalRhythm(api: GetNaturalRhythmApi): DiscreteRhythm {
  const { rhythmDensity, rhythmResolution, rhythmPhase } = api
  return getPhasedSpace({
    baseSpace: getEuclideanRhythm({
      lhsCount: rhythmDensity,
      rhsCount: rhythmResolution - rhythmDensity,
      lhsRhythm: [true],
      rhsRhythm: [false],
    }),
    spacePhase: rhythmPhase,
  })
}
