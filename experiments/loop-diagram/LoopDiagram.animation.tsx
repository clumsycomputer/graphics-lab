import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import React from 'react'
import { getLoopChildCircle, getLoopPoint, getLoopPoints } from './helpers'
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
  const loopPoints = getLoopPoints({
    someLoop: currentLoop,
    sampleCount: 512,
  })
  const childCircle = getLoopChildCircle({
    someLoop: currentLoop,
  })
  const currentChildPointAngle =
    2 * Math.PI * (frameIndex / frameCount) + 0.0001
  // const subPoint = getLoopSubPoint({
  //   someLoop: currentLoop,
  //   subPointAngle: currentSubPointAngle,
  // })
  // const basePoint = getLoopBasePoint({
  //   someLoop: currentLoop,
  //   subPointAngle: currentSubPointAngle,
  // })
  const loopPoint = getLoopPoint({
    someLoop: currentLoop,
    childPointAngle: currentChildPointAngle,
  })
  return (
    <svg viewBox={`0 0 100 100`}>
      <rect x={0} y={0} width={100} height={100} fill={'white'} />
      <circle
        id={'base-circle-outline'}
        cx={currentLoop.baseCircle.center.x}
        cy={currentLoop.baseCircle.center.y}
        r={currentLoop.baseCircle.radius}
        strokeWidth={0.2}
        stroke={'black'}
        fill-opacity={0}
      />
      <circle
        id={'base-circle-center-point'}
        cx={currentLoop.baseCircle.center.x}
        cy={currentLoop.baseCircle.center.y}
        r={0.5}
        fill={'black'}
      />
      <circle
        id={'child-circle-outline'}
        cx={childCircle.center.x}
        cy={childCircle.center.y}
        r={childCircle.radius}
        strokeWidth={0.2}
        stroke={'black'}
        fill-opacity={0}
      />
      <circle
        id={'child-circle-center-point'}
        cx={childCircle.center.x}
        cy={childCircle.center.y}
        r={0.5}
        fill={'black'}
      />
      <polygon
        points={loopPoints
          .map((someLoopAPoint) => `${someLoopAPoint.x},${someLoopAPoint.y}`)
          .join(' ')}
        strokeWidth={0.2}
        stroke={'black'}
        fill-opacity={0}
      />
      {/* <circle
        id={'sub-point'}
        cx={subPoint.x}
        cy={subPoint.y}
        r={0.75}
        fill={'red'}
      />
      <circle
        id={'base-point'}
        cx={basePoint.x}
        cy={basePoint.y}
        r={0.75}
        fill={'red'}
      /> */}
      <circle
        id={'loop-point'}
        cx={loopPoint.x}
        cy={loopPoint.y}
        r={0.75}
        fill={'teal'}
      />
    </svg>
  )
}
