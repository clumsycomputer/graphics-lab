import { getRhythmStructuresData } from './getRhythmStructuresData'
import { RhythmMap, RhythmStructure } from './models'

export interface GetStructuredRhythmMapApi {
  someRhythmStructure: RhythmStructure
}

export function getStructuredRhythmMap(
  api: GetStructuredRhythmMapApi
): RhythmMap {
  const { someRhythmStructure } = api
  const rhythmStructuresData = getRhythmStructuresData({
    someRhythmStructure,
  })
  return {
    rhythmResolution: someRhythmStructure.rhythmResolution,
    rhythmPoints: rhythmStructuresData[0]!.structurePoints,
  }
}
