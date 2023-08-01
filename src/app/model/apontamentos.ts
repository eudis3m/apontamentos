import { Atividades } from './atividades';
export interface Apontamentos {
    readonly oid: number;
    oidatividade: number;
    dtapontamento: Date;
    nrapontamento: number;
    dtlancamento : Date;
    vratividade: number;
    nmRecursos : string;
    atividadeEntity?: Atividades[];
    apontamentosEntity?: Apontamentos[];
    nmusuario : string;
   
}
