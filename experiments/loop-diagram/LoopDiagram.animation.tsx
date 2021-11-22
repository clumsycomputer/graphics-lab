import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import React from 'react'
import { getLoopPoint, getLoopTraceablePoints, getTracePoint } from './helpers'
import { Loop } from './models'

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
  const currentLoop: Loop = {
    loopType: 'baseCircleRotatedLoop',
    baseCircle: {
      center: {
        x: 50,
        y: 50,
      },
      radius: 30,
    },
    childCircle: {
      phaseAngle: 2 * Math.PI * (frameIndex / frameCount) + Math.PI / 2,
      relativeDepth:
        Math.sin(Math.PI * (frameIndex / frameCount)) * 0.999 + 0.00001,
      relativeRadius:
        0.9999 - Math.sin(Math.PI * (frameIndex / frameCount)) * 0.5,
    },
    rotationAngle: 2 * Math.PI * (frameIndex / frameCount),
  }
  const loopTraceablePoints = getLoopTraceablePoints({
    someLoop: currentLoop,
    sampleCount: 2048,
  })
  const currentSampleAngle = 2 * Math.PI * (frameIndex / frameCount) + 0.00001
  const loopPoint = getLoopPoint({
    someLoop: currentLoop,
    childPointAngle: currentSampleAngle,
  })
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
        id={'loop-point'}
        cx={loopPoint.x}
        cy={loopPoint.y}
        r={0.75}
        fill={'teal'}
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
