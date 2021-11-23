import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import React from 'react'
import { getCompositeLoopTraceablePoints, getTracePoint } from './helpers'
import { Circle, CompositeLoop, Loop } from './models'

const loopDiagramAnimationModule: AnimationModule = {
  animationName: 'LoopDiagram',
  frameSize: 2048,
  frameCount: 360,
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
      x: 50,
      y: 50,
    },
    radius: 30,
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
          phaseAngle: 2 * Math.PI * (frameIndex / frameCount) + Math.PI / 3,
          relativeDepth:
            Math.sin(Math.PI * (frameIndex / frameCount)) * 0.5 + 0.00001,
          relativeRadius:
            0.9999 - Math.sin(Math.PI * (frameIndex / frameCount)) * 0.5,
        },
        rotationAngle: Math.PI * (frameIndex / frameCount),
      },
    ],
    rotationAngle: (-Math.PI / 2) * (frameIndex / frameCount),
  }
  const loopTraceablePoints = getCompositeLoopTraceablePoints({
    someCompositeLoop: currentLoop,
    sampleCount: 2048,
  })
  const currentSampleAngle = 2 * Math.PI * (frameIndex / frameCount) + 0.00001
  const tracePoint = getTracePoint({
    someTraceablePoints: loopTraceablePoints,
    traceAngle: currentSampleAngle,
  })
  return (
    <svg viewBox={`0 0 100 100`}>
      <rect x={0} y={0} width={100} height={100} fill={'white'} />
      <polygon
        id={'loop-polygon'}
        points={loopTraceablePoints
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
        cx={tracePoint.x}
        cy={tracePoint.y}
        r={0.75}
        fill={'purple'}
      />
    </svg>
  )
}
