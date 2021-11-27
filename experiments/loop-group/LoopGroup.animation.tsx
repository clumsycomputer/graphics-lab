import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import {
  BasedPoint,
  Circle,
  CompositeLoop,
  getCompositeLoopCircles,
  getCompositeLoopPoints,
} from '@library/geometry'
import { getTriangleWaveSample } from '@library/miscellaneous'
import React from 'react'

const loopGroupAnimationModule: AnimationModule = {
  animationName: 'LoopGroup',
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
  const { frameIndex, frameCount } = props
  const frameStamp = frameIndex / frameCount
  const baseCircle: Circle = {
    center: {
      x: 50,
      y: 50,
    },
    radius: 70,
  }
  const baseLoop: CompositeLoop = {
    loopParts: [
      {
        baseCircle: baseCircle,
        loopType: 'baseCircleRotatedLoop',
        rotationAngle:
          (Math.PI / 12) * Math.sin(2 * Math.PI * frameStamp) -
          (Math.PI / 5) * Math.sin(Math.PI * frameStamp),
        childCircle: {
          relativeDepth: 0.4,
          relativeRadius: 0.3 * Math.sin(2 * Math.PI * frameStamp) + 0.6,
          phaseAngle:
            2 *
              Math.PI *
              getTriangleWaveSample({
                sampleAngle: Math.PI * frameStamp,
              }) +
            Math.PI / 3,
        },
      },
      {
        baseCircle: baseCircle,
        loopType: 'baseCircleRotatedLoop',
        rotationAngle: -Math.PI / 3,
        childCircle: {
          relativeDepth: 0.6,
          relativeRadius: 1,
          phaseAngle:
            2 *
              Math.PI *
              getTriangleWaveSample({
                sampleAngle: Math.PI * frameStamp,
              }) +
            Math.PI / 5,
        },
      },
    ],
    rotationAngle: 0,
  }
  const [_, baseChildCircle] = getCompositeLoopCircles({
    someCompositeLoop: baseLoop,
  })
  const basePoints = getCompositeLoopPoints({
    someCompositeLoop: baseLoop,
    sampleCount: 2048,
  })
  const sectionPointsA = getLoopSectionPoints({
    someLoopPoints: basePoints,
    minAngle: 2 * Math.PI * (0 / 4),
    maxAngle: 2 * Math.PI * (1 / 4),
  })
  const sectionPointsB = getLoopSectionPoints({
    someLoopPoints: basePoints,
    minAngle: 2 * Math.PI * (1 / 4),
    maxAngle: 2 * Math.PI * (2 / 4),
  })
  const sectionPointsC = getLoopSectionPoints({
    someLoopPoints: basePoints,
    minAngle: 2 * Math.PI * (2 / 4),
    maxAngle: 2 * Math.PI * (3 / 4),
  })
  const sectionPointsD = getLoopSectionPoints({
    someLoopPoints: basePoints,
    minAngle: 2 * Math.PI * (3 / 4),
    maxAngle: 2 * Math.PI * (4 / 4),
  })
  return (
    <svg viewBox={`0 0 100 100`}>
      <rect x={0} y={0} width={100} height={100} fill={'black'} />
      {/* <polygon
        fillOpacity={0}
        strokeWidth={0.2}
        stroke={'white'}
        points={basePoints
          .map((somePoint) => `${somePoint.x},${somePoint.y}`)
          .join(' ')}
      /> */}
      <g
        transform={`translate(${
          -baseCircle.center.x -
          (baseChildCircle.center.x - baseCircle.center.x)
        } ${
          -baseCircle.center.y -
          (baseChildCircle.center.y - baseCircle.center.y)
        })`}
      >
        <polyline
          fillOpacity={0}
          strokeWidth={0.2}
          stroke={'orange'}
          points={sectionPointsA
            .map((somePoint) => `${somePoint.x},${somePoint.y}`)
            .join(' ')}
        />
      </g>
      <g
        transform={`translate(${
          baseCircle.center.x - (baseChildCircle.center.x - baseCircle.center.x)
        } ${
          -baseCircle.center.y -
          (baseChildCircle.center.y - baseCircle.center.y)
        })`}
      >
        <polyline
          fillOpacity={0}
          strokeWidth={0.2}
          stroke={'orange'}
          points={sectionPointsB
            .map((somePoint) => `${somePoint.x},${somePoint.y}`)
            .join(' ')}
        />
      </g>
      <g
        transform={`translate(${
          baseCircle.center.x - (baseChildCircle.center.x - baseCircle.center.x)
        } ${
          baseCircle.center.y - (baseChildCircle.center.y - baseCircle.center.y)
        })`}
      >
        <polyline
          fillOpacity={0}
          strokeWidth={0.2}
          stroke={'orange'}
          points={sectionPointsC
            .map((somePoint) => `${somePoint.x},${somePoint.y}`)
            .join(' ')}
        />
      </g>
      <g
        transform={`translate(${
          -baseCircle.center.x -
          (baseChildCircle.center.x - baseCircle.center.x)
        } ${
          baseCircle.center.y - (baseChildCircle.center.y - baseCircle.center.y)
        })`}
      >
        <polyline
          fillOpacity={0}
          strokeWidth={0.2}
          stroke={'orange'}
          points={sectionPointsD
            .map((somePoint) => `${somePoint.x},${somePoint.y}`)
            .join(' ')}
        />
      </g>
    </svg>
  )
}

interface GetLoopSectionPointsApi {
  someLoopPoints: Array<BasedPoint>
  minAngle: number
  maxAngle: number
}

function getLoopSectionPoints(api: GetLoopSectionPointsApi) {
  const { someLoopPoints, minAngle, maxAngle } = api
  return someLoopPoints.filter(
    (someBasedPoint) =>
      someBasedPoint.baseAngle >= minAngle &&
      someBasedPoint.baseAngle <= maxAngle
  )
}
