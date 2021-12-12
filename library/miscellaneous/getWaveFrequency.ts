export interface GetWaveFrequencyApi {
  baseFrequency: number
  scaleResolution: number
  frequencyIndex: number
}

export function getWaveFrequency(api: GetWaveFrequencyApi) {
  const { baseFrequency, frequencyIndex, scaleResolution } = api
  return baseFrequency * Math.pow(2, frequencyIndex / scaleResolution)
}
