import { getEuclideanRhythm } from './getEuclideanRhythm'
import {
  RootRhythmSkeleton,
  ContainerRhythmSkeleton,
  TerminalRhythmSkeleton,
} from './models'

interface GetRhythmApi {
  someRootRhythmSkeleton: RootRhythmSkeleton
}

function getRhythm(api: GetRhythmApi) {
  const { someRootRhythmSkeleton } = api
  const rhythmIndices = getRhythmSkeletonIndices({})
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
      break
    case 'terminalRhythmSkeleton':
      const terminalRhythmSkeletonBaseRhythm = getEuclideanRhythm({
        lhsCount: someRootRhythmSkeleton.containerSkeleton.skeletonDensity,
        rhsCount:
          someRootRhythmSkeleton.containerResolution -
          someRootRhythmSkeleton.containerSkeleton.skeletonDensity,
        lhsRhythm: [true],
        rhsRhythm: [false],
      })
      return terminalRhythmSkeletonBaseRhythm
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
  containerPhase: number
  skeletonDensity: number
  skeletonPhase: number
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
