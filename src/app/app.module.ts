import {BrowserModule} from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA,LOCALE_ID} from '@angular/core';

import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
  MatPaginatorIntl,
  MatSelectModule,
  MatDialogRef,
  DateAdapter,
  MAT_DATE_LOCALE,
} from '@angular/material';
import {AppRoutingModule} from './/app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from './auth/auth.service';
import {AuthGuard} from './auth/auth.guard';
import {LoginComponent} from './pages/login/login.component';
import {HeaderComponent} from './pages/header/header.component';
import {HomeComponent} from './pages/home/home.component';
import {UsuariosWS} from './providers/ws/usuario.ws';
import {EnvironmentService} from './providers/environment/environment.service';
import {GlobalVars} from './providers/utils/global-vars';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JwtInterceptor} from './auth/jwt.interceptor';
import {ErrorInterceptor} from './auth/error.interceptor';
import {SnotifyModule, SnotifyService, ToastDefaults} from 'ng-snotify';
import {NgxSpinnerModule} from 'ngx-spinner';
import {LayoutModule} from '@angular/cdk/layout';
import {ConfirmDialogComponent} from './pages/dialog/confirm-dialog/confirm-dialog.component';
import { getBrPaginatorIntl } from './pages/paginator/paginator/paginator.component';
import {NgxMaskModule} from 'ngx-mask'
import { ApontamentosWS } from './providers/ws/apontamentos.ws';
import { AtividadesWS } from './providers/ws/atividades.ws';
import { CentroCustoWS } from './providers/ws/centro-custo.ws';
import {EmpresaWS } from './providers/ws/empresa.ws';
import {UpdateEmpresaWS } from './providers/ws/empresa-update.ws';
import {ProjetosWS } from './providers/ws/projetos.ws';
import {RecursosWS } from './providers/ws/recursos.ws';
import {TiposAtividadesWS } from './providers/ws/tipo-atividade.ws';
import {ApontamentosComponent} from './pages/apontamentos/cadastrar-apontamentos/apontamentos.component';
import {ListarApontamentosComponent} from './pages/apontamentos/listar-apontamentos/listar-apontamentos.component';
import {UpdateApontamentosComponent} from './pages/apontamentos/update-apontamentos/update-apontamentos.component';
import {AtividadesComponent} from './pages/atividades/cadastrar-atividades/atividades.component';
import {ListarAtividadesComponent} from './pages/atividades/listar-atividades/listar-atividades.component';
import {UpdateAtividadesComponent} from './pages/atividades/update-atividades/update-atividades.component';
import {CentroCustoComponent} from './pages/centro_custo/cadastrar-centro-custo/centro-custo.component';
import {UpdateCentroCustoComponent} from './pages/centro_custo/update-centro-custo/update-centro-custo.component';
import {ListarCentroCustoComponent} from './pages/centro_custo/listar-cento-custo/listar-centro-custo.component';
import {EmpresaComponent} from './pages/empresa/cadastrar-empresa/empresa.component';
import {ListarEmpresaComponent} from './pages/empresa/listar-empresa/listar-empresa.component';
import {UpdateEmpresaComponent} from './pages/empresa/update-empresa/update-empresa.component';
import {ProjetosComponent} from './pages/projetos/cadastrar-projetos/projetos.component';
import {ListarProjetosComponent} from './pages/projetos/listar-projetos/listar-projetos.component';
import {UpdateProjetosComponent} from './pages/projetos/update-projetos/update-projetos.component';
import {RecursosComponent} from './pages/recursos/cadastrar-recursos/recursos.component';
import {ListarRecursosComponent} from './pages/recursos/listar-recursos/listar-recursos.component';
import {UpdateRecursosComponent} from './pages/recursos/update-recursos/update-recursos.component';
import {TipoAtividadesComponent} from './pages/tipo-atividade/cadastrar-tipo-atividade/tipo-atividade.component';
import {ListartipoAtividadeComponent} from './pages/tipo-atividade/listar-tripo-atividade/listar-tipo-atividade.component';
import {UpdatetipoAtividadeComponent} from './pages/tipo-atividade/update-tipo-atividade/update-tipo-atividade.component';
import {UsuarioComponent} from './pages/usuario/cadastrar-usuario/usuario.component';
import {ListarUsuarioComponent} from './pages/usuario/listar-usuario/listar-usuario.component';
import {UpdateUsuarioComponent} from './pages/usuario/update-usuario/update-usuario.component';
import { MaterialModule } from './material.module';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/primeng';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { HttpModule, JsonpModule } from '@angular/http';
import { ButtonModule,} from 'primeng/primeng';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {CurrencyMaskModule} from 'ng2-currency-mask';
//import {FileUploadModule} from '@iplab/ngx-file-upload';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import localePtExtra from '@angular/common/locales/extra/pt';

  
// tslint:disable-next-line:max-line-length
registerLocaleData(localePt, 'pt', localePtExtra);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    HomeComponent,
    ConfirmDialogComponent,
    ApontamentosComponent,
    ListarApontamentosComponent,
    ListarAtividadesComponent,
    AtividadesComponent,
    UpdateAtividadesComponent,
    CentroCustoComponent,
    ListarCentroCustoComponent,
    EmpresaComponent,
    ListarEmpresaComponent,
    UpdateEmpresaComponent,
    ProjetosComponent,
    ListarProjetosComponent,
    UpdateProjetosComponent,
    RecursosComponent,
    ListarRecursosComponent,
    UpdateRecursosComponent,
    TipoAtividadesComponent,
    ListartipoAtividadeComponent,
    UpdatetipoAtividadeComponent,
    ListarUsuarioComponent,
    UpdateApontamentosComponent,
    UsuarioComponent,
    ConfirmDialogComponent,
    TipoAtividadesComponent, 
    UpdateUsuarioComponent,
    UpdateCentroCustoComponent,
    UpdateRecursosComponent
     
  ],
  imports: [
   /* BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SnotifyModule,
    NgxSpinnerModule,
    NgxMaskModule.forRoot(),
    BrowserModule, BrowserAnimationsModule, MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    DataTableModule,
    PaginatorModule,*/

     // primeNg
     TableModule,
     ButtonModule,
     DropdownModule,
     InputTextareaModule,

    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SnotifyModule,
    NgxSpinnerModule,
    NgxMaskModule.forRoot(),
    CurrencyMaskModule,
    //FileUploadModule,

    // Material Angular
    MatCheckboxModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatMenuModule,
     

    // Angular Material
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    MatDatepickerModule,
    MatNativeDateModule,

    // ROTAS
    AppRoutingModule,

    LayoutModule,

    MatSidenavModule,

    MatListModule,

  ],
  providers: [
    HttpClientModule,
    CurrencyPipe,
    AuthService,
    AuthGuard,
    GlobalVars,
    EnvironmentService,
    UsuariosWS,
    SnotifyService,
     ApontamentosWS,
     EmpresaWS,
     UpdateEmpresaWS,
     ProjetosWS,
     RecursosWS,
     TiposAtividadesWS,
     AtividadesWS,
    CentroCustoWS,
      CurrencyPipe,
    { provide: MatDialogRef, useValue: {}},
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: MatPaginatorIntl, useValue: getBrPaginatorIntl() },
    { provide: MAT_DATE_LOCALE, useValue: 'pt' },
    { provide: LOCALE_ID, useValue: 'pt' }

  ],
  bootstrap: [AppComponent],
  entryComponents: [ 
    UpdateEmpresaComponent,
    UpdateApontamentosComponent,
    UpdateAtividadesComponent,
    UpdateCentroCustoComponent,
    UpdateEmpresaComponent,
    UpdateProjetosComponent,
    UpdateRecursosComponent,
    UpdatetipoAtividadeComponent,
    UpdateUsuarioComponent

  ],
  /*schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]*/

})
export class AppModule { }

