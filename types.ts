export enum ViewMode {
  VECTOR = 'vector',
  STRING = 'string',
  COMPARISON = 'comparison'
}

export interface ArrayElement<T> {
  id: string;
  value: T;
  address: string; // Simulated hex address
  isNew?: boolean;
}

export interface VectorState<T> {
  elements: ArrayElement<T>[];
  capacity: number;
}
