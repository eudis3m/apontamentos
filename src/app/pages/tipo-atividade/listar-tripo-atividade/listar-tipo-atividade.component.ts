import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TiposAtividadesWS } from '../../../providers/ws/tipo-atividade.ws';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { TiposAtividades } from '../../../model/tipo-atividade';
import { Component, OnInit, ViewChild, ViewContainerRef, Injectable, ViewEncapsulation , Input } from '@angular/core';
import {TipoAtividadesComponent} from '../cadastrar-tipo-atividade/tipo-atividade.component';
import {UpdatetipoAtividadeComponent} from '../update-tipo-atividade/update-tipo-atividade.component';
import { NgbModal,  } from '@ng-bootstrap/ng-bootstrap';
import {PaginatorPage} from '../../../providers/utils/paginator-page';
import {forkJoin} from 'rxjs';
import { GlobalVars } from './../../../providers/utils/global-vars';
import { UsuarioLogado } from '../../../model/usuario-logado';


@Component({
  selector: 'app-listar-tipo-atividade',
  templateUrl: './listar-tipo-atividade.component.html',
  styleUrls: ['./listar-tipo-atividade.component.css'],
 
 
})
@Injectable()
export class ListartipoAtividadeComponent extends PaginatorPage  implements OnInit {
  displayedColumns: string[] = ['oidempresa', 'nmempresa', 'nrcnpj', 'nrtelefone', 'dsendereco'];
 dataSource: MatTableDataSource<TiposAtividades>;
 
 @ViewChild(MatPaginator) paginator: MatPaginator;
 @ViewChild(MatSort) sort: MatSort;
 listarTipoAtividade : TiposAtividades[];
 pageTiposAtividades: number;
 linesPerPageTiposAtividades: number;
 totalRecordsTiposAtividades: number;
 nmusuario : string;
 constructor(public modal :  NgbModal, private tiposAtividadesWS: TiposAtividadesWS, private spinner: NgxSpinnerService, private router: Router,
  public dialog: MatDialog, private snotifyService: SnotifyService, private globalVars: GlobalVars,) {
    super();

   this.buscarDadosPagina(); 
 }

 ngOnInit() {
  this.pageTiposAtividades = 0;
  this.linesPerPageTiposAtividades = 15;
  this.totalRecordsTiposAtividades = 0;

  this.carregarDadosTabela();
  this.buscarDadosPagina(); 
 }

 open(): void {
  const dialogRef = this.dialog.open(TipoAtividadesComponent, {
    maxWidth: '100vw',
    maxHeight: '100vh',
    width: '575px',
    height: '85vh',
  });
}


 private buscarDados() {
   this.spinner.show();
   this.tiposAtividadesWS.findAll().subscribe(result => {
     this.spinner.hide();
     if (result != null) {
       this.dataSource = new MatTableDataSource(result);
     
     }
   }, error => {
     this.spinner.hide();
     console.log(error);
   });
 }

 applyFilter(filterValue: string) {
   this.dataSource.filter = filterValue.trim().toLowerCase();
   if (this.dataSource.paginator) {
     this.dataSource.paginator.firstPage();
   }
 }

editar(oid: number) {
  this.router.navigate(['/tipo-atividade'], {queryParams: {id : oid}});
}
 
excluir(oid: number) {
  console.log(oid);
  const dialogRef = this.dialog.open(UpdatetipoAtividadeComponent, {
    width: '250px',
  });
 
  dialogRef.afterClosed().subscribe(result => {
    if (result != null && result) {
      this.spinner.show();
      this.tiposAtividadesWS.delete(oid).subscribe( result2 => {
        console.log(result2);
        this.buscarDados();
        this.spinner.hide();
        this.snotifyService.success('Excluído com sucesso!');

      }, error => {
          this.spinner.hide();
          this.snotifyService.error(error);
      });
    }
  });
}
abrirDialogCadastrarTipoAtividade(tiposAtividades: TiposAtividades): void {
  const dialogRef = this.dialog.open(UpdatetipoAtividadeComponent, {
    maxWidth: '100vw',
    maxHeight: '100vh',
    width: '620px',
    height: '75vh',
    data: {
      tiposAtividades: tiposAtividades == null ? <TiposAtividades>{} : tiposAtividades
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result != null) {
      this.buscarDadosPagina();
    }

  });
}

buscarDadosPagina() {
  this.page = 0;
  this.pageTiposAtividades = 0;
  const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
  this.nmusuario = usuarioLogado.login;
  this.spinner.show();
  forkJoin(
  this.tiposAtividadesWS.findAll(this.page, this.linesPerPage, 'nmtipoAtividade', 'ASC', this.searchField, this.nmusuario) ,
  ).subscribe(data => {
    this.totalRecords = data[0]['totalElements'];
    this.listarTipoAtividade = data[0]['content'];

this.spinner.hide();
  }, error => {
    this.spinner.hide();
    this.snotifyService.error(this.globalVars.getMensagemErroPadrao());
    console.log(error);
  });

}

buscarTipoAtividade(event) {
  if (event == null) {
    this.page = 0;
  } else {
    this.page = this.calcularPagina(event);
  }
  this.spinner.show();
this.tiposAtividadesWS.findAll(this.page, this.linesPerPage, 'nmtipoAtividade', 'ASC', this.searchField, this.nmusuario).subscribe(result => {
    this.totalRecords = result['totalElements'];
    this.listarTipoAtividade = result['content'];

    this.spinner.hide();
  }, error => {
    this.spinner.hide();
    this.snotifyService.error(this.globalVars.getMensagemErroPadrao());
    console.log(error);
  });
}
abrirDialogDeletarTipoAtividade(oid: number): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '420px',
    data: {icon: 'material-icons', text: 'Tem certeza que deseja excluir este registro ?'}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result != null && result) {
      this.spinner.show();
      this.tiposAtividadesWS.delete(oid).subscribe(result2 => {
        this.spinner.hide();
        this.buscarDadosPagina();
        this.snotifyService.success('Excluído com sucesso!');

      }, error => {
        this.spinner.hide();
        this.snotifyService.error(this.globalVars.getMensagemErroPadrao());
        this.snotifyService.error(error);
      });
    }
  });
}
}