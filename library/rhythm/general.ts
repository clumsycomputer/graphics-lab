import { RhythmMap } from './models'

export interface GetRangedRhythmValuesApi {
  someRhythmMap: RhythmMap
  someNumberRange: {
    startValue: number
    targetValue: number
  }
}

export function getRangedRhythmValues(
  api: GetRangedRhythmValuesApi
): Array<number> {
  const { someNumberRange, someRhythmMap } = api
  const rangeVector = someNumberRange.targetValue - someNumberRange.startValue
  const rangeValueStep = rangeVector / someRhythmMap.rhythmResolution
  return someRhythmMap.rhythmSkeleton.map(
    (someRhythmBone) =>
      someRhythmBone * rangeValueStep + someNumberRange.startValue
  )
}
