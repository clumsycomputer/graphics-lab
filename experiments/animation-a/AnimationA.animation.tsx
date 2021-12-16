import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import {
  getDistanceBetweenPoints,
  getHarmonicLoopWaveSampleData,
  getLoopPointsData,
  getLoopWaveSampleData,
  getNormalizedAngle,
  getTracePointData,
  getUpdatedLoopStructure,
  LoopPoint,
  LoopStructure,
  Point,
} from '@library/geometry'
import { getRangedRhythmValues, getStructuredRhythmMap } from '@library/rhythm'
import React from 'react'
import getColormap from 'colormap'

const animationModuleA: AnimationModule = {
  animationName: 'AnimationA',
  frameSize: 2048,
  frameCount: 10 * 10,
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
  // const baseLoopPointsDataA = getLoopPointsData({
  //   someLoopStructure: {
  //     ...baseLoopStructureA,
  //     loopBase: {
  //       center: { x: 0, y: 0 },
  //       radius: 1,
  //     },
  //   },
  //   sampleCount: 1024,
  // })
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
                Math.sin(Math.pow(2, structureIndex) * Math.PI * frameStamp) +
              // getHarmonicLoopWaveSampleData({
              //   someLoopPointsData: baseLoopPointsDataA,
              //   harmonicDistribution: [1, 0.5],
              //   startingTracePointIndices: [0, 0],
              //   traceAngle: getNormalizedAngle({
              //     someAngle:
              //       Math.pow(2, structureIndex) * Math.PI * frameStamp,
              //   }),
              // })[0] +
              scopedStructureBase.baseOrientationAngle,
          }
      }
    },
  })
  const loopPointsDataA = getLoopPointsData({
    someLoopStructure: loopStructureA,
    sampleCount: 1024,
  })
  const radialLoopStructuredRhythmMap = getStructuredRhythmMap({
    someRhythmStructure: {
      structureType: 'initialStructure',
      rhythmResolution: 18,
      rhythmPhase: 0,
      subStructure: {
        structureType: 'interposedStructure',
        rhythmDensity: 17,
        rhythmOrientation: 0,
        rhythmPhase: 0,
        subStructure: {
          structureType: 'interposedStructure',
          rhythmDensity: 13,
          rhythmOrientation: 0,
          rhythmPhase: 0,
          subStructure: {
            structureType: 'interposedStructure',
            rhythmDensity: 11,
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
    },
  })
  const radialLoopScalarsA = getRangedRhythmValues({
    someNumberRange: {
      startValue: 1,
      targetValue: 0.5,
    },
    someRhythmMap: radialLoopStructuredRhythmMap,
  })
  const orthogonalLoopScalarsA = getRangedRhythmValues({
    someNumberRange: {
      startValue: 1,
      targetValue: 0.5,
    },
    someRhythmMap: radialLoopStructuredRhythmMap,
  })
  const loopColormapA = getColormap({
    colormap: 'cubehelix',
    nshades: radialLoopStructuredRhythmMap.rhythmResolution,
    format: 'hex',
    alpha: 1,
  })
  const loopNestCellsDataA = getLoopNestCellsData({
    sampleCount: 512,
    radialLoopCount: radialLoopStructuredRhythmMap.rhythmPoints.length,
    baseLoopPointsData: loopPointsDataA,
    getOrthogonalLoopCount: () =>
      radialLoopStructuredRhythmMap.rhythmPoints.length,
    getRadialLoopRadiusScalar: (radialLoopIndex) => {
      return radialLoopScalarsA[radialLoopIndex]!
    },
    getUnderlayLoopOscillation: (
      radialLoopIndex,
      orthogonalLoopIndex,
      sampleAngle
    ) =>
      0.1 *
      radialLoopScalarsA[radialLoopIndex]! *
      orthogonalLoopScalarsA[orthogonalLoopIndex]! *
      Math.sin(
        220 * sampleAngle +
          Math.PI * orthogonalLoopScalarsA[orthogonalLoopIndex]!
      ),
    getOverlayLoopOscillation: (
      radialLoopIndex,
      orthogonalLoopIndex,
      sampleAngle
    ) =>
      0.1 *
      radialLoopScalarsA[radialLoopIndex]! *
      orthogonalLoopScalarsA[orthogonalLoopIndex]! *
      Math.sin(
        211 * sampleAngle +
          Math.PI * orthogonalLoopScalarsA[orthogonalLoopIndex]!
      ),
    getUnderlayLoopCellFillColor: (radialLoopIndex, orthogonalLoopIndex) => {
      return loopColormapA[
        radialLoopStructuredRhythmMap.rhythmPoints[orthogonalLoopIndex]!
      ]!
    },
    getLoopCellLength: (radialLoopIndex, orthogonalLoopIndex) => {
      return (
        0.06 *
        radialLoopScalarsA[radialLoopIndex]! *
        orthogonalLoopScalarsA[orthogonalLoopIndex]!
      )
    },
  })
  return (
    <svg viewBox={`-1 -1 2 2`}>
      <rect x={-1} y={-1} width={2} height={2} fill={'black'} />
      {loopNestCellsDataA.map((someRadialLoopNestData, radialLoopIndex) => {
        return someRadialLoopNestData.map(
          (
            [someUnderlayLoopCells, someOverlayLoopCells],
            orthogonalLoopIndex
          ) => {
            const maskId = `${radialLoopIndex}-${orthogonalLoopIndex}`
            return (
              <g>
                <mask id={maskId}>
                  <rect x={-1} y={-1} width={2} height={2} fill={'white'} />
                  {someOverlayLoopCells.map((someOverlayLoopCell) => (
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
                  ))}
                </mask>
                <g mask={`url(#${maskId})`}>
                  {someUnderlayLoopCells.map((someUnderlayLoopCell) => (
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
}

function getLoopNestCellsData(
  api: GetLoopNestCellsDataApi
): Array<
  Array<
    [
      underlayLoopCells: Array<UnderlayLoopCell>,
      overlayLoopCells: Array<OverlayLoopCell>
    ]
  >
> {
  const {
    radialLoopCount,
    getOrthogonalLoopCount,
    baseLoopPointsData,
    sampleCount,
    getRadialLoopRadiusScalar,
    // getRadialLoopOscillationScalar,
    getLoopCellLength,
    getUnderlayLoopCellFillColor,
    getUnderlayLoopOscillation,
    getOverlayLoopOscillation,
  } = api
  const radialLoopNestData: Array<
    Array<
      [
        underlayLoopCells: Array<UnderlayLoopCell>,
        overlayLoopCells: Array<OverlayLoopCell>
      ]
    >
  > = new Array(radialLoopCount)
    .fill(undefined)
    .map((_, someRadialLoopIndex) =>
      new Array(getOrthogonalLoopCount(someRadialLoopIndex))
        .fill(undefined)
        .map(() => [[], []])
    )
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
    radialLoopNestData.forEach(
      (someOrthogonalLoopNestData, radialLoopIndex) => {
        const radialLoopRadiusScalar =
          getRadialLoopRadiusScalar(radialLoopIndex)
        const radialLoopRadius =
          radialLoopRadiusScalar * baseTracePointToBaseLoopCenterLength
        // const radialLoopOscillationScalar = getRadialLoopOscillationScalar(
        //   radialLoopIndex,
        //   sampleAngle
        // )
        someOrthogonalLoopNestData.forEach(
          (
            [someUnderlayLoopCells, someOverlayLoopCells],
            orthogonalLoopIndex
          ) => {
            const loopCellLength = getLoopCellLength(
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
            someUnderlayLoopCells.push({
              cellLength: loopCellLength,
              fillColor: getUnderlayLoopCellFillColor(
                radialLoopIndex,
                orthogonalLoopIndex
              ),
              cellCenter: {
                x:
                  underlayLoopCellRadius * Math.cos(sampleAngle) +
                  baseLoopCenter.x,
                y:
                  underlayLoopCellRadius * Math.sin(sampleAngle) +
                  baseLoopCenter.y,
              },
            })
            const overlayLoopCellOscillation = getOverlayLoopOscillation(
              radialLoopIndex,
              orthogonalLoopIndex,
              sampleAngle
            )
            const overlayLoopCellRadius =
              overlayLoopCellOscillation + radialLoopRadius
            someOverlayLoopCells.push({
              cellLength: loopCellLength,
              cellCenter: {
                x:
                  overlayLoopCellRadius * Math.cos(sampleAngle) +
                  baseLoopCenter.x,
                y:
                  overlayLoopCellRadius * Math.sin(sampleAngle) +
                  baseLoopCenter.y,
              },
            })
          }
        )
      }
    )
  }
  return radialLoopNestData
}

interface UnderlayLoopCell extends LoopCellBase {
  fillColor: string
}

interface OverlayLoopCell extends LoopCellBase {}

interface LoopCellBase {
  cellCenter: Point
  cellLength: number
}
