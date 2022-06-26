import * as React from 'react';
import { V1DataLayer } from './v1/dataLayer';

export const dataLayer = new V1DataLayer();
export const DataLayerContext = React.createContext<V1DataLayer>(dataLayer);
export const useDataLayerContext = () => React.useContext(DataLayerContext);
