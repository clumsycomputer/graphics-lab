import {
  InitialSpatialStructureBase,
  InterposedSpatialStructureBase,
  RecursiveSpatialStructure,
  TerminalSpatialStructureBase,
} from './models'

export interface GetUpdatedRecursiveSpatialStructureApi<
  BaseRecursiveSpatialStructure extends RecursiveSpatialStructure
> {
  baseStructure: BaseRecursiveSpatialStructure
  getScopedStructureUpdates: <
    CurrentScopedStructure extends
      | BaseRecursiveSpatialStructure
      | BaseRecursiveSpatialStructure['subStructure']
  >(api: {
    baseStructure: BaseRecursiveSpatialStructure
    scopedStructureBase: CurrentScopedStructure
    structureIndex: number
  }) => ScopedStructureUpdates<
    BaseRecursiveSpatialStructure,
    CurrentScopedStructure
  >
}

type ScopedStructureUpdates<
  BaseRecursiveSpatialStructure extends RecursiveSpatialStructure,
  SomeScopedStructure extends
    | BaseRecursiveSpatialStructure
    | BaseRecursiveSpatialStructure['subStructure']
> = SomeScopedStructure extends InitialSpatialStructureBase<infer T>
  ? Omit<SomeScopedStructure, 'structureType' | 'subStructure'>
  : SomeScopedStructure extends InterposedSpatialStructureBase<infer T>
  ? Omit<SomeScopedStructure, 'structureType' | 'subStructure'>
  : SomeScopedStructure extends TerminalSpatialStructureBase
  ? Omit<SomeScopedStructure, 'structureType'>
  : never

export function getUpdatedRecursiveSpatialStructure<
  BaseRecursiveSpatialStructure extends RecursiveSpatialStructure<
    InterposedSpatialStructureBase<any>,
    TerminalSpatialStructureBase
  >
>(api: GetUpdatedRecursiveSpatialStructureApi<BaseRecursiveSpatialStructure>) {
  const { baseStructure, getScopedStructureUpdates } = api
  return getUpdatedScopedStructure({
    baseStructure,
    getScopedStructureUpdates,
    scopedStructure: baseStructure,
    structureIndex: 0,
  })
}

interface GetUpdatedScopedStructureApi<
  BaseRecursiveSpatialStructure extends RecursiveSpatialStructure,
  CurrentScopedStructure extends
    | BaseRecursiveSpatialStructure
    | BaseRecursiveSpatialStructure['subStructure']
> extends Pick<
    GetUpdatedRecursiveSpatialStructureApi<BaseRecursiveSpatialStructure>,
    'baseStructure' | 'getScopedStructureUpdates'
  > {
  scopedStructure: CurrentScopedStructure
  structureIndex: number
}

function getUpdatedScopedStructure<
  BaseRecursiveSpatialStructure extends RecursiveSpatialStructure,
  CurrentScopedStructure extends
    | BaseRecursiveSpatialStructure
    | BaseRecursiveSpatialStructure['subStructure']
>(
  api: GetUpdatedScopedStructureApi<
    BaseRecursiveSpatialStructure,
    CurrentScopedStructure
  >
): CurrentScopedStructure {
  const {
    baseStructure,
    getScopedStructureUpdates,
    structureIndex,
    scopedStructure,
  } = api
  const scopedStructureUpdates = getScopedStructureUpdates({
    baseStructure,
    structureIndex,
    scopedStructureBase: scopedStructure,
  })
  switch (scopedStructure.structureType) {
    case 'initialStructure':
    case 'interposedStructure':
      const updatedSubStructure = getUpdatedScopedStructure({
        baseStructure,
        getScopedStructureUpdates,
        scopedStructure: scopedStructure.subStructure,
        structureIndex: structureIndex + 1,
      })
      return {
        ...scopedStructure,
        ...scopedStructureUpdates,
        subStructure: updatedSubStructure,
        // subStructure: null => doesnt throw error
      }
    case 'terminalStructure':
      return {
        ...scopedStructure,
        ...scopedStructureUpdates,
      }
  }
}
