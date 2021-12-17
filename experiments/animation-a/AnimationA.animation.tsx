import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import { getWaveFrequency } from '@library/general'
import {
  getDistanceBetweenPoints,
  getHarmonicLoopWaveSamplePointData,
  getLoopPointsData,
  getNormalizedAngle,
  getTracePointData,
  getUpdatedLoopStructure,
  LoopStructure,
  Point,
} from '@library/geometry'
import { getRangedRhythmValues, getStructuredRhythmMap } from '@library/rhythm'
import getColormap from 'colormap'
import React from 'react'

const animationModuleA: AnimationModule = {
  animationName: 'AnimationA',
  frameSize: 2048,
  frameCount: 10 * 4,
  animationSettings: {
    frameRate: 10,
    constantRateFactor: 15,
  },
  FrameDescriptor: AnimationFrame,
}

export default animationModuleA

interface AnimationFrameProps {
  frameCount: number
  frameIndex: number
}

function AnimationFrame(props: AnimationFrameProps) {
  const { frameIndex, frameCount } = props
  const frameStamp = frameIndex / frameCount
  const sampleResolution = 1024
  const phaseAngleBaseValues = getRangedRhythmValues({
    someNumberRange: {
      startValue: Math.PI / 2,
      targetValue: 0,
    },
    someRhythmMap: getStructuredRhythmMap({
      someRhythmStructure: {
        structureType: 'initialStructure',
        rhythmResolution: 5,
        rhythmPhase: 0,
        subStructure: {
          structureType: 'terminalStructure',
          rhythmDensity: 3,
          rhythmOrientation: 0,
        },
      },
    }),
  })
  const baseRotationAngleBaseValues = getRangedRhythmValues({
    someNumberRange: {
      startValue: 0,
      targetValue: Math.PI / 2,
    },
    someRhythmMap: getStructuredRhythmMap({
      someRhythmStructure: {
        structureType: 'initialStructure',
        rhythmResolution: 7,
        rhythmPhase: 0,
        subStructure: {
          structureType: 'terminalStructure',
          rhythmDensity: 3,
          rhythmOrientation: 0,
        },
      },
    }),
  })
  const baseRotationAngleScalarValues = getRangedRhythmValues({
    someNumberRange: {
      startValue: Math.PI / 4,
      targetValue: Math.PI / 11,
    },
    someRhythmMap: getStructuredRhythmMap({
      someRhythmStructure: {
        structureType: 'initialStructure',
        rhythmResolution: 11,
        rhythmPhase: 0,
        subStructure: {
          structureType: 'terminalStructure',
          rhythmDensity: 3,
          rhythmOrientation: 0,
        },
      },
    }),
  })
  const baseLoopStructureA: LoopStructure = {
    structureType: 'initialStructure',
    loopBase: {
      center: { x: 0, y: 0 },
      radius: 0.6,
    },
    subLoopRotationAngle: 0,
    subStructure: {
      structureType: 'interposedStructure',
      relativeFoundationDepth: 0.1,
      relativeFoundationRadius: 0.875,
      foundationPhaseAngle: phaseAngleBaseValues[0]!,
      baseOrientationAngle: baseRotationAngleBaseValues[0]!,
      subLoopRotationAngle: 0,
      subStructure: {
        structureType: 'interposedStructure',
        relativeFoundationDepth: 0.15,
        relativeFoundationRadius: 0.9,
        foundationPhaseAngle: phaseAngleBaseValues[1]!,
        baseOrientationAngle: baseRotationAngleBaseValues[1]!,
        subLoopRotationAngle: 0,
        subStructure: {
          structureType: 'terminalStructure',
          relativeFoundationDepth: 0.2,
          relativeFoundationRadius: 0.95,
          foundationPhaseAngle: phaseAngleBaseValues[2]!,
          baseOrientationAngle: baseRotationAngleBaseValues[2]!,
        },
      },
    },
  }
  const baseLoopPointsDataA = getLoopPointsData({
    someLoopStructure: {
      ...baseLoopStructureA,
      loopBase: {
        center: { x: 0, y: 0 },
        radius: 1,
      },
    },
    sampleCount: sampleResolution,
  })
  const loopStructureA = getUpdatedLoopStructure({
    baseStructure: baseLoopStructureA,
    getScopedStructureUpdates: ({ scopedStructureBase, structureIndex }) => {
      switch (scopedStructureBase.structureType) {
        case 'initialStructure':
          return scopedStructureBase
        case 'interposedStructure':
        case 'terminalStructure':
          return {
            ...scopedStructureBase,
            foundationPhaseAngle: getNormalizedAngle({
              someAngle:
                Math.pow(2, structureIndex) * Math.PI * frameStamp +
                scopedStructureBase.foundationPhaseAngle,
            }),
            baseOrientationAngle:
              baseRotationAngleScalarValues[structureIndex - 1]! *
                getHarmonicLoopWaveSamplePointData({
                  someLoopPointsData: baseLoopPointsDataA,
                  harmonicDistribution: [1, 0.5],
                  startingTracePointIndices: [0, 0],
                  traceAngle: getNormalizedAngle({
                    someAngle:
                      Math.pow(2, structureIndex) * Math.PI * frameStamp,
                  }),
                })[0].y +
              scopedStructureBase.baseOrientationAngle,
          }
      }
    },
  })
  const loopPointsDataA = getLoopPointsData({
    someLoopStructure: loopStructureA,
    sampleCount: sampleResolution,
  })
  const radialLoopStructuredRhythmMap = getStructuredRhythmMap({
    someRhythmStructure: {
      structureType: 'initialStructure',
      rhythmResolution: 12,
      rhythmPhase: 0,
      subStructure: {
        structureType: 'interposedStructure',
        rhythmDensity: 11,
        rhythmOrientation: 0,
        rhythmPhase: 0,
        subStructure: {
          structureType: 'interposedStructure',
          rhythmDensity: 7,
          rhythmOrientation: 0,
          rhythmPhase: 0,
          subStructure: {
            structureType: 'terminalStructure',
            rhythmDensity: 5,
            rhythmOrientation: 0,
          },
        },
      },
    },
  })
  const radialLoopScalarsA = getRangedRhythmValues({
    someNumberRange: {
      startValue: 1,
      targetValue: 0,
    },
    someRhythmMap: radialLoopStructuredRhythmMap,
  })
  const orthogonalLoopScalarsA = getRangedRhythmValues({
    someNumberRange: {
      startValue: 1,
      targetValue: 0,
    },
    someRhythmMap: radialLoopStructuredRhythmMap,
  })
  const loopColormapA = getColormap({
    colormap: 'plasma',
    nshades: radialLoopStructuredRhythmMap.rhythmResolution,
    format: 'hex',
    alpha: 1,
  })
  const getLoopOscillationA = (
    radialLoopIndex: number,
    orthogonalLoopIndex: number,
    sampleAngle: number
  ) => {
    const phaseDirection =
      radialLoopStructuredRhythmMap.rhythmPoints[radialLoopIndex]! % 2 === 0
        ? 1
        : -1
    return (
      0.1 *
      radialLoopScalarsA[radialLoopIndex]! *
      orthogonalLoopScalarsA[orthogonalLoopIndex]! *
      getHarmonicLoopWaveSamplePointData({
        someLoopPointsData: baseLoopPointsDataA,
        harmonicDistribution: [1, 0.5, 0.25, 0.125],
        startingTracePointIndices: [0, 0, 0, 0],
        traceAngle: getNormalizedAngle({
          someAngle:
            getWaveFrequency({
              baseFrequency: 440,
              scaleResolution: radialLoopStructuredRhythmMap.rhythmResolution,
              frequencyIndex:
                radialLoopScalarsA[radialLoopIndex]! *
                  radialLoopStructuredRhythmMap.rhythmResolution +
                orthogonalLoopScalarsA[orthogonalLoopIndex]!,
            }) *
              sampleAngle +
            phaseDirection *
              (Math.pow(2, radialLoopIndex + 1) * Math.PI * frameStamp +
                Math.PI *
                  radialLoopScalarsA[radialLoopIndex]! *
                  orthogonalLoopScalarsA[orthogonalLoopIndex]!),
        }),
      })[0].y
    )
  }
  const loopNestDataA = getLoopNestCellsData({
    sampleCount: sampleResolution,
    radialLoopCount: radialLoopStructuredRhythmMap.rhythmPoints.length,
    baseLoopPointsData: loopPointsDataA,
    getOrthogonalLoopCount: () => {
      return radialLoopStructuredRhythmMap.rhythmPoints.length
    },
    getRadialLoopRadiusScalar: (radialLoopIndex) => {
      return radialLoopScalarsA[radialLoopIndex]!
    },
    getLoopCenterShift: (radialLoopIndex, orthogonalLoopIndex) => {
      const radialLoopRadiusScalar = radialLoopScalarsA[radialLoopIndex]!
      const harmonicSamplePoint = getHarmonicLoopWaveSamplePointData({
        someLoopPointsData: loopPointsDataA,
        traceAngle: 2 * Math.PI * frameStamp,
        harmonicDistribution: [1, 0.5, 0.25],
        startingTracePointIndices: [0, 0, 0],
      })[0]
      return {
        x: 0.5 * radialLoopRadiusScalar * harmonicSamplePoint.x,
        y: 0.5 * radialLoopRadiusScalar * harmonicSamplePoint.y,
      }
    },
    getUnderlayLoopOscillation: (
      radialLoopIndex,
      orthogonalLoopIndex,
      sampleAngle
    ) => {
      return getLoopOscillationA(
        radialLoopIndex,
        orthogonalLoopIndex,
        sampleAngle
      )
    },
    getOverlayLoopOscillation: (
      radialLoopIndex,
      orthogonalLoopIndex,
      sampleAngle
    ) => {
      return getLoopOscillationA(
        radialLoopIndex,
        orthogonalLoopIndex,
        sampleAngle + Math.PI / 3
      )
    },
    getUnderlayLoopCellFillColor: (radialLoopIndex, orthogonalLoopIndex) => {
      return loopColormapA[
        radialLoopStructuredRhythmMap.rhythmPoints[orthogonalLoopIndex]!
      ]!
    },
    getLoopCellLength: (radialLoopIndex, orthogonalLoopIndex) => {
      return (
        0.02 *
        radialLoopScalarsA[radialLoopIndex]! *
        orthogonalLoopScalarsA[orthogonalLoopIndex]!
      )
    },
    getLoopNestIndex: (radialLoopIndex, orthogonalLoopIndex) => {
      return orthogonalLoopIndex
    },
  })
  return (
    <svg viewBox={`-1 -1 2 2`}>
      <rect x={-1} y={-1} width={2} height={2} fill={'black'} />
      {loopNestDataA.map((someNestLoopData, nestLoopIndex) => {
        return (
          <LayeredLoopGraphic
            maskId={`${nestLoopIndex}`}
            underlayLoopCells={someNestLoopData.underlayLoopCells}
            overlayLoopCells={someNestLoopData.overlayLoopCells}
            maskOff={true}
          />
        )
      })}
    </svg>
  )
}

