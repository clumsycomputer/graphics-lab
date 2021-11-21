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
  const loopApi = {
    subAngle: (2 * Math.PI) / 7,
    subDepth: 0.4,
    subRadius: 0.5,
  }
  const baseCircle: Circle = {
    center: {
      x: 50,
      y: 50,
    },
    radius: 30,
  }
  const subCircleDepth = loopApi.subDepth * baseCircle.radius
  const subCircle: Circle = {
    center: {
      x: Math.cos(loopApi.subAngle) * subCircleDepth + baseCircle.center.x,
      y: Math.sin(loopApi.subAngle) * subCircleDepth + baseCircle.center.y,
    },
    radius: loopApi.subRadius * (baseCircle.radius - subCircleDepth),
  }
  const loopPointAngle = 2 * Math.PI * 0.89
  const subPoint: Point = {
    x: Math.cos(loopPointAngle) * subCircle.radius + subCircle.center.x,
    y: Math.sin(loopPointAngle) * subCircle.radius + subCircle.center.y,
  }
  const baseCenterToSubPointLength = Math.sqrt(
    Math.pow(subPoint.x - baseCircle.center.x, 2) +
      Math.pow(subPoint.y - baseCircle.center.y, 2)
  )
  const angleFacingBaseCenterToBasePoint = Math.acos(
    (Math.pow(subCircleDepth, 2) +
      Math.pow(subCircle.radius, 2) -
      Math.pow(baseCenterToSubPointLength, 2)) /
      (2 * subCircleDepth * subCircle.radius)
  )
  const angleFacingBaseCenterToSubCenter = Math.asin(
    (Math.sin(angleFacingBaseCenterToBasePoint) / baseCircle.radius) *
      subCircleDepth
  )
  const angleFacingSubCenterToBasePoint =
    Math.PI -
    angleFacingBaseCenterToBasePoint -
    angleFacingBaseCenterToSubCenter
  const subCenterToBasePointLength =
    Math.sin(angleFacingSubCenterToBasePoint) *
    (baseCircle.radius / Math.sin(angleFacingBaseCenterToBasePoint))
  const basePoint: Point = {
    x:
      subCenterToBasePointLength * Math.cos(loopPointAngle) +
      subCircle.center.x,
    y:
      subCenterToBasePointLength * Math.sin(loopPointAngle) +
      subCircle.center.y,
  }
  const loopPointA: Point = {
    x: basePoint.x,
    y: subPoint.y,
  }
  const loopPointB: Point = {
    x: subPoint.x,
    y: basePoint.y,
  }
  const loopPoint: Point = {
    x: (loopPointA.x + loopPointB.x) / 2,
    y: (loopPointA.y + loopPointB.y) / 2,
  }
  return (
    <svg viewBox={`0 0 100 100`}>
      {/* <rect x={0} y={0} width={100} height={100} fill={'black'} /> */}
      <circle
        id={'base-circle-outline'}
        cx={baseCircle.center.x}
        cy={baseCircle.center.y}
        r={baseCircle.radius}
        strokeWidth={0.5}
        stroke={'black'}
        fill-opacity={0}
      />
      <circle
        id={'base-circle-center-point'}
        cx={baseCircle.center.x}
        cy={baseCircle.center.y}
        r={0.5}
        fill={'black'}
      />
      <circle
        id={'sub-circle-outline'}
        cx={subCircle.center.x}
        cy={subCircle.center.y}
        r={subCircle.radius}
        strokeWidth={0.5}
        stroke={'black'}
        fill-opacity={0}
      />
      <circle
        id={'sub-circle-center-point'}
        cx={subCircle.center.x}
        cy={subCircle.center.y}
        r={0.5}
        fill={'black'}
      />
      <circle
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
      />
      <circle
        id={'loop-point-a'}
        cx={loopPointA.x}
        cy={loopPointA.y}
        r={0.75}
        fill={'purple'}
      />
      <circle
        id={'loop-point-b'}
        cx={loopPointB.x}
        cy={loopPointB.y}
        r={0.75}
        fill={'purple'}
      />
      <circle
        id={'loop-point'}
        cx={loopPoint.x}
        cy={loopPoint.y}
        r={0.75}
        fill={'purple'}
      />
    </svg>
  )
}

interface GetLoopPointApi {
  someLoop: Loop
}

function getLoopPoint(api: GetLoopPointApi) {
  const {} = api
}

interface Loop {
  baseCircle: Circle
}

interface Circle {
  center: Point
  radius: number
}

interface Point {
  x: number
  y: number
}
