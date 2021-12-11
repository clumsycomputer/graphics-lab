import { RhythmStructure } from './models'
import { getEuclideanRhythm } from './getEuclideanRhythm'

export interface GetRhythmSkeletonBonesTableApi {
  someRhythmStructure: RhythmStructure
  skeletonBonesTableResult?: Array<
    [rootBones: Array<number>, layerBones: Array<number>]
  >
}

export function getRhythmSkeletonBonesTable(
  api: GetRhythmSkeletonBonesTableApi
): Array<[rootBones: Array<number>, layerBones: Array<number>]> {
  const { someRhythmStructure, skeletonBonesTableResult = [] } = api
  const containerRootBones = skeletonBonesTableResult[0]
    ? skeletonBonesTableResult[0][0]
    : new Array(someRhythmStructure.containerResolution)
        .fill(undefined)
        .map((_, containerCellIndex) => containerCellIndex)
  const currentSkeletonBonesRowResult = getSkeletonLayerBonesRowData({
    containerRootBones,
    containerResolution: someRhythmStructure.containerResolution,
    containerPhase: someRhythmStructure.containerPhase,
    skeletonDensity: someRhythmStructure.layerSkeleton.skeletonDensity,
    skeletonPhase: someRhythmStructure.layerSkeleton.skeletonPhase,
  })
  switch (someRhythmStructure.layerSkeleton.layerType) {
    case 'containerSkeleton':
      return getRhythmSkeletonBonesTable({
        someRhythmStructure: {
          containerResolution:
            someRhythmStructure.layerSkeleton.skeletonDensity,
          containerPhase: someRhythmStructure.layerSkeleton.containerPhase,
          layerSkeleton: someRhythmStructure.layerSkeleton.layerSkeleton,
          layerType: 'rootContainer',
        },
        skeletonBonesTableResult: [
          currentSkeletonBonesRowResult,
          ...skeletonBonesTableResult,
        ],
      })
    case 'terminalSkeleton':
      return [currentSkeletonBonesRowResult, ...skeletonBonesTableResult]
  }
}

interface GetSkeletonLayerBonesRowDataApi {
  containerResolution: number
  containerPhase: number
  skeletonDensity: number
  skeletonPhase: number
  containerRootBones: Array<number>
}

function getSkeletonLayerBonesRowData(
  api: GetSkeletonLayerBonesRowDataApi
): [rootBones: Array<number>, layerBones: Array<number>] {
  const {
    containerResolution,
    skeletonDensity,
    skeletonPhase,
    containerPhase,
    containerRootBones,
  } = api
  const skeletonLayerBonesResult: [
    rootBones: Array<number>,
    layerBones: Array<number>
  ] = [new Array(skeletonDensity), new Array(skeletonDensity)]
  getEuclideanRhythm({
    lhsCount: skeletonDensity,
    rhsCount: containerResolution - skeletonDensity,
    lhsRhythm: [true],
    rhsRhythm: [false],
  })
    .reduce<Array<number>>(
      (baseSkeletonResult, someRhythmCell, rhythmCellIndex) => {
        if (someRhythmCell === true) {
          baseSkeletonResult.push(rhythmCellIndex)
        }
        return baseSkeletonResult
      },
      []
    )
    .forEach((someSkeletonBone, skeletonBoneIndex, baseSkeleton) => {
      const absoluteSkeletonPhase = baseSkeleton[skeletonPhase]!
      const layerSkeletonBone =
        (someSkeletonBone -
          absoluteSkeletonPhase -
          containerPhase +
          containerResolution) %
        containerResolution
      const rootSkeletonBone = containerRootBones[layerSkeletonBone]!
      skeletonLayerBonesResult[1][skeletonBoneIndex] = layerSkeletonBone
      skeletonLayerBonesResult[0][skeletonBoneIndex] = rootSkeletonBone
    })
  skeletonLayerBonesResult[0].sort((boneA, boneB) => boneA - boneB)
  skeletonLayerBonesResult[1].sort((boneA, boneB) => boneA - boneB)
  return skeletonLayerBonesResult
}