interface GetLoopNestCellsDataApi {
  baseLoopPointsData: ReturnType<typeof getLoopPointsData>
  sampleCount: number
  radialLoopCount: number
  getOrthogonalLoopCount: (radialLoopIndex: number) => number
  getRadialLoopRadiusScalar: (radialLoopIndex: number) => number
  // getRadialLoopOscillationScalar: (
  //   radialLoopIndex: number,
  //   sampleAngle: number
  // ) => number
  getLoopCellLength: (
    radialLoopIndex: number,
    orthogonalLoopIndex: number
  ) => number
  getLoopCenterShift: (
    radialLoopIndex: number,
    orthogonalLoopIndex: number
  ) => Point
  getUnderlayLoopCellFillColor: (
    radialLoopIndex: number,
    orthogonalLoopIndex: number
  ) => string
  getUnderlayLoopOscillation: (
    radialLoopIndex: number,
    orthogonalLoopIndex: number,
    sampleAngle: number
  ) => number
  getOverlayLoopOscillation: (
    radialLoopIndex: number,
    orthogonalLoopIndex: number,
    sampleAngle: number
  ) => number
  getLoopNestIndex: (
    radialLoopIndex: number,
    orthogonalLoopIndex: number
  ) => number
}

function getLoopNestCellsData(api: GetLoopNestCellsDataApi): Array<{
  underlayLoopCells: Array<UnderlayLoopCell>
  overlayLoopCells: Array<OverlayLoopCell>
}> {
  const {
    radialLoopCount,
    getOrthogonalLoopCount,
    baseLoopPointsData,
    sampleCount,
    getRadialLoopRadiusScalar,
    // getRadialLoopOscillationScalar,
    getLoopNestIndex,
    getLoopCellLength,
    getLoopCenterShift,
    getUnderlayLoopCellFillColor,
    getUnderlayLoopOscillation,
    getOverlayLoopOscillation,
  } = api
  const loopNestDataMap: {
    [loopNestIndex: number]: {
      underlayLoopCells: Array<UnderlayLoopCell>
      overlayLoopCells: Array<OverlayLoopCell>
    }
  } = {}
  const baseLoopCenter = baseLoopPointsData.samplesCenter
  let baseTracePointIndex = 0
  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
    const sampleAngle = 2 * Math.PI * (sampleIndex / sampleCount)
    const [baseTracePoint, nextBaseTracePointIndex] = getTracePointData({
      someLoopPointsData: baseLoopPointsData,
      startingTracePointIndex: baseTracePointIndex,
      traceAngle: sampleAngle,
    })
    baseTracePointIndex = nextBaseTracePointIndex
    const baseTracePointToBaseLoopCenterLength = getDistanceBetweenPoints({
      pointA: baseLoopCenter,
      pointB: baseTracePoint,
    })
    for (
      let radialLoopIndex = 0;
      radialLoopIndex < radialLoopCount;
      radialLoopIndex++
    ) {
      const radialLoopRadiusScalar = getRadialLoopRadiusScalar(radialLoopIndex)
      const radialLoopRadius =
        radialLoopRadiusScalar * baseTracePointToBaseLoopCenterLength
      for (
        let orthogonalLoopIndex = 0;
        orthogonalLoopIndex < getOrthogonalLoopCount(radialLoopIndex);
        orthogonalLoopIndex++
      ) {
        const loopNestIndex = getLoopNestIndex(
          radialLoopIndex,
          orthogonalLoopIndex
        )
        const targetLoopNestData = loopNestDataMap[loopNestIndex] || {
          underlayLoopCells: [],
          overlayLoopCells: [],
        }
        loopNestDataMap[loopNestIndex] = targetLoopNestData
        const loopCellLength = getLoopCellLength(
          radialLoopIndex,
          orthogonalLoopIndex
        )
        const loopCenterShift = getLoopCenterShift(
          radialLoopIndex,
          orthogonalLoopIndex
        )
        const underlayLoopCellOscillation = getUnderlayLoopOscillation(
          radialLoopIndex,
          orthogonalLoopIndex,
          sampleAngle
        )
        const underlayLoopCellRadius =
          radialLoopRadius + underlayLoopCellOscillation
        targetLoopNestData.underlayLoopCells.push({
          cellLength: loopCellLength,
          fillColor: getUnderlayLoopCellFillColor(
            radialLoopIndex,
            orthogonalLoopIndex
          ),
          cellCenter: {
            x:
              underlayLoopCellRadius * Math.cos(sampleAngle) +
              baseLoopCenter.x +
              loopCenterShift.x,
            y:
              underlayLoopCellRadius * Math.sin(sampleAngle) +
              baseLoopCenter.y +
              loopCenterShift.y,
          },
        })
        const overlayLoopCellOscillation = getOverlayLoopOscillation(
          radialLoopIndex,
          orthogonalLoopIndex,
          sampleAngle
        )
        const overlayLoopCellRadius =
          overlayLoopCellOscillation + radialLoopRadius
        targetLoopNestData.overlayLoopCells.push({
          cellLength: loopCellLength,
          cellCenter: {
            x:
              overlayLoopCellRadius * Math.cos(sampleAngle) +
              baseLoopCenter.x +
              loopCenterShift.x,
            y:
              overlayLoopCellRadius * Math.sin(sampleAngle) +
              baseLoopCenter.y +
              loopCenterShift.y,
          },
        })
      }
    }
  }
  return Object.keys(loopNestDataMap)
    .sort(
      (loopNestDataA, loopNestDataB) =>
        parseInt(loopNestDataA) - parseInt(loopNestDataB)
    )
    .map((someLoopNestIndex) => loopNestDataMap[parseInt(someLoopNestIndex)]!)
}

