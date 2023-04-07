export enum ERole {
  'basic',
  'premium',
  'special',
  'asistente',
  'operador',
  'administrador',
  'técnico',
}
export type IRole = keyof typeof ERole;
