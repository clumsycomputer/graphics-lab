import { getEuclideanRhythm } from './getEuclideanRhythm'
import { BasicRhythmStructure, RhythmSkeleton, RhythmStructure } from './models'

export interface GetRhythmSkeletonLayersDataApi {
  someRhythmStructure: RhythmStructure
  skeletonLayersDataResult?: Array<ReturnType<typeof getSkeletonLayerData>>
}

export function getRhythmSkeletonLayersData(
  api: GetRhythmSkeletonLayersDataApi
): Array<ReturnType<typeof getSkeletonLayerData>> {
  const { someRhythmStructure, skeletonLayersDataResult = [] } = api
  const containerSkeleton = skeletonLayersDataResult[0]
    ? skeletonLayersDataResult[0].layerSkeleton
    : new Array(someRhythmStructure.containerResolution)
        .fill(undefined)
        .map((_, containerCellIndex) => containerCellIndex)
  const currentSkeletonLayerData = getSkeletonLayerData({
    containerSkeleton,
    detachedStructure: {
      containerResolution: someRhythmStructure.containerResolution,
      containerPhase: someRhythmStructure.containerPhase,
      skeletonDensity: someRhythmStructure.layerStructure.skeletonDensity,
      skeletonPhase: someRhythmStructure.layerStructure.skeletonPhase,
    },
  })
  switch (someRhythmStructure.layerStructure.structureType) {
    case 'branchStructure':
      return getRhythmSkeletonLayersData({
        someRhythmStructure: {
          containerResolution:
            someRhythmStructure.layerStructure.skeletonDensity,
          containerPhase: someRhythmStructure.layerStructure.containerPhase,
          layerStructure: someRhythmStructure.layerStructure.layerStructure,
          structureType: 'rootStructure',
        },
        skeletonLayersDataResult: [
          currentSkeletonLayerData,
          ...skeletonLayersDataResult,
        ],
      })
    case 'leafStructure':
      return [currentSkeletonLayerData, ...skeletonLayersDataResult]
  }
}

interface GetSkeletonLayerDataApi {
  detachedStructure: BasicRhythmStructure
  containerSkeleton: RhythmSkeleton
}

function getSkeletonLayerData(api: GetSkeletonLayerDataApi): {
  detachedStructure: BasicRhythmStructure
  detachedSkeleton: RhythmSkeleton
  layerSkeleton: RhythmSkeleton
} {
  const { detachedStructure, containerSkeleton } = api
  const skeletonLayerDataResult = {
    detachedStructure,
    detachedSkeleton: new Array(detachedStructure.skeletonDensity),
    layerSkeleton: new Array(detachedStructure.skeletonDensity),
  }
  getEuclideanRhythm({
    lhsCount: detachedStructure.skeletonDensity,
    rhsCount:
      detachedStructure.containerResolution - detachedStructure.skeletonDensity,
    lhsRhythm: [true],
    rhsRhythm: [false],
  })
    .reduce<RhythmSkeleton>(
      (baseSkeletonResult, someRhythmCell, rhythmCellIndex) => {
        if (someRhythmCell === true) {
          baseSkeletonResult.push(rhythmCellIndex)
        }
        return baseSkeletonResult
      },
      []
    )
    .forEach((someSkeletonBone, skeletonBoneIndex, baseSkeleton) => {
      const absoluteSkeletonPhase =
        baseSkeleton[detachedStructure.skeletonPhase]!
      const detachedBone =
        (someSkeletonBone -
          absoluteSkeletonPhase -
          detachedStructure.containerPhase +
          detachedStructure.containerResolution) %
        detachedStructure.containerResolution
      const layerBone = containerSkeleton[detachedBone]!
      skeletonLayerDataResult.detachedSkeleton[skeletonBoneIndex] = detachedBone
      skeletonLayerDataResult.layerSkeleton[skeletonBoneIndex] = layerBone
    })
  skeletonLayerDataResult.detachedSkeleton.sort((boneA, boneB) => boneA - boneB)
  skeletonLayerDataResult.layerSkeleton.sort((boneA, boneB) => boneA - boneB)
  return skeletonLayerDataResult
}
