import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import { getLoopPoint } from '@library/getLoopPoint'
import { getLoopPointsData } from '@library/getLoopPointsData'
import { LoopStructure } from '@library/models'
import React from 'react'

const skyworksAnimationMoudle: AnimationModule = {
  animationName: 'Skyworks',
  frameSize: 2048,
  frameCount: 1,
  animationSettings: {
    frameRate: 10,
    constantRateFactor: 15,
  },
  FrameDescriptor: SkyworksFrame,
}

export default skyworksAnimationMoudle

interface SkyworksFrameProps {
  frameCount: number
  frameIndex: number
}

function SkyworksFrame(props: SkyworksFrameProps) {
  const {} = props
  const baseLoopStructureA: LoopStructure = {
    structureType: 'initialStructure',
    subLoopRotationAngle: 0,
    loopBase: {
      center: [50, 50],
      radius: 25,
    },
    subStructure: {
      structureType: 'interposedStructure',
      relativeFoundationDepth: 0.125,
      relativeFoundationRadius: 0.875,
      foundationPhaseAngle: Math.PI / 3,
      baseOrientationAngle: Math.PI / 3,
      subLoopRotationAngle: 0,
      subStructure: {
        structureType: 'terminalStructure',
        relativeFoundationDepth: 0.125,
        relativeFoundationRadius: 0.75,
        foundationPhaseAngle: Math.PI / 3,
        baseOrientationAngle: Math.PI / 3,
      },
    },
  }
  const baseLoopPointsDataA = getLoopPointsData({
    sampleCount: 512,
    someLoopStructure: baseLoopStructureA,
  })
  return (
    <svg viewBox={`0 0 100 100`}>
      <rect x={0} y={0} width={100} height={100} fill={'black'} />
      {baseLoopPointsDataA.loopPoints.map((someLoopPoint) => {
        const cellLength = 1
        const halfCellLength = cellLength / 2
        return (
          <rect
            x={someLoopPoint[0] - halfCellLength}
            y={someLoopPoint[1] - halfCellLength}
            width={cellLength}
            height={cellLength}
            fill={'white'}
          />
        )
      })}
    </svg>
  )
}

// acoustic alien
