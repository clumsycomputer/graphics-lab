import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import React from 'react'
import { getCompositeLoopTraceablePoints, getTracePoint } from './helpers'
import { Circle, CompositeLoop } from './models'

const loopDiagramAnimationModule: AnimationModule = {
  animationName: 'LoopDiagram',
  frameSize: 2048,
  frameCount: 420,
  animationSettings: {
    frameRate: 60,
    constantRateFactor: 1,
  },
  FrameDescriptor: LoopDiagram,
}

export default loopDiagramAnimationModule

interface LoopDiagramFrameProps {
  frameCount: number
  frameIndex: number
}

function LoopDiagram(props: LoopDiagramFrameProps) {
  const { frameCount, frameIndex } = props
  const currentBaseCircle: Circle = {
    center: {
      x: 125 * (frameIndex / frameCount) - 15,
      y: 115 - 125 * (frameIndex / frameCount),
    },
    radius: 15,
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
  const currentLoopPoints = getCompositeLoopTraceablePoints({
    someCompositeLoop: currentLoop,
    sampleCount: 2048,
  })
  const currentSampleAngle = 2 * Math.PI * (frameIndex / frameCount) + 0.00001
  const currentTracePoint = getTracePoint({
    someTracerPoints: currentLoopPoints,
    traceAngle: currentSampleAngle,
  })
  return (
    <svg viewBox={`0 0 100 100`}>
      <rect x={0} y={0} width={100} height={100} fill={'white'} />
      <polygon
        id={'loop-polygon'}
        points={currentLoopPoints
          .map(
            (someLoopPointData) =>
              `${someLoopPointData.x},${someLoopPointData.y}`
          )
          .join(' ')}
        strokeWidth={0.2}
        stroke={'black'}
        fill-opacity={0}
      />
      <circle
        id={'trace-point'}
        cx={currentTracePoint.x}
        cy={currentTracePoint.y}
        r={0.4}
        fill={'purple'}
      />
    </svg>
  )
}
