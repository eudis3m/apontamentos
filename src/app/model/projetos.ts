import { Empresa } from "./empresa";

export interface Projetos {
    readonly oid: number;
    nmprojeto: string;
    nmEmpresa: string;
    empresaEntity : Empresa;
    vrcustoAprovado: number;
    dtprojetoInicio: Date;
    dtprojetoFinal: Date;
    dsdescricaoProjeto: String;
    nmusuario : string;
}

