export interface CarFeature {
  name: string;
  available: boolean;
}

export interface FeatureFormData {
  selectedFeatures: Set<string>;
  selectAll: boolean;
}

export interface FeatureHandlers {
  toggleFeature: (feature: string) => void;
  handleSelectAll: () => void;
  getFeatureArray: () => CarFeature[];
}