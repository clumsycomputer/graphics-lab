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
      childPointAngle: sampleAngle,
    })
    return loopPoint
  })
}

interface GetLoopPointApi {
  someLoop: Loop
  childPointAngle: number
}

function getLoopPoint(api: GetLoopPointApi) {
  const { someLoop, childPointAngle } = api
  switch (someLoop.loopType) {
    case 'basicLoop':
      return getBasicLoopPoint({
        childPointAngle,
        someBasicLoop: someLoop,
      })
    case 'baseCircleRotatedLoop':
      return getBaseCircleRotatedLoopPoint({
        childPointAngle,
        someBaseCircleRotatedLoop: someLoop,
      })
    case 'childCircleRotatedLoop':
      return getChildCircleRotatedLoopPoint({
        childPointAngle,
        someChildCircleRotatedLoop: someLoop,
      })
    default:
      throw new Error('wtf? getLoopPoint')
  }
}

interface GetChildCircleRotatedLoopPointApi {
  someChildCircleRotatedLoop: ChildCircleRotatedLoop
  childPointAngle: number
}

function getChildCircleRotatedLoopPoint(
  api: GetChildCircleRotatedLoopPointApi
) {
  const { childPointAngle, someChildCircleRotatedLoop } = api
  return getRotatedPoint({
    basePoint: getBasicLoopPoint({
      childPointAngle,
      someBasicLoop: someChildCircleRotatedLoop,
    }),
    rotationAngle: someChildCircleRotatedLoop.rotationAngle,
    anchorPoint: getBasicLoopChildCircle({
      someBasicLoop: someChildCircleRotatedLoop,
    }).center,
  })
}

interface GetBaseCircleRotatedLoopPointApi {
  someBaseCircleRotatedLoop: BaseCircleRotatedLoop
  childPointAngle: number
}

function getBaseCircleRotatedLoopPoint(api: GetBaseCircleRotatedLoopPointApi) {
  const { childPointAngle, someBaseCircleRotatedLoop } = api
  return getRotatedPoint({
    basePoint: getBasicLoopPoint({
      childPointAngle,
      someBasicLoop: someBaseCircleRotatedLoop,
    }),
    rotationAngle: someBaseCircleRotatedLoop.rotationAngle,
    anchorPoint: someBaseCircleRotatedLoop.baseCircle.center,
  })
}

interface GetRotatedPointApi {
  basePoint: Point
  anchorPoint: Point
  rotationAngle: number
}

