
export enum PlayerPosition {
  Attaquant = 'Attaquant',
  Défenseur = 'Défenseur',
  Milieu = 'Milieu',
  Gardien = 'Gardien'
}
export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  position: PlayerPosition;
  team: string;
  age: number;
  createdAt?: string;
  updatedAt?: string;
}
