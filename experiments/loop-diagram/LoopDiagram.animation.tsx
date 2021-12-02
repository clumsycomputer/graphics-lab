import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import { getMidPointBetweenPoints, getRotatedPoint } from '@library/general'
import { getLoopPointsData } from '@library/getLoopPointsData'
import { getLoopWaveSamples } from '@library/getLoopWaveSamples'
import { Circle, Loop, LoopPoint, Point } from '@library/models'
import React from 'react'

const loopDiagramAnimationModule: AnimationModule = {
  animationName: 'LoopDiagram',
  frameSize: 2048,
  frameCount: 10 * 10,
  animationSettings: {
    frameRate: 10,
    constantRateFactor: 15,
  },
  FrameDescriptor: LoopDiagramFrame,
}

export default loopDiagramAnimationModule

interface LoopDiagramFrameProps {
  frameCount: number
  frameIndex: number
}

function LoopDiagramFrame(props: LoopDiagramFrameProps) {
  const { frameIndex, frameCount } = props
  const frameStamp = frameIndex / frameCount
  const loopA: Loop = {
    baseCircle: {
      center: {
        x: 0,
        y: 0,
      },
      radius: 1,
    },
    childRotationAngle: 0,
    childLoop: {
      childLoopType: 'middleChildLoop',
      relativeDepth: 0.2,
      relativeRadius: 0.875,
      phaseAngle: 0,
      baseRotationAngle: 0,
      childRotationAngle: 0,
      childLoop: {
        childLoopType: 'middleChildLoop',
        relativeDepth: 0.1,
        relativeRadius: 0.75,
        phaseAngle: 0,
        baseRotationAngle: 0,
        childRotationAngle: 0,
        childLoop: {
          childLoopType: 'finalChildLoop',
          relativeDepth: 0.05,
          relativeRadius: 0.675,
          phaseAngle: 0,
          baseRotationAngle: 0,
        },
      },
    },
  }
  const loopPointsDataA = getLoopPointsData({
    someLoop: loopA,
    sampleCount: 1024,
  })
  const loopWaveSamplesA = getLoopWaveSamples({
    someLoop: loopA,
    sampleCount: 1024,
  })
  return (
    <svg viewBox={`0 0 100 100`}>
      <rect x={0} y={0} width={100} height={100} fill={'black'} />
      <g transform={`translate(50, 25) scale(20, 20)`}>
        {loopPointsDataA.samplePoints.map((somePoint) => (
          <circle cx={somePoint.x} cy={somePoint.y} r={0.02} fill={'orange'} />
        ))}
        {/* <circle
          cx={loopPointsDataA.samplesCenter.x}
          cy={loopPointsDataA.samplesCenter.y}
          r={0.02}
          fill={'red'}
        /> */}
      </g>
      {loopWaveSamplesA.map((someWaveSample, sampleIndex) => (
        <circle
          cx={2 * (sampleIndex / loopWaveSamplesA.length)}
          cy={someWaveSample}
          r={0.02}
          fill={'orange'}
          transform={`translate(30, 75) scale(20, 20)`}
        />
      ))}
    </svg>
  )
}

// interface GetLoopCirclesApi {
//   someLoop: Loop
// }

// function getLoopCircles(api: GetLoopCirclesApi): Array<Circle> {
//   const { someLoop } = api
//   if (someLoop.childLoop) {
//     const childCircleDepth =
//       someLoop.childLoop.relativeDepth * someLoop.baseCircle.radius
//     const unrotatedChildCircle: Circle = {
//       center: {
//         x:
//           childCircleDepth * Math.cos(someLoop.childLoop.phaseAngle) +
//           someLoop.baseCircle.center.x,
//         y:
//           childCircleDepth * Math.sin(someLoop.childLoop.phaseAngle) +
//           someLoop.baseCircle.center.y,
//       },
//       radius:
//         someLoop.childLoop.relativeRadius *
//         (someLoop.baseCircle.radius - childCircleDepth),
//     }
//     const rotatedChildCircle: Circle = {
//       ...unrotatedChildCircle,
//       center: getRotatedPoint({
//         anchorPoint: someLoop.baseCircle.center,
//         basePoint: unrotatedChildCircle.center,
//         rotationAngle: someLoop.childLoop.baseRotationAngle,
//       }),
//     }
//     const childLoopCircles =
//       someLoop.childLoop.childLoopType === 'middleChildLoop'
//         ? getLoopCircles({
//             someLoop: {
//               baseCircle: rotatedChildCircle,
//               childLoop: someLoop.childLoop.childLoop,
//               childRotationAngle: someLoop.childLoop.childRotationAngle,
//             },
//           })
//         : getLoopCircles({
//             someLoop: {
//               baseCircle: rotatedChildCircle,
//               childLoop: null,
//               childRotationAngle: 0,
//             },
//           })
//     childLoopCircles.push(someLoop.baseCircle)
//     return childLoopCircles
//   } else {
//     return [someLoop.baseCircle]
//   }
// }
