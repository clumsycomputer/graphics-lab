import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import { getNormalizedAngle } from '@library/general'
import {
  getLoopPointsData,
  GetLoopPointsDataApi,
} from '@library/loop/getLoopPointsData'
import {
  getOscillatedLoopPoints,
  GetOscillatedLoopPointsApi,
} from '@library/loop/getOscillatedLoopPoints'
import {
  getTracedLoopPointData,
  GetTracedLoopPointDataApi,
} from '@library/loop/getTracedLoopPointData'
import { LoopStructure } from '@library/loop/models'
import { Point } from '@library/models'
import React, { Fragment, SVGProps } from 'react'

const skyworksAnimationMoudle: AnimationModule = {
  animationName: 'Skyworks',
  frameSize: 2048,
  frameCount: 40,
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
  return (
    <svg viewBox={`0 0 100 100`}>
      <rect x={0} y={0} width={100} height={100} fill={'black'} />
      <LoopCells
        getFillColor={(pointIndex) => {
          return '#ff5e87'
        }}
        someCellPoints={getLoopCellPoints({
          sampleCount: 4 * 1024,
          getPointOscillationDelta: (sampleAngle, basePointRadius) => {
            return (Math.sin(440 * sampleAngle) * basePointRadius) / 4
          },
          someLoopStructure: {
            structureType: 'initialStructure',
            loopBase: {
              center: [50, 50],
              radius: 20,
            },
            subLoopRotationAngle: getRelativeAngle({
              relativeAngle: 0,
            }),
            subStructure: {
              structureType: 'interposedStructure',
              baseOrientationAngle: getRelativeAngle({
                relativeAngle: 0.1,
              }),
              relativeSubDepth: 0.1,
              relativeSubRadius: 0.95,
              subPhaseAngle: getRelativeAngle({
                relativeAngle: 0.2,
              }),
              subLoopRotationAngle: getRelativeAngle({
                relativeAngle: 0.1,
              }),
              subStructure: {
                structureType: 'terminalStructure',
                baseOrientationAngle: getRelativeAngle({
                  relativeAngle: 0.2,
                }),
                relativeSubDepth: 0.2,
                relativeSubRadius: 1,
                subPhaseAngle: getRelativeAngle({
                  relativeAngle: 0.2,
                }),
              },
            },
          },
        })}
      />
    </svg>
  )
}

interface LoopCellsProps {
  someCellPoints: Array<Point>
  getFillColor: (pointIndex: number) => string
}

function LoopCells(props: LoopCellsProps) {
  const { someCellPoints, getFillColor } = props
  return (
    <Fragment>
      {someCellPoints.map((someLoopPoint, pointIndex) => {
        const cellLength = 0.4
        const halfCellLength = cellLength / 2
        return (
          <rect
            x={someLoopPoint[0] - halfCellLength}
            y={someLoopPoint[1] - halfCellLength}
            width={cellLength}
            height={cellLength}
            fill={getFillColor(pointIndex)}
          />
        )
      })}
    </Fragment>
  )
}

// acoustic alien
interface GetLoopCellPointsApi
  extends Pick<GetLoopPointsDataApi, 'someLoopStructure' | 'sampleCount'>,
    Pick<GetOscillatedLoopPointsApi, 'getPointOscillationDelta'> {}

function getLoopCellPoints(api: GetLoopCellPointsApi) {
  const { someLoopStructure, sampleCount, getPointOscillationDelta } = api
  const loopPointsDataA = getLoopPointsData({
    someLoopStructure,
    sampleCount,
  })
  const oscillatedLoopPoints = getOscillatedLoopPoints({
    getPointOscillationDelta,
    someLoopPointsData: loopPointsDataA,
    sampleCount: loopPointsDataA.loopPoints.length,
  })
  return oscillatedLoopPoints
}

interface GetRelativeAngleApi {
  relativeAngle: number
}

function getRelativeAngle(api: GetRelativeAngleApi) {
  const { relativeAngle } = api
  return relativeAngle * 2 * Math.PI
}
