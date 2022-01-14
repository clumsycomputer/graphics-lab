import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import {
  getHarmonicLoopWaveSamplePointData,
  getLoopPointsData,
  getNormalizedAngle,
  getTracedLoopPointData,
  GetTracedLoopPointDataApi,
  getUpdatedLoopStructure,
  LoopStructure,
} from 'legacy-library-b/geometry'
import {
  getRangedRhythmValues,
  getStructuredRhythmMap,
} from 'legacy-library-b/rhythm'
import React from 'react'

const colorPalettesAnimationModule: AnimationModule = {
  animationName: 'ColorPalettes',
  frameSize: 2048,
  frameCount: 10 * 4,
  animationSettings: {
    frameRate: 10,
    constantRateFactor: 15,
  },
  FrameDescriptor: ColorPalettesFrame,
}

export default colorPalettesAnimationModule

interface ColorPalettesFrameProps {
  frameCount: number
  frameIndex: number
}

function ColorPalettesFrame(props: ColorPalettesFrameProps) {
  const { frameIndex, frameCount } = props
  const frameStamp = frameIndex / frameCount
  const sampleResolution = 512
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
  const greenSignalShape: LoopSignalShape = {
    loopPointsData: loopPointsDataA,
    getAmplitudeScalar: () => 0.7,
    getAmplitudeOffset: () => 0.4,
    getTimeScalar: () => 0.35,
    getTimeOffset: () => frameStamp + 0.15,
  }
  const blueSignalShape: LoopSignalShape = {
    loopPointsData: loopPointsDataA,
    getAmplitudeScalar: () => 0.65,
    getAmplitudeOffset: () => 0.25,
    getTimeScalar: () => 0.35,
    getTimeOffset: () => frameStamp + 0.5,
  }
  const redSignalShape: LoopSignalShape = {
    loopPointsData: loopPointsDataA,
    getAmplitudeScalar: () => 0.1,
    getAmplitudeOffset: () => 0.975,
    getTimeScalar: () => 0.35,
    getTimeOffset: () => frameStamp,
  }
  const paletteResolution = 128
  const colorPalette = getColorPalette({
    paletteResolution,
    redSignalShape,
    greenSignalShape,
    blueSignalShape,
  })
  const chartTickResolution = 8
  const signalSampleCount = 256
  const colorSignalSamples = new Array(signalSampleCount)
    .fill(undefined)
    .reduce<{
      redSignalData: Array<{ sample: number; sampleStamp: number }>
      greenSignalData: Array<{ sample: number; sampleStamp: number }>
      blueSignalData: Array<{ sample: number; sampleStamp: number }>
    }>(
      (colorSignalsSamplesResult, _, sampleIndex) => {
        const sampleStamp = sampleIndex / signalSampleCount
        colorSignalsSamplesResult.redSignalData.push({
          sampleStamp,
          sample: getCosineSampleData({
            sampleStamp,
            loopSignalShape: redSignalShape,
            startingTracePointIndex: 0,
          })[0],
        })
        colorSignalsSamplesResult.greenSignalData.push({
          sampleStamp,
          sample: getCosineSampleData({
            sampleStamp,
            loopSignalShape: greenSignalShape,
            startingTracePointIndex: 0,
          })[0],
        })
        colorSignalsSamplesResult.blueSignalData.push({
          sampleStamp,
          sample: getCosineSampleData({
            sampleStamp,
            loopSignalShape: blueSignalShape,
            startingTracePointIndex: 0,
          })[0],
        })
        return colorSignalsSamplesResult
      },
      {
        redSignalData: [],
        greenSignalData: [],
        blueSignalData: [],
      }
    )
  // throw JSON.stringify(colorSignalSamples.redSignalData)
  return (
    <svg viewBox={`-0.125 -0.125 1.25 1.5`}>
      <rect x={-0.125} y={-0.125} width={1.25} height={1.5} fill={'black'} />
      {colorPalette.map((someColor, colorIndex) => {
        const widthStep = 1 / paletteResolution
        return (
          <rect
            x={widthStep * colorIndex}
            width={widthStep + 0.01}
            fill={someColor}
            y={0}
            height={0.125}
          />
        )
      })}
      <rect x={0} y={0.25} width={1} height={1} fill={'white'} />
      {new Array(chartTickResolution)
        .fill(undefined)
        .map((_, verticalTickIndex) => {
          const fontSize = 0.03
          const tickWidth = 0.02
          const tickHeight = 0.003
          const verticalTickStamp =
            verticalTickIndex / (chartTickResolution - 1)
          const tickX = -0.03
          const tickY = -1 * verticalTickStamp + 1.25 - tickHeight
          return (
            <g>
              <rect
                x={tickX}
                y={tickY}
                width={tickWidth}
                height={tickHeight}
                fill={'white'}
              />
              <text
                x={tickX - 0.085}
                y={tickY + fontSize / 2 - 0.002}
                fontSize={fontSize}
                fontFamily={'monospace'}
                fill={'white'}
              >
                {(verticalTickIndex / (chartTickResolution - 1)).toFixed(2)}
              </text>
            </g>
          )
        })}
      {new Array(chartTickResolution)
        .fill(undefined)
        .map((_, horizontalTickIndex) => {
          const fontSize = 0.03
          const tickWidth = 0.003
          const tickHeight = 0.02
          return (
            <g>
              <rect
                x={1 * (horizontalTickIndex / (chartTickResolution - 1))}
                y={1.26}
                width={tickWidth}
                height={tickHeight}
                fill={'white'}
              />
              <text
                x={
                  1 * (horizontalTickIndex / (chartTickResolution - 1)) - 0.007
                }
                y={1.26 + 2 * fontSize}
                fontSize={fontSize}
                fontFamily={'monospace'}
                textAnchor={'start'}
                fill={'white'}
              >
                {(horizontalTickIndex / (chartTickResolution - 1)).toFixed(2)}
              </text>
            </g>
          )
        })}
      {colorSignalSamples.redSignalData.map((someSampleData) => {
        return (
          <circle
            cx={someSampleData.sampleStamp}
            cy={1.25 - someSampleData.sample}
            r={0.005}
            fill={'red'}
          />
        )
      })}
      {colorSignalSamples.greenSignalData.map((someSampleData) => {
        return (
          <circle
            cx={someSampleData.sampleStamp}
            cy={1.25 - someSampleData.sample}
            r={0.005}
            fill={'green'}
          />
        )
      })}
      {colorSignalSamples.blueSignalData.map((someSampleData) => {
        return (
          <circle
            cx={someSampleData.sampleStamp}
            cy={1.25 - someSampleData.sample}
            r={0.005}
            fill={'blue'}
          />
        )
      })}
    </svg>
  )
}

