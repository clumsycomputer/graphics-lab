import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import {
  Circle,
  CompositeLoop,
  getCompositeLoopPoints,
  Point,
} from '@library/geometry'
import {
  getElementIndices,
  getNaturalCompositeRhythm,
} from '@library/sequenced-space'
import getColormap from 'colormap'
import React, { Fragment } from 'react'
import { getWaveFrequency } from './helpers'

const loopDiagramAnimationModule: AnimationModule = {
  animationName: 'LoopDiagram',
  frameSize: 2048,
  frameCount: 10,
  animationSettings: {
    frameRate: 5,
    constantRateFactor: 15,
  },
  FrameDescriptor: LoopDiagramFrame,
}

export default loopDiagramAnimationModule

interface LoopDiagramFrameProps {
  frameCount: number
  frameIndex: number
}

function LoopDiagramFrame(props: LoopDiagramFrameProps) {
  const { frameCount, frameIndex } = props
  const currentBaseCircle: Circle = {
    center: {
      x: 164 * (frameIndex / frameCount) - 32,
      y: 132 - 164 * (frameIndex / frameCount),
    },
    radius: 20,
    // center: {
    //   x: 50,
    //   y: 50,
    // },
    // radius: 35,
  }
  const currentLoop: CompositeLoop = {
    loopParts: [
      {
        loopType: 'baseCircleRotatedLoop',
        baseCircle: currentBaseCircle,
        childCircle: {
          phaseAngle: 2 * Math.PI * (frameIndex / frameCount) + Math.PI / 2,
          relativeDepth:
            Math.sin(Math.PI * (frameIndex / frameCount)) * 0.5 + 0.00001,
          relativeRadius:
            0.9999 - Math.sin(Math.PI * (frameIndex / frameCount)) * 0.5,
        },
        rotationAngle: 2 * Math.PI * (frameIndex / frameCount),
      },
      {
        loopType: 'baseCircleRotatedLoop',
        baseCircle: currentBaseCircle,
        childCircle: {
          phaseAngle: 3 * Math.PI * (frameIndex / frameCount) + Math.PI / 3,
          relativeDepth:
            Math.sin(Math.PI * (frameIndex / frameCount)) * 0.5 + 0.00001,
          relativeRadius:
            0.9999 - Math.sin(Math.PI * (frameIndex / frameCount)) * 0.5,
        },
        rotationAngle: -Math.PI * (frameIndex / frameCount),
      },
    ],
    rotationAngle: (-Math.PI / 2) * (frameIndex / frameCount),
  }
  const currentLoopPoints = getCompositeLoopPoints({
    someCompositeLoop: currentLoop,
    sampleCount: 4096,
  })
  const layersRhythm = getNaturalCompositeRhythm({
    rhythmResolution: 12,
    rhythmPhase: 0,
    rhythmParts: [
      { rhythmDensity: 11, rhythmPhase: 1 },
      { rhythmDensity: 7, rhythmPhase: 2 },
      { rhythmDensity: 4, rhythmPhase: 2 },
    ],
  })
  const layersRhythmAnchors = getElementIndices({
    someSpace: layersRhythm,
    targetValue: true,
  }).reverse()
  const currentColormap = getColormap({
    colormap: 'jet',
    nshades: layersRhythm.length,
    format: 'hex',
    alpha: 1,
  })
  const layersPoints = currentLoopPoints.reduce<
    Array<[Array<Point>, Array<Point>]>
  >(
    (result, someLoopPoint, pointIndex) => {
      layersRhythmAnchors.forEach((someAnchor, layerIndex) => {
        const layerFrequency = getWaveFrequency({
          baseFrequency: 211,
          scaleResolution: layersRhythm.length,
          frequencyIndex: someAnchor,
        })
        const pointAngle =
          ((2 * Math.PI) / currentLoopPoints.length) * pointIndex
        const baseScalar =
          6 *
            Math.log(
              layersRhythmAnchors[layerIndex]! / layersRhythm.length + 1.25
            ) *
            Math.sin(layerFrequency * pointAngle) +
          (someLoopPoint.baseDistance / layersRhythm.length) * (someAnchor + 1)
        result[layerIndex]![0].push({
          x:
            baseScalar * Math.cos(someLoopPoint.baseAngle) +
            someLoopPoint.basePoint.x,
          y:
            baseScalar * Math.sin(someLoopPoint.baseAngle) +
            someLoopPoint.basePoint.y,
        })
        const overlayScalar =
          6 *
            Math.log(
              layersRhythmAnchors[layerIndex]! / layersRhythm.length + 1.25
            ) *
            Math.sin(
              -2 * layerFrequency * someLoopPoint.baseAngle + pointAngle / 3
            ) +
          (someLoopPoint.baseDistance / layersRhythm.length) * (someAnchor + 1)
        result[layerIndex]![1].push({
          x:
            overlayScalar * Math.cos(someLoopPoint.baseAngle) +
            someLoopPoint.basePoint.x,
          y:
            overlayScalar * Math.sin(someLoopPoint.baseAngle) +
            someLoopPoint.basePoint.y,
        })
      })
      return result
    },
    layersRhythmAnchors.map(() => [[], []])
  )
  return (
    <svg viewBox={`0 0 100 100`}>
      <rect x={0} y={0} width={100} height={100} fill={'black'} />
      {layersPoints
        .map((someLayerPoints, layerIndex) => (
          <Fragment>
            <mask id={`${layerIndex}`}>
              {someLayerPoints[0].map((somePoint) => {
                const cellLength =
                  0.75 *
                  Math.log(
                    layersRhythmAnchors[layerIndex]! / layersRhythm.length +
                      1.125
                  )
                const halfCellLength = cellLength / 2
                return (
                  <rect
                    x={somePoint.x - halfCellLength}
                    y={somePoint.y - halfCellLength}
                    width={cellLength}
                    height={cellLength}
                    fill={'white'}
                  />
                )
              })}
              {someLayerPoints[1].map((somePoint) => {
                const cellLength =
                  0.75 *
                  Math.log(
                    layersRhythmAnchors[layerIndex]! / layersRhythm.length +
                      1.125
                  )
                const halfCellLength = cellLength / 2
                return (
                  <rect
                    x={somePoint.x - halfCellLength}
                    y={somePoint.y - halfCellLength}
                    width={cellLength}
                    height={cellLength}
                    fill={'black'}
                  />
                )
              })}
            </mask>
            <rect
              x={0}
              y={0}
              width={100}
              height={100}
              fill={currentColormap[layersRhythmAnchors[layerIndex]!]}
              mask={`url(#${layerIndex})`}
            />
          </Fragment>
        ))
        .flat()}
    </svg>
  )
}
