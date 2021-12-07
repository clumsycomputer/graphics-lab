import { AnimationModule } from '@clumsycomputer/graphics-renderer'
import { getMidPointBetweenPoints, getRotatedPoint } from '@library/general'
import { getLoopPoint } from '@library/getLoopPoint'
import { getLoopPointsData } from '@library/getLoopPointsData'
import { getLoopWaveSamples } from '@library/getLoopWaveSamples'
import { getTracePointData } from '@library/getTracePointData'
import {
  Circle,
  Loop,
  LoopPoint,
  MiddleChildLoop,
  Point,
} from '@library/models'
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
  const loopBaseA: Loop = {
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
      phaseAngle: Math.PI / 3,
      baseRotationAngle: Math.PI / 3,
      childRotationAngle: 0,
      childLoop: {
        childLoopType: 'middleChildLoop',
        relativeDepth: 0.1,
        relativeRadius: 0.75,
        phaseAngle: Math.PI / 5,
        baseRotationAngle: Math.PI / 5,
        childRotationAngle: 0,
        childLoop: {
          childLoopType: 'finalChildLoop',
          relativeDepth: 0.05,
          relativeRadius: 0.675,
          phaseAngle: Math.PI / 7,
          baseRotationAngle: Math.PI / 7,
        },
      },
    },
  }
  const loopBasePointsDataA = getLoopPointsData({
    someLoop: loopBaseA,
    sampleCount: 1024,
  })
  // throw JSON.stringify(loopBasePointsDataA.samplePoints)
  const loopA: Loop = {
    ...loopBaseA,
    childLoop: {
      ...(loopBaseA.childLoop as MiddleChildLoop),
      baseRotationAngle:
        (Math.PI / 3) *
          getLoopWaveSample({
            someLoop: loopBaseA,
            sampleAngle: 2 * Math.PI * frameStamp,
          }) +
        (loopBaseA.childLoop as MiddleChildLoop).baseRotationAngle,
      phaseAngle:
        2 * Math.PI * frameStamp +
        (loopBaseA.childLoop as MiddleChildLoop).phaseAngle,
      childLoop: {
        ...((loopBaseA.childLoop as MiddleChildLoop)
          .childLoop as MiddleChildLoop),
        baseRotationAngle:
          (Math.PI / 5) *
            getLoopWaveSample({
              someLoop: loopBaseA,
              sampleAngle: 4 * Math.PI * frameStamp,
            }) +
          (
            (loopBaseA.childLoop as MiddleChildLoop)
              .childLoop as MiddleChildLoop
          ).baseRotationAngle,
        phaseAngle:
          4 * Math.PI * frameStamp +
          (
            (loopBaseA.childLoop as MiddleChildLoop)
              .childLoop as MiddleChildLoop
          ).phaseAngle,
        childLoop: {
          ...((
            (loopBaseA.childLoop as MiddleChildLoop)
              .childLoop as MiddleChildLoop
          ).childLoop as MiddleChildLoop),
          baseRotationAngle:
            (Math.PI / 7) *
              getLoopWaveSample({
                someLoop: loopBaseA,
                sampleAngle: 8 * Math.PI * frameStamp,
              }) +
            (
              (
                (loopBaseA.childLoop as MiddleChildLoop)
                  .childLoop as MiddleChildLoop
              ).childLoop as MiddleChildLoop
            ).baseRotationAngle,
          phaseAngle:
            8 * Math.PI * frameStamp +
            (
              (
                (loopBaseA.childLoop as MiddleChildLoop)
                  .childLoop as MiddleChildLoop
              ).childLoop as MiddleChildLoop
            ).phaseAngle,
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
          <circle cx={somePoint.x} cy={somePoint.y} r={0.015} fill={'orange'} />
        ))}
        {/* <polygon
          points={loopPointsDataA.samplePoints
            .map((somePoint) => `${somePoint.x},${somePoint.y}`)
            .join(' ')}
          strokeWidth={0.03}
          stroke={'orange'}
        /> */}
        {/* <circle
          cx={loopPointsDataA.samplesCenter.x}
          cy={loopPointsDataA.samplesCenter.y}
          r={0.02}
          fill={'red'}
        /> */}
      </g>
      {loopPointsDataA.samplePoints.map((someWaveSample, sampleIndex) => (
        <circle
          cx={2 * (sampleIndex / loopWaveSamplesA.length)}
          cy={someWaveSample.y - loopPointsDataA.samplesCenter.y}
          r={0.015}
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

interface GetLoopWaveSampleApi {
  someLoop: Loop
  // someLoopPointsData: ReturnType<typeof getLoopPointsData>
  sampleAngle: number
}

function getLoopWaveSample(api: GetLoopWaveSampleApi) {
  const {
    // someLoopPointsData,
    someLoop,
    sampleAngle,
  } = api
  return getLoopPoint({
    someLoop,
    pointAngle: sampleAngle,
  }).y
  // return (
  //   getTracePointData({
  //     someLoopPointsData,
  //     traceAngle: sampleAngle,
  //     startingTracePointIndex: 0,
  //   })[0].y - someLoopPointsData.samplesCenter.y
  // )
}