interface LoopSignalShape {
  loopPointsData: ReturnType<typeof getLoopPointsData>
  getAmplitudeScalar: (sampleStamp: number) => number
  getAmplitudeOffset: (sampleStamp: number) => number
  getTimeScalar: (sampleStamp: number) => number
  getTimeOffset: (sampleStamp: number) => number
}

interface GetColorPaletteApi {
  redSignalShape: LoopSignalShape
  greenSignalShape: LoopSignalShape
  blueSignalShape: LoopSignalShape
  paletteResolution: number
}

function getColorPalette(api: GetColorPaletteApi) {
  const {
    paletteResolution,
    redSignalShape,
    greenSignalShape,
    blueSignalShape,
  } = api
  const colorPaletteResult: Array<string> = []
  for (let colorIndex = 0; colorIndex < paletteResolution; colorIndex++) {
    const sampleStamp = colorIndex / paletteResolution
    colorPaletteResult.push(
      getColorSample({
        redSampleApi: {
          sampleStamp,
          loopSignalShape: redSignalShape,
          startingTracePointIndex: 0,
        },
        greenSampleApi: {
          sampleStamp,
          loopSignalShape: greenSignalShape,
          startingTracePointIndex: 0,
        },
        blueSampleApi: {
          sampleStamp,
          loopSignalShape: blueSignalShape,
          startingTracePointIndex: 0,
        },
      })
    )
  }
  return colorPaletteResult
}

interface GetColorSampleApi {
  redSampleApi: GetCosineSampleDataApi
  greenSampleApi: GetCosineSampleDataApi
  blueSampleApi: GetCosineSampleDataApi
}

function getColorSample(api: GetColorSampleApi): string {
  const { redSampleApi, greenSampleApi, blueSampleApi } = api
  const [redSample] = getCosineSampleData(redSampleApi)
  const [greenSample] = getCosineSampleData(greenSampleApi)
  const [blueSample] = getCosineSampleData(blueSampleApi)
  return `rgb(${255 * redSample},${255 * greenSample},${255 * blueSample})`
}

interface GetCosineSampleDataApi
  extends Pick<GetTracedLoopPointDataApi, 'startingTracePointIndex'> {
  loopSignalShape: LoopSignalShape
  sampleStamp: number
}

function getCosineSampleData(
  api: GetCosineSampleDataApi
): [cosineSample: number, sampleTracedPointIndex: number] {
  const { startingTracePointIndex, loopSignalShape, sampleStamp } = api
  const [sampleTracedPoint, sampleTracedPointIndex] = getTracedLoopPointData({
    startingTracePointIndex,
    someLoopPointsData: loopSignalShape.loopPointsData,
    traceAngle: getNormalizedAngle({
      someAngle:
        loopSignalShape.getTimeScalar(sampleStamp) * 2 * Math.PI * sampleStamp +
        2 * Math.PI * loopSignalShape.getTimeOffset(sampleStamp),
    }),
  })
  return [
    loopSignalShape.getAmplitudeScalar(sampleStamp) * sampleTracedPoint.x +
      loopSignalShape.getAmplitudeOffset(sampleStamp),
    sampleTracedPointIndex,
  ]
}
