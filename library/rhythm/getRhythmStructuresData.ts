import { getEuclideanRhythm } from './getEuclideanRhythm'
import { BasicRhythmStructure, RhythmPoints, RhythmStructure } from './models'

export interface GetRhythmStructuresDataApi {
  someRhythmStructure: RhythmStructure
  rhythmStructuresDataResult?: Array<ReturnType<typeof getRhythmStructureData>>
}

export function getRhythmStructuresData(
  api: GetRhythmStructuresDataApi
): Array<ReturnType<typeof getRhythmStructureData>> {
  const { someRhythmStructure, rhythmStructuresDataResult = [] } = api
  const structureBasePoints = rhythmStructuresDataResult[0]
    ? rhythmStructuresDataResult[0].structurePoints
    : new Array(someRhythmStructure.rhythmResolution)
        .fill(undefined)
        .map((_, containerCellIndex) => containerCellIndex)
  const currentRhythmStructureData = getRhythmStructureData({
    structureBasePoints,
    detachedStructure: {
      rhythmResolution: someRhythmStructure.rhythmResolution,
      rhythmPhase: someRhythmStructure.rhythmPhase,
      rhythmDensity: someRhythmStructure.subStructure.rhythmDensity,
      rhythmOrientation: someRhythmStructure.subStructure.rhythmOrientation,
    },
  })
  switch (someRhythmStructure.subStructure.structureType) {
    case 'interposedStructure':
      return getRhythmStructuresData({
        someRhythmStructure: {
          rhythmResolution: someRhythmStructure.subStructure.rhythmDensity,
          rhythmPhase: someRhythmStructure.subStructure.rhythmPhase,
          subStructure: someRhythmStructure.subStructure.subStructure,
          structureType: 'initialStructure',
        },
        rhythmStructuresDataResult: [
          currentRhythmStructureData,
          ...rhythmStructuresDataResult,
        ],
      })
    case 'terminalStructure':
      return [currentRhythmStructureData, ...rhythmStructuresDataResult]
  }
}

interface GetRhythmStructureDataApi {
  detachedStructure: BasicRhythmStructure
  structureBasePoints: RhythmPoints
}

function getRhythmStructureData(api: GetRhythmStructureDataApi): {
  detachedStructure: BasicRhythmStructure
  detachedPoints: RhythmPoints
  structurePoints: RhythmPoints
} {
  const { detachedStructure, structureBasePoints } = api
  const rhythmStructureDataResult = {
    detachedStructure,
    detachedPoints: new Array<number>(detachedStructure.rhythmDensity),
    structurePoints: new Array<number>(detachedStructure.rhythmDensity),
  }
  getEuclideanRhythm({
    lhsCount: detachedStructure.rhythmDensity,
    rhsCount:
      detachedStructure.rhythmResolution - detachedStructure.rhythmDensity,
    lhsRhythm: [true],
    rhsRhythm: [false],
  })
    .reduce<RhythmPoints>(
      (detachedPointsBaseResult, someRhythmSlot, rhythmSlotIndex) => {
        if (someRhythmSlot === true) {
          detachedPointsBaseResult.push(rhythmSlotIndex)
        }
        return detachedPointsBaseResult
      },
      []
    )
    .forEach((someDetachedPointBase, pointIndex, detachedPointsBase) => {
      const rhythmOrientationPhase =
        detachedPointsBase[detachedStructure.rhythmOrientation]!
      const detachedPoint =
        (someDetachedPointBase -
          rhythmOrientationPhase -
          detachedStructure.rhythmPhase +
          detachedStructure.rhythmResolution) %
        detachedStructure.rhythmResolution
      const structurePoint = structureBasePoints[detachedPoint]!
      rhythmStructureDataResult.detachedPoints[pointIndex] = detachedPoint
      rhythmStructureDataResult.structurePoints[pointIndex] = structurePoint
    })
  rhythmStructureDataResult.detachedPoints.sort(
    (pointA, pointB) => pointA - pointB
  )
  rhythmStructureDataResult.structurePoints.sort(
    (pointA, pointB) => pointA - pointB
  )
  return rhythmStructureDataResult
}
