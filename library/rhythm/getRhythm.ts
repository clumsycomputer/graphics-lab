import { getEuclideanRhythm } from './getEuclideanRhythm'
import { Rhythm, RootRhythmSkeleton } from './models'

interface GetRhythmApi {
  someRootRhythmSkeleton: RootRhythmSkeleton
}

function getRhythm(api: GetRhythmApi) {
  const { someRootRhythmSkeleton } = api
  const rhythmIndices = getRhythmSkeletonIndices({})
  return rhythmIndices.reduce<Rhythm>((rhythmResult, someRhythm) => {
    return
  }, new Array(someRootRhythmSkeleton.containerResolution).fill(false))
}

interface GetRhythmSkeletonIndicesApi {
  someRootRhythmSkeleton: RootRhythmSkeleton
}

function getRhythmSkeletonIndices(
  api: GetRhythmSkeletonIndicesApi
): Array<number> {
  const { someRootRhythmSkeleton } = api
  switch (someRootRhythmSkeleton.containerSkeleton.rhythmType) {
    case 'containerRhythmSkeleton':
      const foo = getRhythmSkeletonIndices()
      return
    case 'terminalRhythmSkeleton':
      const baseTerminalSkeletonRhythm = getBaseSkeletonRhythm({
        containerResolution: someRootRhythmSkeleton.containerResolution,
        skeletonDensity:
          someRootRhythmSkeleton.containerSkeleton.skeletonDensity,
      })
      return baseTerminalSkeletonRhythm
        .reduce<Array<number>>(
          (
            baseSkeletonRhythmIndicesResult,
            someBaseRhythmCell,
            baseRhythmCellIndex
          ) => {
            if (someBaseRhythmCell) {
              baseSkeletonRhythmIndicesResult.push(baseRhythmCellIndex)
            }
            return baseSkeletonRhythmIndicesResult
          },
          []
        )
        .map(
          (
            someSkeletonRhythmIndex,
            someSkeletonIndex,
            baseSkeletonRhythmIndices
          ) => {
            return (
              (someSkeletonRhythmIndex +
                baseSkeletonRhythmIndices[
                  someRootRhythmSkeleton.containerSkeleton.skeletonPhase
                ]! +
                someRootRhythmSkeleton.containerPhase) %
              someRootRhythmSkeleton.containerResolution
            )
          }
        )
  }
}

interface GetBaseSkeletonRhythmApi {
  containerResolution: number
  skeletonDensity: number
}

function getBaseSkeletonRhythm(api: GetBaseSkeletonRhythmApi) {
  const { containerResolution, skeletonDensity } = api
  return getEuclideanRhythm({
    lhsCount: skeletonDensity,
    rhsCount: containerResolution - skeletonDensity,
    lhsRhythm: [true],
    rhsRhythm: [false],
  })
}