function getRotatedPoint(api: GetRotatedPointApi) {
  const { basePoint, anchorPoint, rotationAngle } = api
  const originCenteredPoint = {
    x: basePoint.x - anchorPoint.x,
    y: basePoint.y - anchorPoint.y,
  }
  return {
    x:
      originCenteredPoint.x * Math.cos(rotationAngle) -
      originCenteredPoint.y * Math.sin(rotationAngle) +
      anchorPoint.x,
    y:
      originCenteredPoint.x * Math.sin(rotationAngle) +
      originCenteredPoint.y * Math.cos(rotationAngle) +
      anchorPoint.y,
  }
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

interface GetBasicLoopPointApi {
  someBasicLoop: LoopBase<string>
  childPointAngle: number
}

function getBasicLoopPoint(api: GetBasicLoopPointApi) {
  const { someBasicLoop, childPointAngle } = api
  const childCirclePoint = getBasicLoopChildCirclePoint({
    someBasicLoop,
    childPointAngle,
  })
  const baseCirclePoint = getBasicLoopBaseCirclePoint({
    someBasicLoop,
    childPointAngle,
  })
  const loopPoint: Point = {
    x: childCirclePoint.x,
    y: baseCirclePoint.y,
  }
  return loopPoint
}

interface GetLoopChildCirclePointApi {
  someBasicLoop: LoopBase<string>
  childPointAngle: number
}

function getBasicLoopChildCirclePoint(api: GetLoopChildCirclePointApi) {
  const { someBasicLoop, childPointAngle } = api
  const childCircle = getBasicLoopChildCircle({ someBasicLoop })
  const childCirclePoint = getCirclePoint({
    pointAngle: childPointAngle,
    someCircle: childCircle,
  })
  return childCirclePoint
}

interface GetBasicLoopBaseCirclePointApi {
  someBasicLoop: LoopBase<string>
  childPointAngle: number
}

function getBasicLoopBaseCirclePoint(api: GetBasicLoopBaseCirclePointApi) {
  const { someBasicLoop, childPointAngle } = api
  const childCircle = getBasicLoopChildCircle({ someBasicLoop })
  const childCirclePoint = getBasicLoopChildCirclePoint({
    someBasicLoop,
    childPointAngle,
  })
  const baseCircleCenterToChildCirclePointLength = Math.sqrt(
    Math.pow(childCirclePoint.x - someBasicLoop.baseCircle.center.x, 2) +
      Math.pow(childCirclePoint.y - someBasicLoop.baseCircle.center.y, 2)
  )
  const baseCircleCenterToBaseCirclePointAngle = Math.acos(
    (Math.pow(childCircle.depth, 2) +
      Math.pow(childCircle.radius, 2) -
      Math.pow(baseCircleCenterToChildCirclePointLength, 2)) /
      (2 * childCircle.depth * childCircle.radius)
  )
  const baseCircleCenterToChildCircleCenterAngle = Math.asin(
    (Math.sin(baseCircleCenterToBaseCirclePointAngle) /
      someBasicLoop.baseCircle.radius) *
      childCircle.depth
  )
  const childCircleCenterToBaseCirclePointAngle =
    Math.PI -
    baseCircleCenterToBaseCirclePointAngle -
    baseCircleCenterToChildCircleCenterAngle
  const childCircleCenterToBaseCirclePointLength =
    Math.sin(childCircleCenterToBaseCirclePointAngle) *
    (someBasicLoop.baseCircle.radius /
      Math.sin(baseCircleCenterToBaseCirclePointAngle))
  const baseCirclePoint: Point = {
    x:
      childCircleCenterToBaseCirclePointLength * Math.cos(childPointAngle) +
      childCircle.center.x,
    y:
      childCircleCenterToBaseCirclePointLength * Math.sin(childPointAngle) +
      childCircle.center.y,
  }
  return baseCirclePoint
}

interface GetLoopChildCircleApi {
  someLoop: Loop
}

function getLoopChildCircle(api: GetLoopChildCircleApi) {
  const { someLoop } = api
  switch (someLoop.loopType) {
    case 'basicLoop':
    case 'childCircleRotatedLoop':
      return getBasicLoopChildCircle({
        someBasicLoop: someLoop,
      })
    case 'baseCircleRotatedLoop':
      return getBaseCircleRotatedLoopChildCircle({
        someBaseCircleRotatedLoop: someLoop,
      })
    default:
      throw new Error('wtf? getLoopChildCircle')
  }
}

interface GetBasicLoopChildCircleApi {
  someBasicLoop: LoopBase<string>
}

function getBasicLoopChildCircle(api: GetBasicLoopChildCircleApi): ChildCircle {
  const { someBasicLoop } = api
  const childCircleDepth =
    someBasicLoop.childCircle.relativeDepth * someBasicLoop.baseCircle.radius
  return {
    depth: childCircleDepth,
    center: {
      x:
        Math.cos(someBasicLoop.childCircle.phaseAngle) * childCircleDepth +
        someBasicLoop.baseCircle.center.x,
      y:
        Math.sin(someBasicLoop.childCircle.phaseAngle) * childCircleDepth +
        someBasicLoop.baseCircle.center.y,
    },
    radius:
      someBasicLoop.childCircle.relativeRadius *
      (someBasicLoop.baseCircle.radius - childCircleDepth),
  }
}

interface GetBaseCircleRotatedLoopChildCircleApi {
  someBaseCircleRotatedLoop: BaseCircleRotatedLoop
}

function getBaseCircleRotatedLoopChildCircle(
  api: GetBaseCircleRotatedLoopChildCircleApi
) {
  const { someBaseCircleRotatedLoop } = api
  const unrotatedChildCircle = getBasicLoopChildCircle({
    someBasicLoop: someBaseCircleRotatedLoop,
  })
  return {
    ...unrotatedChildCircle,
    center: getRotatedPoint({
      rotationAngle: someBaseCircleRotatedLoop.rotationAngle,
      basePoint: unrotatedChildCircle.center,
      anchorPoint: someBaseCircleRotatedLoop.baseCircle.center,
    }),
  }
}

type Loop = BasicLoop | BaseCircleRotatedLoop | ChildCircleRotatedLoop

interface BasicLoop extends LoopBase<'basicLoop'> {}

interface BaseCircleRotatedLoop
  extends RotatedLoopBase<'baseCircleRotatedLoop'> {}

interface ChildCircleRotatedLoop
  extends RotatedLoopBase<'childCircleRotatedLoop'> {}

interface RotatedLoopBase<RotatedLoopType extends string>
  extends LoopBase<RotatedLoopType> {
  rotationAngle: number
}

interface LoopBase<LoopType extends string> {
  loopType: LoopType
  baseCircle: Circle
  childCircle: {
    relativeDepth: number
    relativeRadius: number
    phaseAngle: number
  }
}

interface ChildCircle extends Circle {
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
