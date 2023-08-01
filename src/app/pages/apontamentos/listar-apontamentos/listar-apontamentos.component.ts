import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApontamentosWS } from '../../../providers/ws/apontamentos.ws';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Apontamentos } from '../../../model/apontamentos';
import { Component, OnInit, ViewChild, ViewContainerRef, Injectable, ViewEncapsulation , Input } from '@angular/core';
import {ApontamentosComponent} from '../cadastrar-apontamentos/apontamentos.component';
import {UpdateApontamentosComponent} from '../update-apontamentos/update-apontamentos.component';
import { NgbModal,  } from '@ng-bootstrap/ng-bootstrap';
import {PaginatorPage} from '../../../providers/utils/paginator-page';
import {forkJoin} from 'rxjs';
import { GlobalVars } from './../../../providers/utils/global-vars';
import { UsuarioLogado } from '../../../model/usuario-logado';

@Component({
  selector: 'app-listar-apontamentos',
  templateUrl: './listar-apontamentos.component.html',
  styleUrls: ['./listar-apontamentos.component.css'],
 
 
})
@Injectable()
export class ListarApontamentosComponent extends PaginatorPage  implements OnInit {
  displayedColumns: string[] = ['oidempresa', 'nmempresa', 'nrcnpj', 'nrtelefone', 'dsendereco'];
 dataSource: MatTableDataSource<Apontamentos>;
 
 @ViewChild(MatPaginator) paginator: MatPaginator;
 @ViewChild(MatSort) sort: MatSort;
 listarApontamentos : Apontamentos[];
 pageApontamentos: number;
 linesPerPageApontamentos: number;
 totalRecordsApontamentos: number;
 teste : string;
 atividadeslista: string[];
 nmusuario : string;
 constructor(public modal :  NgbModal, private apontamentosWS: ApontamentosWS, private spinner: NgxSpinnerService, private router: Router,
  public dialog: MatDialog, private snotifyService: SnotifyService, private globalVars: GlobalVars,) {
    super();
   //this.buscarDados();
   this.buscarDadosPagina(); 
 }
   // Paginação
 ngOnInit() {
  this.pageApontamentos = 0;
  this.linesPerPageApontamentos = 15;
  this.totalRecordsApontamentos = 0;

  this.carregarDadosTabela();
  this.buscarDadosPagina(); 
  //this.buscarDados();
 }

 open(apontamentos: Apontamentos): void {
  const dialogRef = this.dialog.open(ApontamentosComponent, {
    width: '550px',
    data: {
      apontamentos: apontamentos == null ? <Apontamentos>{} : apontamentos
     }
  });
}


 private buscarDados() {
   this.spinner.show();
   this.apontamentosWS.findAll().subscribe(result => {
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
  this.router.navigate(['/apontamentos'], {queryParams: {id : oid}});
}
 
excluir(oid: number) {
  console.log(oid);
  const dialogRef = this.dialog.open(UpdateApontamentosComponent, {
    width: '250px',
  });
 
  dialogRef.afterClosed().subscribe(result => {
    if (result != null && result) {
      this.spinner.show();
      this.apontamentosWS.delete(oid).subscribe( result2 => {
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
abrirDialogCadastrarApontamentos(apontamentos: Apontamentos): void {
  const dialogRef = this.dialog.open(UpdateApontamentosComponent, {
    width: '600px',
    data: {
     apontamentos: apontamentos == null ? <Apontamentos>{} : apontamentos,
     listaAtividades: this.atividadeslista
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
  this.pageApontamentos = 0;
  const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
  this.nmusuario = usuarioLogado.login;
  this.spinner.show();
  forkJoin(
  this.apontamentosWS.findAll(this.page, this.linesPerPage, 'dtapontamento', 'ASC', this.searchField, this.nmusuario) ,
  ).subscribe(data => {
    this.totalRecords = data[0]['totalElements'];
    this.listarApontamentos = data[0]['content'];

this.spinner.hide();
  }, error => {
    this.spinner.hide();
    this.snotifyService.error(this.globalVars.getMensagemErroPadrao());
    console.log(error);
  });

}

public destroy(){
  return this.router.navigate(['/login']);
}

buscarApontamentos(event) {
  if (event == null) {
    this.page = 0;
  } else {
    this.page = this.calcularPagina(event);
  }
  this.spinner.show();
this.apontamentosWS.findAll(this.page, this.linesPerPage, 'dtapontamento', 'ASC', this.searchField, this.nmusuario).subscribe(result => {
    this.totalRecords = result['totalElements'];
    this.listarApontamentos = result['content'];

    this.spinner.hide();
  }, error => {
    this.spinner.hide();
    this.snotifyService.error(this.globalVars.getMensagemErroPadrao());
    console.log(error);
  });
}
abrirDialogDeletarApontamentos(oid: number): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '420px',
    data: {icon: 'material-icons', text: 'Tem certeza que deseja excluir este registro ?'}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result != null && result) {
      this.spinner.show();
      this.apontamentosWS.delete(oid).subscribe(result2 => {
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
