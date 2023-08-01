import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CentroCustoWS } from '../../../providers/ws/centro-custo.ws';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { CentroCusto } from '../../../model/centro-custo';
import { Component, OnInit, ViewChild, ViewContainerRef, Injectable, ViewEncapsulation , Input } from '@angular/core';
import {CentroCustoComponent} from '../cadastrar-centro-custo/centro-custo.component';
import {UpdateCentroCustoComponent} from '../update-centro-custo/update-centro-custo.component';
import { NgbModal,  } from '@ng-bootstrap/ng-bootstrap';
import {PaginatorPage} from '../../../providers/utils/paginator-page';
import {forkJoin} from 'rxjs';
import { GlobalVars } from './../../../providers/utils/global-vars';
import { UsuarioLogado } from '../../../model/usuario-logado';


@Component({
  selector: 'app-listar-centro-custo',
  templateUrl: './listar-centro-custo.component.html',
  styleUrls: ['./listar-centro-custo.component.css'],
 
 
})
@Injectable()
export class ListarCentroCustoComponent extends PaginatorPage  implements OnInit {
  displayedColumns: string[] = ['oidempresa', 'nmempresa', 'nrcnpj', 'nrtelefone', 'dsendereco'];
 dataSource: MatTableDataSource<CentroCusto>;
 
 @ViewChild(MatPaginator) paginator: MatPaginator;
 @ViewChild(MatSort) sort: MatSort;
 listarCentroCusto : CentroCusto[];
 pageCentroCusto: number;
 linesPerPageCentroCusto: number;
 totalRecorCentroCusto: number;
 teste : string;
 nmusuario : string;
 constructor(public modal :  NgbModal, private centrocustoWS: CentroCustoWS, private spinner: NgxSpinnerService, private router: Router,
  public dialog: MatDialog, private snotifyService: SnotifyService, private globalVars: GlobalVars,) {
    super();

   this.buscarDadosPagina();
 }

 ngOnInit() {
  this.pageCentroCusto = 0;
  this.linesPerPageCentroCusto = 15;
  this.totalRecorCentroCusto = 0;

  this.carregarDadosTabela();
  this.buscarDadosPagina(); 
 }

 open(): void {
  const dialogRef = this.dialog.open(CentroCustoComponent, {
    width: '550px',
  });
}


 private buscarDados() {
   this.spinner.show();
   this.centrocustoWS.findAll().subscribe(result => {
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
  this.router.navigate(['/centro-custo'], {queryParams: {id : oid}});
}
 
excluir(oid: number) {
  console.log(oid);
  const dialogRef = this.dialog.open(UpdateCentroCustoComponent, {
    width: '250px',
  });
 
  dialogRef.afterClosed().subscribe(result => {
    if (result != null && result) {
      this.spinner.show();
      this.centrocustoWS.delete(oid).subscribe( result2 => {
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
abrirDialogCadastrarCentroCusto(centrocusto: CentroCusto): void {
  const dialogRef = this.dialog.open(UpdateCentroCustoComponent, {
    width: '600px',
    data: {
      centrocusto: centrocusto == null ? <CentroCusto>{} : centrocusto
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
  this.pageCentroCusto = 0;
  const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
  this.nmusuario = usuarioLogado.login;
  this.spinner.show();
  forkJoin(
  this.centrocustoWS.findAll(this.page, this.linesPerPage, 'vrcustoAprovado', 'ASC', this.searchField,  this.nmusuario) ,
  ).subscribe(data => {
    this.totalRecords = data[0]['totalElements'];
    this.listarCentroCusto = data[0]['content'];

this.spinner.hide();
  }, error => {
    this.spinner.hide();
    this.snotifyService.error(this.globalVars.getMensagemErroPadrao());
    console.log(error);
  });

}

buscarCentroCusto(event) {
  if (event == null) {
    this.page = 0;
  } else {
    this.page = this.calcularPagina(event);
  }
  this.spinner.show();
this.centrocustoWS.findAll(this.page, this.linesPerPage, 'vrcustoAprovado', 'ASC', this.searchField, this.nmusuario).subscribe(result => {
    this.totalRecords = result['totalElements'];
    this.listarCentroCusto = result['content'];

    this.spinner.hide();
  }, error => {
    this.spinner.hide();
    this.snotifyService.error(this.globalVars.getMensagemErroPadrao());
    console.log(error);
  });
}
abrirDialogDeletarCentroCusto(oid: number): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '420px',
    data: {icon: 'material-icons', text: 'Tem certeza que deseja excluir este registro ?'}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result != null && result) {
      this.spinner.show();
      this.centrocustoWS.delete(oid).subscribe(result2 => {
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
