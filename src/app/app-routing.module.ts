

import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import {AuthGuard} from './auth/auth.guard';
import {HomeComponent} from './pages/home/home.component';
import {LoginComponent} from './pages/login/login.component';
import{ProjetosComponent} from  './pages/projetos/cadastrar-projetos/projetos.component';
import{ListarProjetosComponent} from  './pages/projetos/listar-projetos/listar-projetos.component';
import{UpdateProjetosComponent} from  './pages/projetos/update-projetos/update-projetos.component';
import {CentroCustoComponent} from './pages/centro_custo/cadastrar-centro-custo/centro-custo.component';
import {ListarCentroCustoComponent} from './pages/centro_custo/listar-cento-custo/listar-centro-custo.component';
import {AtividadesComponent} from './pages/atividades/cadastrar-atividades/atividades.component';
import {ListarAtividadesComponent} from './pages/atividades/listar-atividades/listar-atividades.component';
import {EmpresaComponent} from './pages/empresa/cadastrar-empresa/empresa.component';
import {UpdateEmpresaComponent} from './pages/empresa/update-empresa/update-empresa.component';
import {ListarEmpresaComponent} from './pages/empresa/listar-empresa/listar-empresa.component';
import {RecursosComponent} from './pages/recursos/cadastrar-recursos/recursos.component';
import {ListarRecursosComponent} from './pages/recursos/listar-recursos/listar-recursos.component';
import {TipoAtividadesComponent} from './pages/tipo-atividade/cadastrar-tipo-atividade/tipo-atividade.component';
import {ListartipoAtividadeComponent} from './pages/tipo-atividade/listar-tripo-atividade/listar-tipo-atividade.component';
import {UpdatetipoAtividadeComponent} from './pages/tipo-atividade/update-tipo-atividade/update-tipo-atividade.component';
import {UsuarioComponent} from './pages/usuario/cadastrar-usuario/usuario.component';
import {ListarUsuarioComponent} from './pages/usuario/listar-usuario/listar-usuario.component';
import {UpdateUsuarioComponent} from './pages/usuario/update-usuario/update-usuario.component';
import {ApontamentosComponent} from './pages/apontamentos/cadastrar-apontamentos/apontamentos.component';
import {ListarApontamentosComponent} from './pages/apontamentos/listar-apontamentos/listar-apontamentos.component';
import {UpdateApontamentosComponent} from './pages/apontamentos/update-apontamentos/update-apontamentos.component';
import {ConfirmDialogComponent} from './pages/dialog/confirm-dialog/confirm-dialog.component';
import {NgbActiveModal, NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {UpdateAtividadesComponent} from './pages/atividades/update-atividades/update-atividades.component';
import {UpdateCentroCustoComponent} from './pages/centro_custo/update-centro-custo/update-centro-custo.component';
import {UpdateRecursosComponent}  from './pages/recursos/update-recursos/update-recursos.component'
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';



const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'confirm-dialog', component: ConfirmDialogComponent, canActivate: [AuthGuard]},
  { path: 'apontamentos', component: ApontamentosComponent, canActivate: [AuthGuard] },
  { path: 'listar-apontamentos', component: ListarApontamentosComponent, canActivate: [AuthGuard] },
  { path: 'update-apontamentos', component: UpdateApontamentosComponent, canActivate: [AuthGuard] },
  { path: 'atividades', component: AtividadesComponent, canActivate: [AuthGuard] },
  { path: 'listar-atividades', component: ListarAtividadesComponent, canActivate: [AuthGuard] },
  { path: 'update-atividades', component: UpdateAtividadesComponent, canActivate: [AuthGuard] },
  { path: 'centro-custo', component: CentroCustoComponent, canActivate: [AuthGuard] },
  { path: 'listar-centro-custo', component: ListarCentroCustoComponent, canActivate: [AuthGuard] },
  { path: 'update-centro-custo', component: UpdateCentroCustoComponent, canActivate: [AuthGuard] },
  { path: 'empresa', component: EmpresaComponent, canActivate: [AuthGuard] },
  { path: 'listar-empresa', component: ListarEmpresaComponent, canActivate: [AuthGuard] },
  { path: 'update-empresa', component: UpdateEmpresaComponent, canActivate: [AuthGuard] },
  { path: 'projetos', component:ProjetosComponent, canActivate: [AuthGuard] },
  { path: 'listar-projetos', component:ListarProjetosComponent, canActivate: [AuthGuard] },
  { path: 'update-projetos', component:UpdateProjetosComponent, canActivate: [AuthGuard] },
  { path: 'recursos', component: RecursosComponent, canActivate: [AuthGuard] },
  { path: 'listar-recursos', component: ListarRecursosComponent, canActivate: [AuthGuard] },
  { path: 'update-recursos',component: UpdateRecursosComponent, canActivate: [AuthGuard] },
  { path: 'tipo-atividade', component: TipoAtividadesComponent, canActivate: [AuthGuard] },
  { path: 'listar-tipo-atividade', component: ListartipoAtividadeComponent, canActivate: [AuthGuard] },
  {path: 'update-tipo-atividade', component: UpdatetipoAtividadeComponent, canActivate: [AuthGuard]},
  { path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard]},
  { path: 'listar-usuario', component: ListarUsuarioComponent, canActivate: [AuthGuard]},
  { path: 'update-usuario', component: UpdateUsuarioComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    NgbModule.forRoot(),
  
  ],
  declarations: [],
  exports: [RouterModule]
})
export class AppRoutingModule { }
