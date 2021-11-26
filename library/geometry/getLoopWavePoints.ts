import { BasedPoint } from './models'

export interface GetLoopWavePointsApi {
  someLoopPoints: Array<BasedPoint>
  baseRadiusScalar: number
  getWaveSampleOscillation: (api: {
    sampleAngle: number
    baseAngle: number
  }) => number
}

export function getLoopWavePoints(api: GetLoopWavePointsApi) {
  const { someLoopPoints, getWaveSampleOscillation, baseRadiusScalar } = api
  return someLoopPoints.map((someLoopPoint, sampleIndex) => {
    const sampleAngle = ((2 * Math.PI) / someLoopPoints.length) * sampleIndex
    const cellRadius =
      getWaveSampleOscillation({
        sampleAngle,
        baseAngle: someLoopPoint.baseAngle,
      }) +
      baseRadiusScalar * someLoopPoint.baseDistance
    return {
      ...someLoopPoint,
      x:
        cellRadius * Math.cos(someLoopPoint.baseAngle) +
        someLoopPoint.basePoint.x,
      y:
        cellRadius * Math.sin(someLoopPoint.baseAngle) +
        someLoopPoint.basePoint.y,
    }
  })
}
