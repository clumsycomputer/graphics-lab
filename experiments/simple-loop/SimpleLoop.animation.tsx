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
    subDepth: Math.sin(Math.PI * (frameIndex / frameCount)) * 0.999 + 0.00001,
    subPhase: 2 * Math.PI * (frameIndex / frameCount),
    subRadius: 0.9999 - Math.sin(Math.PI * (frameIndex / frameCount)) * 0.5,
  }
  const loopPoints = getLoopPoints({
    someLoop: currentLoop,
    sampleCount: 512,
  })
  const subCircle = getLoopSubCircle({
    someLoop: currentLoop,
  })
  // const currentSubPointAngle = 2 * Math.PI * (frameIndex / frameCount) + 0.0001
  // const subPoint = getLoopSubPoint({
  //   someLoop: currentLoop,
  //   subPointAngle: currentSubPointAngle,
  // })
  // const basePoint = getLoopBasePoint({
  //   someLoop: currentLoop,
  //   subPointAngle: currentSubPointAngle,
  // })
  // const loopPoint = getLoopPoint({
  //   someLoop: currentLoop,
  //   subPointAngle: currentSubPointAngle,
  // })
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
      />
      <circle
        id={'loop-point'}
        cx={loopPoint.x}
        cy={loopPoint.y}
        r={0.75}
        fill={'teal'}
      /> */}
    </svg>
  )
}

interface GetCirclePointApi {
  someCircle: Circle
  pointAngle: number
}

function getCirclePoint(api: GetCirclePointApi) {
  const { pointAngle, someCircle } = api
  const circlePoint: Point = {
    x: Math.cos(pointAngle) * someCircle.radius + someCircle.center.x,
    y: Math.sin(pointAngle) * someCircle.radius + someCircle.center.y,
  }
  return circlePoint
}

interface GetLoopPointApi {
  someLoop: Loop
  subPointAngle: number
}

function getLoopPoint(api: GetLoopPointApi) {
  const { someLoop, subPointAngle } = api
  const subPoint = getLoopSubPoint({
    someLoop,
    subPointAngle,
  })
  const basePoint = getLoopBasePoint({
    someLoop,
    subPointAngle,
  })
  const loopPoint: Point = {
    x: subPoint.x,
    y: basePoint.y,
  }
  return loopPoint
}

interface GetLoopSubPointApi {
  someLoop: Loop
  subPointAngle: number
}

function getLoopSubPoint(api: GetLoopSubPointApi) {
  const { someLoop, subPointAngle } = api
  const subCircle = getLoopSubCircle({ someLoop })
  const subPoint = getCirclePoint({
    pointAngle: subPointAngle,
    someCircle: subCircle,
  })
  return subPoint
}

interface GetLoopBasePointApi {
  someLoop: Loop
  subPointAngle: number
}

function getLoopBasePoint(api: GetLoopBasePointApi) {
  const { someLoop, subPointAngle } = api
  const subCircle = getLoopSubCircle({ someLoop })
  const subPoint = getCirclePoint({
    pointAngle: subPointAngle,
    someCircle: subCircle,
  })
  const baseCenterToSubPointLength = Math.sqrt(
    Math.pow(subPoint.x - someLoop.baseCircle.center.x, 2) +
      Math.pow(subPoint.y - someLoop.baseCircle.center.y, 2)
  )
  const angleFacingBaseCenterToBasePoint = Math.acos(
    (Math.pow(subCircle.depth, 2) +
      Math.pow(subCircle.radius, 2) -
      Math.pow(baseCenterToSubPointLength, 2)) /
      (2 * subCircle.depth * subCircle.radius)
  )
  const angleFacingBaseCenterToSubCenter = Math.asin(
    (Math.sin(angleFacingBaseCenterToBasePoint) / someLoop.baseCircle.radius) *
      subCircle.depth
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
  return basePoint
}

interface GetLoopSubCircleApi {
  someLoop: Loop
}

function getLoopSubCircle(api: GetLoopSubCircleApi): SubCircle {
  const { someLoop } = api
  const subCircleDepth = someLoop.subDepth * someLoop.baseCircle.radius
  return {
    depth: subCircleDepth,
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

interface GetLoopPointsApi {
  someLoop: Loop
  sampleCount: number
}

function getLoopPoints(api: GetLoopPointsApi) {
  const { someLoop, sampleCount } = api
  return new Array(sampleCount).fill(undefined).map((_, someSampleIndex) => {
    const sampleAngle =
      ((2 * Math.PI) / sampleCount) * someSampleIndex + 0.00001
    const loopPoint = getLoopPoint({
      someLoop,
      subPointAngle: sampleAngle,
    })
    return loopPoint
  })
}

interface Loop {
  baseCircle: Circle
  subPhase: number
  subDepth: number
  subRadius: number
}

interface SubCircle extends Circle {
  depth: number
}

interface Circle {
  center: Point
  radius: number
}

interface Point {
  x: number
  y: number
}
