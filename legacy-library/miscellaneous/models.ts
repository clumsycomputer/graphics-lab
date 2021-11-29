export type DistributiveOmit<
  SomeObject extends object,
  ObjectKey extends keyof SomeObject
> = SomeObject extends SomeObject ? Omit<SomeObject, ObjectKey> : never
