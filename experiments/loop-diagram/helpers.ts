// export interface GetAdjustedSampleAngleApi {
//   sampleAngle: number
// }

// export function getAdjustedSampleAngle(api: GetAdjustedSampleAngleApi) {
//   const { sampleAngle } = api
//   const positiveSampleAngle =
//     ((sampleAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
//   return (positiveSampleAngle === 0 &&
//     positiveSampleAngle === (2 * Math.PI) / 4) ||
//     positiveSampleAngle === ((2 * Math.PI) / 4) * 3 ||
//     positiveSampleAngle === 2 * Math.PI
//     ? positiveSampleAngle + 0.00000001
//     : positiveSampleAngle
// }
