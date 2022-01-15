import {
  getCirclePoint,
  getDistanceBetweenPoints,
  getNormalizedAngleBetweenPoints,
  getRotatedPoint,
} from '../general'
import { Circle, Point } from '../models'
import { InterposedLoopStructure, LoopStructure } from './models'

export interface GetLoopPointApi {
  someLoopStructure: LoopStructure
  inputAngle: number
}

export function getLoopPoint(api: GetLoopPointApi): Point {
  const { inputAngle, someLoopStructure } = api
  return getBaseLoopStructurePoint({
    inputAngle,
    baseCircle: someLoopStructure.loopBase,
    someBaseLoopStructure: someLoopStructure,
  })
}

interface GetBaseLoopStructurePointApi
  extends Pick<GetLoopPointApi, 'inputAngle'> {
  baseCircle: GetLoopPointApi['someLoopStructure']['loopBase']
  someBaseLoopStructure: LoopStructure | InterposedLoopStructure
}

function getBaseLoopStructurePoint(api: GetBaseLoopStructurePointApi): Point {
  const { someBaseLoopStructure, baseCircle, inputAngle } = api
  const foundationCircleDepth =
    someBaseLoopStructure.subStructure.relativeFoundationDepth *
    baseCircle.radius
  const unrotatedFoundationCircle: Circle = {
    center: [
      foundationCircleDepth *
        Math.cos(someBaseLoopStructure.subStructure.foundationPhaseAngle) +
        baseCircle.center[0],
      foundationCircleDepth *
        Math.sin(someBaseLoopStructure.subStructure.foundationPhaseAngle) +
        baseCircle.center[1],
    ],
    radius:
      someBaseLoopStructure.subStructure.relativeFoundationRadius *
      (baseCircle.radius - foundationCircleDepth),
  }
  const subLoopPoint =
    someBaseLoopStructure.subStructure.structureType === 'interposedStructure'
      ? getBaseLoopStructurePoint({
          inputAngle,
          baseCircle: unrotatedFoundationCircle,
          someBaseLoopStructure: someBaseLoopStructure.subStructure,
        })
      : getCirclePoint({
          pointAngle: inputAngle,
          someCircle: unrotatedFoundationCircle,
        })
  const { loopBaseCirclePoint } = getLoopBaseCirclePoint({
    baseCircle,
    subLoopPoint,
    unrotatedFoundationCircleCenter: unrotatedFoundationCircle.center,
  })
  return getRotatedPoint({
    rotationAngle: someBaseLoopStructure.subLoopRotationAngle,
    anchorPoint: getRotatedPoint({
      anchorPoint: baseCircle.center,
      basePoint: unrotatedFoundationCircle.center,
      rotationAngle: someBaseLoopStructure.subStructure.baseOrientationAngle,
    }),
    basePoint: getRotatedPoint({
      anchorPoint: baseCircle.center,
      rotationAngle: someBaseLoopStructure.subStructure.baseOrientationAngle,
      basePoint: [loopBaseCirclePoint[0], subLoopPoint[1]],
    }),
  })
}

interface getLoopBaseCirclePointApi {
  baseCircle: Circle
  unrotatedFoundationCircleCenter: Point
  subLoopPoint: Point
}

function getLoopBaseCirclePoint(api: getLoopBaseCirclePointApi): {
  loopBaseCirclePoint: Point
} {
  const { baseCircle, subLoopPoint, unrotatedFoundationCircleCenter } = api
  const childDepth = getDistanceBetweenPoints({
    pointA: baseCircle.center,
    pointB: unrotatedFoundationCircleCenter,
  })
  const childRadius = getDistanceBetweenPoints({
    pointA: unrotatedFoundationCircleCenter,
    pointB: subLoopPoint,
  })
  const childPointAngle = getNormalizedAngleBetweenPoints({
    basePoint: unrotatedFoundationCircleCenter,
    targetPoint: subLoopPoint,
  })
  if (childDepth === 0) {
    return {
      loopBaseCirclePoint: getCirclePoint({
        someCircle: baseCircle,
        pointAngle: childPointAngle,
      }),
    }
  } else {
    const baseCircleCenterToChildCirclePointLength = Math.sqrt(
      Math.pow(subLoopPoint[0] - baseCircle.center[0], 2) +
        Math.pow(subLoopPoint[1] - baseCircle.center[1], 2)
    )
    const baseCircleCenterToBaseCirclePointAngle = Math.acos(
      (Math.pow(childDepth, 2) +
        Math.pow(childRadius, 2) -
        Math.pow(baseCircleCenterToChildCirclePointLength, 2)) /
        (2 * childDepth * childRadius)
    )
    const baseCircleCenterToChildCircleCenterAngle = Math.asin(
      (Math.sin(baseCircleCenterToBaseCirclePointAngle) / baseCircle.radius) *
        childDepth
    )
    const childCircleCenterToBaseCirclePointAngle =
      Math.PI -
      baseCircleCenterToBaseCirclePointAngle -
      baseCircleCenterToChildCircleCenterAngle
    const childCircleCenterToBaseCirclePointLength =
      Math.sin(childCircleCenterToBaseCirclePointAngle) *
      (baseCircle.radius / Math.sin(baseCircleCenterToBaseCirclePointAngle))
    return {
      loopBaseCirclePoint: [
        childCircleCenterToBaseCirclePointLength * Math.cos(childPointAngle) +
          unrotatedFoundationCircleCenter[0],
        childCircleCenterToBaseCirclePointLength * Math.sin(childPointAngle) +
          unrotatedFoundationCircleCenter[1],
      ],
    }
  }
}
