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
      center: { x: 50, y: 50 },
      radius: 30,
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
    sampleCount: 1024,
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
                getHarmonicLoopWaveSampleData({
                  someLoopPointsData: baseLoopPointsDataA,
                  harmonicDistribution: [
                    1,
                    0.2 *
                      getLoopWaveSampleData({
                        someLoopPointsData: baseLoopPointsDataA,
                        traceAngle: 2 * Math.PI * frameStamp,
                        startingTracePointIndex: 0,
                      })[0] +
                      0.4,
                  ],
                  startingTracePointIndices: [0, 0],
                  traceAngle: getNormalizedAngle({
                    someAngle:
                      Math.pow(2, structureIndex) * Math.PI * frameStamp,
                  }),
                })[0] +
              scopedStructureBase.baseOrientationAngle,
          }
      }
    },
  })
  const loopPointsDataA = getLoopPointsData({
    someLoopStructure: loopStructureA,
    sampleCount: 1024,
  })
  const waveLoopPointsDataA = getLoopPointsData({
    someLoopStructure: {
      ...loopStructureA,
      loopBase: {
        center: { x: 0, y: 0 },
        radius: 1,
      },
    },
    sampleCount: 1024,
  })
  const ringLayerRhythmMapStructure = getStructuredRhythmMap({
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
              rhythmDensity: 7,
              rhythmOrientation: 3,
            },
          },
        },
      },
    },
  })
  const ringLayerOscillationScalars = getRangedRhythmValues({
    someNumberRange: {
      startValue: 10,
      targetValue: 0,
    },
    someRhythmMap: ringLayerRhythmMapStructure,
  })
  const loopNestScalars = getRangedRhythmValues({
    someNumberRange: {
      startValue: 1,
      targetValue: 0.925,
    },
    someRhythmMap: ringLayerRhythmMapStructure,
  })
  const ringLayerOscillationColormap = getColormap({
    colormap: 'cubehelix',
    nshades: ringLayerRhythmMapStructure.rhythmResolution,
    format: 'hex',
    alpha: 1,
  })
  return (
    <svg viewBox={`0 0 100 100`}>
      <rect x={0} y={0} width={100} height={100} fill={'black'} />
      {ringLayerRhythmMapStructure.rhythmPoints.map(
        (ringLayerRhythmPoint, rhythmPointIndex) => {
          const ringLayerOscillationScalar =
            ringLayerOscillationScalars[rhythmPointIndex]!
          const ringLayerColor =
            ringLayerOscillationColormap[ringLayerRhythmPoint]!
          const getTraceAngleBase = (
            sampleAngle: number,
            rotationDirectionScalar: number
          ) =>
            211 * sampleAngle -
            rotationDirectionScalar *
              Math.pow(2, rhythmPointIndex + 1) *
              Math.PI +
            frameStamp +
            Math.PI * ringLayerOscillationScalar
          return (
            <g>
              {ringLayerRhythmMapStructure.rhythmPoints.map(
                (someNestPoint, nestPointIndex) => {
                  const phaseDirectionScalar = nestPointIndex % 2 === 0 ? 1 : -1
                  const loopNestScalar = loopNestScalars[nestPointIndex]!
                  const underlayLoopPoints = getOscillatedLoopPoints({
                    someLoopPointsData: loopPointsDataA,
                    loopRadiusScalar: loopNestScalar,
                    getLoopPointOscillation: ({ centerAngle, sampleAngle }) =>
                      ringLayerOscillationScalar *
                      loopNestScalar *
                      getHarmonicLoopWaveSampleData({
                        someLoopPointsData: waveLoopPointsDataA,
                        traceAngle: getNormalizedAngle({
                          someAngle:
                            2 *
                            getTraceAngleBase(
                              sampleAngle,
                              phaseDirectionScalar
                            ),
                        }),
                        harmonicDistribution: [1, 0.5, 0.25],
                        startingTracePointIndices: [0, 0, 0],
                      })[0],
                  })
                  const overlayLoopPoints = getOscillatedLoopPoints({
                    someLoopPointsData: loopPointsDataA,
                    loopRadiusScalar: loopNestScalar,
                    getLoopPointOscillation: ({ centerAngle, sampleAngle }) =>
                      ringLayerOscillationScalar *
                      loopNestScalar *
                      getHarmonicLoopWaveSampleData({
                        someLoopPointsData: waveLoopPointsDataA,
                        traceAngle: getNormalizedAngle({
                          someAngle: getTraceAngleBase(
                            centerAngle,
                            phaseDirectionScalar
                          ),
                        }),
                        harmonicDistribution: [1, 0.5, 0.25],
                        startingTracePointIndices: [0, 0, 0],
                      })[0],
                  })
                  return (
                    <OscillatedLoopGraphic
                      id={`${rhythmPointIndex}-${nestPointIndex}`}
                      underlayLoopPoints={underlayLoopPoints}
                      overlayLoopPoints={overlayLoopPoints}
                      fillColor={ringLayerColor}
                      cellLength={
                        (ringLayerOscillationScalar / 2.75) * loopNestScalar
                      }
                      targetRectangle={{
                        x: 0,
                        y: 0,
                        width: 100,
                        height: 100,
                      }}
                    />
                  )
                }
              )}
            </g>
          )
        }
      )}
    </svg>
  )
}

