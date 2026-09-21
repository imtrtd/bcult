export const CONTACT_EMAIL = 'imtrtd@pm.me'
export const PACKAGE_KEY = 'bcult-package'
export const PACKAGE_CODES = ['MARK', 'RELEASE', 'SYSTEM', 'MIX'] as const
export type PackageCode = (typeof PACKAGE_CODES)[number]

export function isPackageCode(value: string): value is PackageCode {
  return (PACKAGE_CODES as readonly string[]).includes(value)
}
