import { BabyChildLoop, ChildLoop, Loop, ParentChildLoop } from './models/Loop'

export interface GetUpdatedLoopApi {
  baseLoop: Loop
  getUpdatedChildLoop: <SomeChildLoop extends ChildLoop>(api: {
    baseLoop: Loop
    childLoopBase: ChildLoopBase<SomeChildLoop>
    childLoopIndex: number
  }) => ChildLoopBase<SomeChildLoop>
}

type ChildLoopBase<SomeChildLoop extends ChildLoop> =
  SomeChildLoop extends ParentChildLoop
    ? Omit<SomeChildLoop, 'childLoop'>
    : SomeChildLoop extends BabyChildLoop
    ? SomeChildLoop
    : never

export function getUpdatedLoop(api: GetUpdatedLoopApi): Loop {
  const { baseLoop, getUpdatedChildLoop } = api
  switch (baseLoop.loopType) {
    case 'parentRootLoop':
      const updatedChildLoop = updateChildLoop({
        baseLoop,
        getUpdatedChildLoop,
        scopedLoop: baseLoop.childLoop,
        childLoopIndex: 0,
      })
      return {
        ...baseLoop,
        childLoop: updatedChildLoop,
      }
    case 'soloRootLoop':
      return {
        ...baseLoop,
      }
  }
}

interface UpdateChildLoopApi
  extends Pick<GetUpdatedLoopApi, 'baseLoop' | 'getUpdatedChildLoop'> {
  scopedLoop: ChildLoop
  childLoopIndex: number
}

function updateChildLoop(api: UpdateChildLoopApi): ChildLoop {
  const { scopedLoop, getUpdatedChildLoop, baseLoop, childLoopIndex } = api
  switch (scopedLoop.loopType) {
    case 'parentChildLoop':
      const updatedParentChildLoop = getUpdatedChildLoop({
        baseLoop,
        childLoopIndex,
        childLoopBase: scopedLoop,
      })
      return {
        ...updatedParentChildLoop,
        childLoop: updateChildLoop({
          baseLoop,
          getUpdatedChildLoop,
          scopedLoop: scopedLoop.childLoop,
          childLoopIndex: childLoopIndex + 1,
        }),
      }
    case 'babyChildLoop':
      const updatedBabyChildLoop = getUpdatedChildLoop({
        baseLoop,
        childLoopIndex,
        childLoopBase: scopedLoop,
      })
      return updatedBabyChildLoop
  }
}
