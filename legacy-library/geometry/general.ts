import { getNormalizedAngle } from '@legacy-library/miscellaneous'
import { Circle, Point } from './models'

export interface GetCirclePointApi {
  someCircle: Circle
  pointAngle: number
}

export function getCirclePoint(api: GetCirclePointApi): Point {
  const { pointAngle, someCircle } = api
  const circlePoint = {
    x: Math.cos(pointAngle) * someCircle.radius + someCircle.center.x,
    y: Math.sin(pointAngle) * someCircle.radius + someCircle.center.y,
  }
  return circlePoint
}

export interface GetRotatedPointApi {
  basePoint: Point
  anchorPoint: Point
  rotationAngle: number
}

export function getRotatedPoint(api: GetRotatedPointApi) {
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

export interface GetNormalizedAngleBetweenPointsApi {
  basePoint: Point
  targetPoint: Point
}

export function getNormalizedAngleBetweenPoints(
  api: GetNormalizedAngleBetweenPointsApi
) {
  const { targetPoint, basePoint } = api
  return getNormalizedAngle({
    someAngle: Math.atan2(
      targetPoint.y - basePoint.y,
      targetPoint.x - basePoint.x
    ),
  })
}

export interface GetDistanceBetweenPointsApi {
  pointA: Point
  pointB: Point
}

export function getDistanceBetweenPoints(api: GetDistanceBetweenPointsApi) {
  const { pointA, pointB } = api
  const deltaX = pointB.x - pointA.x
  const deltaY = pointB.y - pointA.y
  return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2))
}

export interface GetMidPointBetweenPointsApi {
  pointA: Point
  pointB: Point
}

export function getMidPointBetweenPoints(
  api: GetMidPointBetweenPointsApi
): Point {
  const { pointA, pointB } = api
  return {
    x: (pointA.x + pointB.x) / 2,
    y: (pointA.y + pointB.y) / 2,
  }
}

export interface GetMirroredPointApi {
  basePoint: Point
  originPoint: Point
  mirrorAngle: number
}

export function getMirroredPoint(api: GetMirroredPointApi): Point {
  const { basePoint, originPoint, mirrorAngle } = api
  const baseAngle = Math.atan2(
    basePoint.y - originPoint.y,
    basePoint.x - originPoint.x
  )
  const deltaAngle = baseAngle - mirrorAngle
  const deltaRadius = Math.sqrt(
    Math.pow(basePoint.x - originPoint.x, 2) +
      Math.pow(basePoint.y - originPoint.y, 2)
  )
  return {
    x: deltaRadius * Math.cos(mirrorAngle - deltaAngle) + originPoint.x,
    y: deltaRadius * Math.sin(mirrorAngle - deltaAngle) + originPoint.y,
  }
}