interface GetOscillatedLoopPointsDataApi {
  loopRadiusScalar: number
  someLoopPointsData: ReturnType<typeof getLoopPointsData>
  getLoopPointOscillation: (api: {
    sampleAngle: number
    centerAngle: number
  }) => number
}

function getOscillatedLoopPoints(
  api: GetOscillatedLoopPointsDataApi
): Array<LoopPoint> {
  const { someLoopPointsData, getLoopPointOscillation, loopRadiusScalar } = api
  return someLoopPointsData.samplePoints.map((someLoopPoint, sampleIndex) => {
    const sampleAngle =
      ((2 * Math.PI) / someLoopPointsData.samplePoints.length) * sampleIndex
    const loopPointOscillation = getLoopPointOscillation({
      sampleAngle,
      centerAngle: someLoopPoint.centerAngle,
    })
    const tracePoint = getTracePointData({
      someLoopPointsData,
      traceAngle: sampleAngle,
      startingTracePointIndex: 0,
    })[0]
    const loopPointToLoopCenterDistance = getDistanceBetweenPoints({
      pointA: someLoopPointsData.samplesCenter,
      pointB: tracePoint,
    })
    const oscillatedPointRadius =
      loopPointOscillation + loopRadiusScalar * loopPointToLoopCenterDistance
    return {
      ...someLoopPoint,
      x:
        oscillatedPointRadius * Math.cos(sampleAngle) +
        someLoopPointsData.samplesCenter.x,
      y:
        oscillatedPointRadius * Math.sin(sampleAngle) +
        someLoopPointsData.samplesCenter.y,
    }
  })
}

interface OscillattedLoopGraphicProps {
  id: string
  underlayLoopPoints: Array<Point>
  overlayLoopPoints: Array<Point>
  cellLength: number
  targetRectangle: Rectangle
  fillColor: string
}

function OscillatedLoopGraphic(props: OscillattedLoopGraphicProps) {
  const {
    cellLength,
    id,
    fillColor,
    targetRectangle,
    underlayLoopPoints,
    overlayLoopPoints,
  } = props
  const halfCellLength = cellLength / 2
  return (
    <g>
      <mask id={id}>
        {underlayLoopPoints.map((somePoint) => (
          <rect
            x={somePoint.x - halfCellLength / 2}
            y={somePoint.y - halfCellLength / 2}
            width={cellLength / 2}
            height={cellLength / 2}
            fill={'white'}
          />
        ))}
        {overlayLoopPoints.map((somePoint) => (
          <rect
            x={somePoint.x - halfCellLength}
            y={somePoint.y - halfCellLength}
            width={cellLength}
            height={cellLength}
            fill={'black'}
          />
        ))}
      </mask>
      <rect
        fill={fillColor}
        x={targetRectangle.x}
        y={targetRectangle.y}
        width={targetRectangle.width}
        height={targetRectangle.height}
        mask={`url(#${id})`}
      />
    </g>
  )
}

interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}
