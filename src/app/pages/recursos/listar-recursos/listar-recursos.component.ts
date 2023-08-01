import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { RecursosWS } from '../../../providers/ws/recursos.ws';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Recursos } from '../../../model/recursos';
import { Component, OnInit, ViewChild, ViewContainerRef, Injectable, ViewEncapsulation , Input } from '@angular/core';
import {RecursosComponent} from '../cadastrar-recursos/recursos.component';
import {UpdateRecursosComponent} from '../update-recursos/update-recursos.component';
import { NgbModal,  } from '@ng-bootstrap/ng-bootstrap';
import {PaginatorPage} from '../../../providers/utils/paginator-page';
import {forkJoin} from 'rxjs';
import { GlobalVars } from './../../../providers/utils/global-vars';
import { UsuarioLogado } from '../../../model/usuario-logado';


@Component({
  selector: 'app-listar-recursos',
  templateUrl: './listar-recursos.component.html',
  styleUrls: ['./listar-recursos.component.css'],
 
 
})
@Injectable()
export class ListarRecursosComponent extends PaginatorPage  implements OnInit {
  displayedColumns: string[] = ['oidempresa', 'nmempresa', 'nrcnpj', 'nrtelefone', 'dsendereco'];
 dataSource: MatTableDataSource<Recursos>;
 
 @ViewChild(MatPaginator) paginator: MatPaginator;
 @ViewChild(MatSort) sort: MatSort;
 listarRecursos : Recursos[];
 pageRecursos: number;
 linesPerPageRecursos: number;
 totalRecordsRecursos: number;
 nmusuario : string;
 constructor(public modal :  NgbModal, private recursosWS: RecursosWS, private spinner: NgxSpinnerService, private router: Router,
  public dialog: MatDialog, private snotifyService: SnotifyService, private globalVars: GlobalVars,) {
    super();

   this.buscarDadosPagina(); 
 }

 ngOnInit() {
  this.pageRecursos = 0;
  this.linesPerPageRecursos = 15;
  this.totalRecordsRecursos = 0;

  this.carregarDadosTabela();
  this.buscarDadosPagina(); 
 }

 open(): void {
  const dialogRef = this.dialog.open(RecursosComponent, {
    maxWidth: '100vw',
    maxHeight: '100vh',
    width: '620px',
    height: '75vh',
  });
}


 private buscarDados() {
   this.spinner.show();
   this.recursosWS.findAll().subscribe(result => {
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
  this.router.navigate(['/recursos'], {queryParams: {id : oid}});
}
 
excluir(oid: number) {
  console.log(oid);
  const dialogRef = this.dialog.open(UpdateRecursosComponent, {
    maxWidth: '90vw',
    maxHeight: '100vh',
    width: '570px',
    height: '85vh',
  });
 
  dialogRef.afterClosed().subscribe(result => {
    if (result != null && result) {
      this.spinner.show();
      this.recursosWS.delete(oid).subscribe( result2 => {
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
abrirDialogCadastrarRecursos(recursos: Recursos): void {
  const dialogRef = this.dialog.open(UpdateRecursosComponent, {
    maxWidth: '100vw',
    maxHeight: '100vh',
    width: '620px',
    height: '70vh',
    data: {
      recursos:recursos == null ? <Recursos>{} : recursos
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
  this.pageRecursos = 0;
  this.spinner.show();
  const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
 this.nmusuario = usuarioLogado.login
  forkJoin(
  this.recursosWS.findAll(this.page, this.linesPerPage, 'nmrecursos', 'ASC', this.searchField, this.nmusuario) ,
  ).subscribe(data => {
    this.totalRecords = data[0]['totalElements'];
    this.listarRecursos = data[0]['content'];

this.spinner.hide();
  }, error => {
    this.spinner.hide();
    this.snotifyService.error(this.globalVars.getMensagemErroPadrao());
    console.log(error);
  });

}

buscarRecursos(event) {
  if (event == null) {
    this.page = 0;
  } else {
    this.page = this.calcularPagina(event);
  }
  this.spinner.show();
this.recursosWS.findAll(this.page, this.linesPerPage, 'nmrecursos', 'ASC', this.searchField, this.nmusuario).subscribe(result => {
    this.totalRecords = result['totalElements'];
    this.listarRecursos = result['content'];

    this.spinner.hide();
  }, error => {
    this.spinner.hide();
    this.snotifyService.error(this.globalVars.getMensagemErroPadrao());
    console.log(error);
  });
}
abrirDialogDeletarRecursos(oid: number): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '420px',
    data: {icon: 'material-icons', text: 'Tem certeza que deseja excluir este registro ?'}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result != null && result) {
      this.spinner.show();
      this.recursosWS.delete(oid).subscribe(result2 => {
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
