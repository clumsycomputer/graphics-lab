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
  return (
    ((Math.atan2(targetPoint.y - basePoint.y, targetPoint.x - basePoint.x) %
      (2 * Math.PI)) +
      2 * Math.PI) %
    (2 * Math.PI)
  )
}

export interface GetDistanceBetweenTwoPointsApi {
  pointA: Point
  pointB: Point
}

export function getDistanceBetweenTwoPoints(
  api: GetDistanceBetweenTwoPointsApi
) {
  const { pointA, pointB } = api
  return Math.sqrt(
    Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2)
  )
}
