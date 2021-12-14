import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import {
  getDistanceBetweenPoints,
  getHarmonicLoopWaveSampleData,
  getLoopPointsData,
  getLoopWaveSampleData,
  getNormalizedAngle,
  getUpdatedLoopStructure,
  LoopPoint,
  LoopStructure,
} from '@library/geometry'
import React from 'react'

const animationModuleA: AnimationModule = {
  animationName: 'AnimationA',
  frameSize: 2048,
  frameCount: 10 * 10,
  animationSettings: {
    frameRate: 10,
    constantRateFactor: 15,
  },
  FrameDescriptor: AnimationFrame,
}

export default animationModuleA

interface AnimationFrameProps {
  frameCount: number
  frameIndex: number
}

function AnimationFrame(props: AnimationFrameProps) {
  const { frameIndex, frameCount } = props
  const frameStamp = frameIndex / frameCount
  const baseLoopStructureA: LoopStructure = {
    structureType: 'initialStructure',
    loopBase: {
      center: { x: 50, y: 50 },
      radius: 30,
    },
    subLoopRotationAngle: 0,
    subStructure: {
      structureType: 'terminalStructure',
      relativeFoundationDepth: 0,
      relativeFoundationRadius: 1,
      foundationPhaseAngle: 0,
      baseOrientationAngle: 0,
    },
  }
  const baseLoopPointsDataA = getLoopPointsData({
    someLoopStructure: baseLoopStructureA,
    sampleCount: 1024,
  })
  const loopStructureA = getUpdatedLoopStructure({
    baseStructure: baseLoopStructureA,
    getScopedStructureUpdates: ({ scopedStructureBase }) => {
      return scopedStructureBase
    },
  })
  const loopPointsDataA = getLoopPointsData({
    someLoopStructure: loopStructureA,
    sampleCount: 1024,
  })
  const waveLoopStructureA = {
    ...loopStructureA,
    loopBase: {
      center: { x: 0, y: 0 },
      radius: 1,
    },
  }
  const waveLoopPointsDataA = getLoopPointsData({
    someLoopStructure: waveLoopStructureA,
    sampleCount: 1024,
  })
  const oscillatedLoopPointsA = getOscillatedLoopPoints({
    someLoopPointsData: loopPointsDataA,
    getLoopPointOscillation: ({ centerAngle, sampleAngle }) =>
      getLoopWaveSampleData({
        someLoopPointsData: waveLoopPointsDataA,
        traceAngle: getNormalizedAngle({
          someAngle: 220 * centerAngle,
        }),
        startingTracePointIndex: 0,
      })[0],
  })
  return (
    <svg viewBox={`0 0 100 100`}>
      <rect x={0} y={0} width={100} height={100} fill={'black'} />
      {oscillatedLoopPointsA.map((somePoint) => (
        <circle cx={somePoint.x} cy={somePoint.y} r={0.2} fill={'white'} />
      ))}
    </svg>
  )
}

interface GetOscillatedLoopPointsDataApi {
  someLoopPointsData: ReturnType<typeof getLoopPointsData>
  getLoopPointOscillation: (api: {
    sampleAngle: number
    centerAngle: number
  }) => number
}

function getOscillatedLoopPoints(
  api: GetOscillatedLoopPointsDataApi
): Array<LoopPoint> {
  const { someLoopPointsData, getLoopPointOscillation } = api
  return someLoopPointsData.samplePoints.map((someLoopPoint, sampleIndex) => {
    const sampleAngle =
      ((2 * Math.PI) / someLoopPointsData.samplePoints.length) * sampleIndex
    const loopPointOscillation = getLoopPointOscillation({
      sampleAngle,
      centerAngle: someLoopPoint.centerAngle,
    })
    const loopPointToLoopCenterDistance = getDistanceBetweenPoints({
      pointA: someLoopPointsData.samplesCenter,
      pointB: someLoopPoint,
    })
    const oscillatedPointRadius =
      loopPointOscillation + loopPointToLoopCenterDistance
    return {
      ...someLoopPoint,
      x:
        oscillatedPointRadius * Math.cos(someLoopPoint.centerAngle) +
        someLoopPointsData.samplesCenter.x,
      y:
        oscillatedPointRadius * Math.sin(someLoopPoint.centerAngle) +
        someLoopPointsData.samplesCenter.y,
    }
  })
}
