import { getPhasedSpace } from './general'
import { getFilteredRhythm } from './getFilteredRhythm'
import { getNaturalRhythm, GetNaturalRhythmApi } from './getNaturalRhythm'

export interface GetNaturalCompositeRhythmApi
  extends Pick<GetNaturalRhythmApi, 'rhythmResolution' | 'rhythmPhase'> {
  rhythmParts: Array<Pick<GetNaturalRhythmApi, 'rhythmDensity' | 'rhythmPhase'>>
}

export function getNaturalCompositeRhythm(api: GetNaturalCompositeRhythmApi) {
  const { rhythmResolution, rhythmParts, rhythmPhase } = api
  return getPhasedSpace({
    baseSpace: getFilteredRhythm({
      rhythmSequence: rhythmParts.map((someRhythmPart, rhythmIndex) =>
        getNaturalRhythm({
          ...someRhythmPart,
          rhythmResolution:
            rhythmIndex === 0
              ? rhythmResolution
              : rhythmParts[rhythmIndex - 1]!.rhythmDensity,
        })
      ),
    }),
    spacePhase: rhythmPhase,
  })
}
