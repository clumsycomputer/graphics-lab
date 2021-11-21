import React from 'react'
import { AnimationModule } from '@clumsycomputer/graphics-renderer'

const simpleLoopAnimationModule: AnimationModule = {
  animationName: 'SimpleLoop',
  frameSize: 1024,
  frameCount: 10,
  animationSettings: {
    frameRate: 5,
    constantRateFactor: 1,
  },
  FrameDescriptor: SimpleLoop,
}

export default simpleLoopAnimationModule

interface SimpleLoopFrameProps {
  frameCount: number
  frameIndex: number
}

function SimpleLoop(props: SimpleLoopFrameProps) {
  const { frameCount, frameIndex } = props
  return <svg viewBox={`0 0 100 100`}></svg>
}
