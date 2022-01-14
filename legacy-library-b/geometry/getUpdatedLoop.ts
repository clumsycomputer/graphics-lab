import {
  getUpdatedRecursiveSpatialStructure,
  GetUpdatedRecursiveSpatialStructureApi,
} from 'legacy-library-b/general'
import { LoopStructure } from './models'

export interface GetUpdatedLoopStructureApi
  extends GetUpdatedRecursiveSpatialStructureApi<LoopStructure> {}

export function getUpdatedLoopStructure(
  api: GetUpdatedLoopStructureApi
): LoopStructure {
  const { baseStructure, getScopedStructureUpdates } = api
  return getUpdatedRecursiveSpatialStructure({
    baseStructure,
    getScopedStructureUpdates,
  })
}
