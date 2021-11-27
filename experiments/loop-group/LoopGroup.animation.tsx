import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import React from 'react'

const loopGroupAnimationModule: AnimationModule = {
  animationName: 'LoopGroupt',
  frameSize: 2048,
  frameCount: 10 * 4,
  animationSettings: {
    frameRate: 10,
    constantRateFactor: 15,
  },
  FrameDescriptor: LoopGroupFrame,
}

export default loopGroupAnimationModule

interface LoopGroupFrameProps {
  frameCount: number
  frameIndex: number
}

function LoopGroupFrame(props: LoopGroupFrameProps) {
  return (
    <svg viewBox={`0 0 100 100`}>
      <rect x={0} y={0} width={100} height={100} fill={'black'} />
    </svg>
  )
}
