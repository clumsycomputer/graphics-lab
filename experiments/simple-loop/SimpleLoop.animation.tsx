import React from 'react'
import { AnimationModule } from '@clumsycomputer/graphics-renderer'

const simpleLoopAnimationModule: AnimationModule = {
  animationName: 'SimpleLoop',
  frameSize: 2048,
  frameCount: 360,
  animationSettings: {
    frameRate: 60,
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
  const currentLoop = {
    baseCircle: {
      center: {
        x: 50,
        y: 50,
      },
      radius: 30,
    },
    subDepth: 0.0001 + 0.99 * (frameIndex / frameCount),
    subPhase: 2 * Math.PI * (frameIndex / frameCount),
    subRadius: 0.9999 - 0.99 * (frameIndex / frameCount),
  }
  const loopPairPoints = getLoopPairPoints({
    someLoop: currentLoop,
    sampleCount: 512,
  })
  const subCircle = getLoopSubCircle({
    someLoop: currentLoop,
  })
  const [subPoint, basePoint] = getLoopPointPair({
    someLoop: currentLoop,
    subPointAngle: 2 * Math.PI * (frameIndex / frameCount) + 0.00001,
  })
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
        id={'sub-circle-outline'}
        cx={subCircle.center.x}
        cy={subCircle.center.y}
        r={subCircle.radius}
        strokeWidth={0.2}
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
      <polyline
        points={loopPairPoints[0]
          .map((someLoopAPoint) => `${someLoopAPoint.x},${someLoopAPoint.y}`)
          .join(' ')}
        strokeWidth={0.2}
        stroke={'black'}
        fill-opacity={0}
      />
      <polyline
        points={loopPairPoints[1]
          .map((someLoopAPoint) => `${someLoopAPoint.x},${someLoopAPoint.y}`)
          .join(' ')}
        strokeWidth={0.2}
        stroke={'black'}
        fill-opacity={0}
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
        fill={'teal'}
      />
      <circle
        id={'loop-point-b'}
        cx={loopPointB.x}
        cy={loopPointB.y}
        r={0.75}
        fill={'orange'}
      />
    </svg>
  )
}

interface GetLoopSubCircleApi {
  someLoop: Loop
}

function getLoopSubCircle(api: GetLoopSubCircleApi) {
  const { someLoop } = api
  const subCircleDepth = someLoop.subDepth * someLoop.baseCircle.radius
  return {
    center: {
      x:
        Math.cos(someLoop.subPhase) * subCircleDepth +
        someLoop.baseCircle.center.x,
      y:
        Math.sin(someLoop.subPhase) * subCircleDepth +
        someLoop.baseCircle.center.y,
    },
    radius: someLoop.subRadius * (someLoop.baseCircle.radius - subCircleDepth),
  }
}

interface GetLoopBaseCirclePointApi {
  someLoop: Loop
  subPointAngle: number
}

function getLoopPointPair(api: GetLoopBaseCirclePointApi) {
  const { someLoop, subPointAngle } = api
  const subCircle = getLoopSubCircle({ someLoop })
  const subPoint: Point = {
    x: Math.cos(subPointAngle) * subCircle.radius + subCircle.center.x,
    y: Math.sin(subPointAngle) * subCircle.radius + subCircle.center.y,
  }
  const baseCenterToSubPointLength = Math.sqrt(
    Math.pow(subPoint.x - someLoop.baseCircle.center.x, 2) +
      Math.pow(subPoint.y - someLoop.baseCircle.center.y, 2)
  )
  const subCircleDepth = someLoop.subDepth * someLoop.baseCircle.radius
  const angleFacingBaseCenterToBasePoint = Math.acos(
    (Math.pow(subCircleDepth, 2) +
      Math.pow(subCircle.radius, 2) -
      Math.pow(baseCenterToSubPointLength, 2)) /
      (2 * subCircleDepth * subCircle.radius)
  )
  const angleFacingBaseCenterToSubCenter = Math.asin(
    (Math.sin(angleFacingBaseCenterToBasePoint) / someLoop.baseCircle.radius) *
      subCircleDepth
  )
  const angleFacingSubCenterToBasePoint =
    Math.PI -
    angleFacingBaseCenterToBasePoint -
    angleFacingBaseCenterToSubCenter
  const subCenterToBasePointLength =
    Math.sin(angleFacingSubCenterToBasePoint) *
    (someLoop.baseCircle.radius / Math.sin(angleFacingBaseCenterToBasePoint))
  const basePoint: Point = {
    x:
      subCenterToBasePointLength * Math.cos(subPointAngle) + subCircle.center.x,
    y:
      subCenterToBasePointLength * Math.sin(subPointAngle) + subCircle.center.y,
  }
  return [subPoint, basePoint]
}

interface GetLoopPointsApi {
  someLoop: Loop
  sampleCount: number
}

function getLoopPairPoints(api: GetLoopPointsApi) {
  const { someLoop, sampleCount } = api
  return new Array(sampleCount)
    .fill(undefined)
    .reduce<[Array<Point>, Array<Point>]>(
      (result, _, someSampleIndex) => {
        const sampleAngle =
          ((2 * Math.PI) / sampleCount) * someSampleIndex + 0.00001
        const [subPoint, basePoint] = getLoopPointPair({
          someLoop,
          subPointAngle: sampleAngle,
        })
        result[0].push({
          x: basePoint.x,
          y: subPoint.y,
        })
        result[1].push({
          x: subPoint.x,
          y: basePoint.y,
        })
        return result
      },
      [[], []]
    )
}

interface Loop {
  baseCircle: Circle
  subPhase: number
  subDepth: number
  subRadius: number
}

interface Circle {
  center: Point
  radius: number
}

interface Point {
  x: number
  y: number
}
