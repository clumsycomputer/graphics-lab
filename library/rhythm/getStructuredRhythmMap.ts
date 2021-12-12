import { getRhythmSkeletonLayersData } from './getRhythmSkeletonLayersData'
import { RhythmMap, RhythmStructure } from './models'

export interface GetStructuredRhythmMapApi {
  someRhythmStructure: RhythmStructure
}

export function getStructuredRhythmMap(
  api: GetStructuredRhythmMapApi
): RhythmMap {
  const { someRhythmStructure } = api
  const rhythmSkeletonLayersData = getRhythmSkeletonLayersData({
    someRhythmStructure,
  })
  return {
    rhythmResolution: someRhythmStructure.containerResolution,
    rhythmSkeleton: rhythmSkeletonLayersData[0]!.layerSkeleton,
  }
}