interface UnderlayLoopCell extends LoopCellBase {
  fillColor: string
}

interface OverlayLoopCell extends LoopCellBase {}

interface LoopCellBase {
  cellCenter: Point
  cellLength: number
}

interface LayeredLoopGraphicProps {
  maskId: string
  overlayLoopCells: Array<OverlayLoopCell>
  underlayLoopCells: Array<UnderlayLoopCell>
  maskOff: boolean
}

function LayeredLoopGraphic(props: LayeredLoopGraphicProps) {
  const { maskId, maskOff, overlayLoopCells, underlayLoopCells } = props
  return (
    <g>
      <mask id={maskId}>
        <rect x={-1} y={-1} width={2} height={2} fill={'white'} />
        {!maskOff
          ? overlayLoopCells.map((someOverlayLoopCell) => (
              <rect
                x={
                  someOverlayLoopCell.cellCenter.x -
                  someOverlayLoopCell.cellLength / 2
                }
                y={
                  someOverlayLoopCell.cellCenter.y -
                  someOverlayLoopCell.cellLength / 2
                }
                width={someOverlayLoopCell.cellLength}
                height={someOverlayLoopCell.cellLength}
                fill={'black'}
              />
            ))
          : false}
      </mask>
      <g mask={`url(#${maskId})`}>
        {underlayLoopCells.map((someUnderlayLoopCell) => (
          <rect
            x={
              someUnderlayLoopCell.cellCenter.x -
              someUnderlayLoopCell.cellLength / 2
            }
            y={
              someUnderlayLoopCell.cellCenter.y -
              someUnderlayLoopCell.cellLength / 2
            }
            width={someUnderlayLoopCell.cellLength}
            height={someUnderlayLoopCell.cellLength}
            fill={someUnderlayLoopCell.fillColor}
          />
        ))}
      </g>
    </g>
  )
}
