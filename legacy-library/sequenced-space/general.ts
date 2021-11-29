export interface GetElementIndicesApi<Element extends any> {
  someSpace: Element[]
  targetValue: Element
}

export function getElementIndices<Element extends any>(
  api: GetElementIndicesApi<Element>
): number[] {
  const { someSpace, targetValue } = api
  return someSpace.reduce<number[]>((result, someCellValue, cellIndex) => {
    if (someCellValue === targetValue) {
      result.push(cellIndex)
    }
    return result
  }, [])
}

export interface GetPhasedSpaceApi<Element extends any> {
  baseSpace: Element[]
  spacePhase: number
}

export function getPhasedSpace<Element extends any>(
  api: GetPhasedSpaceApi<Element>
): Element[] {
  const { baseSpace, spacePhase } = api
  const spaceLength = baseSpace.length
  return baseSpace.map(
    (someCell, cellIndex) =>
      baseSpace[(cellIndex + spacePhase + spaceLength) % spaceLength]!
  )
}
