import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import { getLoopPointsData } from '@library/loop/getLoopPointsData'
import { getUpdatedLoopStructure } from '@library/loop/getUpdatedLoopStructure'
import { LoopStructure } from '@library/loop/models'
import { getOscillatedLoopPoints } from '@library/loop/getOscillatedLoopPoints'
import React from 'react'

const skyworksAnimationMoudle: AnimationModule = {
  animationName: 'Skyworks',
  frameSize: 2048,
  frameCount: 128,
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
  const { frameIndex, frameCount } = props
  const frameStamp = frameIndex / frameCount
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
  const branchResolution = 7
  const branchLoopStructuresA = new Array(branchResolution)
    .fill(undefined)
    .map((_, branchLoopIndex) => {
      return getUpdatedLoopStructure({
        baseStructure: baseLoopStructureA,
        getScopedStructureUpdates: ({
          baseStructure,
          scopedStructureBase,
          structureIndex,
        }) => {
          switch (scopedStructureBase.structureType) {
            case 'initialStructure':
              return {
                ...scopedStructureBase,
                loopBase: {
                  center: [
                    scopedStructureBase.loopBase.center[0] +
                      ((frameStamp * 40) / branchResolution) *
                        branchLoopIndex *
                        Math.cos(
                          ((0.3 * Math.PI) / branchResolution) * branchLoopIndex
                        ),
                    scopedStructureBase.loopBase.center[1] +
                      ((frameStamp * 40) / branchResolution) *
                        branchLoopIndex *
                        Math.sin(
                          ((0.3 * Math.PI) / branchResolution) * branchLoopIndex
                        ),
                  ],
                  radius:
                    scopedStructureBase.loopBase.radius -
                    (scopedStructureBase.loopBase.radius / branchResolution) *
                      branchLoopIndex,
                },
              }
            case 'interposedStructure':
            case 'terminalStructure':
              return {
                ...scopedStructureBase,
                relativeFoundationDepth:
                  scopedStructureBase.relativeFoundationDepth +
                  frameStamp *
                    (scopedStructureBase.relativeFoundationDepth /
                      7 /
                      branchResolution) *
                    branchLoopIndex,
                relativeFoundationRadius:
                  scopedStructureBase.relativeFoundationRadius -
                  frameStamp *
                    (scopedStructureBase.relativeFoundationRadius /
                      7 /
                      branchResolution) *
                    branchLoopIndex,
                foundationPhaseAngle:
                  scopedStructureBase.foundationPhaseAngle +
                  frameStamp *
                    (Math.PI / 4 / branchResolution) *
                    branchLoopIndex,
                baseOrientationAngle:
                  scopedStructureBase.baseOrientationAngle +
                  frameStamp *
                    (Math.PI / 4 / branchResolution) *
                    branchLoopIndex,
              }
          }
        },
      })
    })

  return (
    <svg viewBox={`0 0 100 100`}>
      <rect x={0} y={0} width={100} height={100} fill={'black'} />
      {branchLoopStructuresA.map(
        (someBranchLoopStructure, branchStructureIndex) => {
          const currentLoopPointsData = getLoopPointsData({
            sampleCount: 512,
            someLoopStructure: someBranchLoopStructure,
          })
          const oscillatedLoopPoints = getOscillatedLoopPoints({
            someLoopPointsData: currentLoopPointsData,
            sampleCount: currentLoopPointsData.loopPoints.length,
            getPointOscillationDelta: (sampleAngle, basePointRadius) => {
              return (
                (basePointRadius / 3) * Math.sin(220 * sampleAngle) * frameStamp
              )
            },
          })
          return oscillatedLoopPoints.map((someLoopPoint) => {
            const cellLength =
              1 * (1 - branchStructureIndex / branchLoopStructuresA.length)
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
          })
        }
      )}
    </svg>
  )
}

// acoustic alien
