export interface GetWaveFrequencyApi {
  baseFrequency: number
  scaleResolution: number
  frequencyIndex: number
}

export function getWaveFrequency(api: GetWaveFrequencyApi) {
  const { baseFrequency, frequencyIndex, scaleResolution } = api
  return baseFrequency * Math.pow(2, frequencyIndex / scaleResolution)
}

export interface GetNormalizedAngleApi {
  someAngle: number
}

export function getNormalizedAngle(api: GetNormalizedAngleApi) {
  const { someAngle } = api
  return ((someAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
}

export interface GetTriangleWaveSampleApi {
  sampleAngle: number
}

export function getTriangleWaveSample(api: GetTriangleWaveSampleApi) {
  const { sampleAngle } = api
  const normalizedSampleAngle = getNormalizedAngle({
    someAngle: sampleAngle,
  })
  const sampleAngleStamp = normalizedSampleAngle / (2 * Math.PI)
  const waveAmplitude = 1
  const waveAmplitudeRange = 2 * waveAmplitude
  const sampleAmplitudeStamp = sampleAngleStamp * waveAmplitudeRange
  return (
    waveAmplitude -
    Math.abs((sampleAmplitudeStamp % waveAmplitudeRange) - waveAmplitude) -
    waveAmplitude / 2
  )
}
