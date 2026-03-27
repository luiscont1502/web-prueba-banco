import { ClienteModel } from "./ClienteModel";

export interface ReclamoModel {
    reclamoId: number;
    cliente: ClienteModel;
    tipoReclamo: string;
    detalleReclamo: string;
    active: boolean;
    creationDate?: string;
    modificationDate?: string;
}
