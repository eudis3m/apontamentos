import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AtividadesWS } from '../../../providers/ws/atividades.ws';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Atividades } from '../../../model/atividades';
import { Component, OnInit, ViewChild, ViewContainerRef, Injectable, ViewEncapsulation , Input } from '@angular/core';
import {AtividadesComponent} from '../cadastrar-atividades/atividades.component';
import {UpdateAtividadesComponent} from '../update-atividades/update-atividades.component';
import { NgbModal,  } from '@ng-bootstrap/ng-bootstrap';
import {PaginatorPage} from '../../../providers/utils/paginator-page';
import {forkJoin} from 'rxjs';
import { GlobalVars } from './../../../providers/utils/global-vars';
import {Projetos} from '../../../model/projetos';
import {Recursos} from '../../../model/recursos';
import { UsuarioLogado } from '../../../model/usuario-logado';


@Component({
  selector: 'app-listar-atividades',
  templateUrl: './listar-atividades.component.html',
  styleUrls: ['./listar-atividades.component.css'],
 
 
})
@Injectable()
export class ListarAtividadesComponent extends PaginatorPage  implements OnInit {
  displayedColumns: string[] = ['oidempresa', 'nmempresa', 'nrcnpj', 'nrtelefone', 'dsendereco'];
 dataSource: MatTableDataSource<Atividades>;
 
 @ViewChild(MatPaginator) paginator: MatPaginator;
 @ViewChild(MatSort) sort: MatSort;
 listarAtividades : Atividades[];
 pageAtividades: number;
 linesPerPageAtividades: number;
 totalRecordsAtividades: number;
 nmusuario : string;
 constructor(public modal :  NgbModal, private atividadesWS: AtividadesWS, private spinner: NgxSpinnerService, private router: Router,
  public dialog: MatDialog, private snotifyService: SnotifyService, private globalVars: GlobalVars,) {
    super();

   this.buscarDadosPagina(); 
 }

 ngOnInit() {
  this.pageAtividades = 0;
  this.linesPerPageAtividades = 15;
  this.totalRecordsAtividades = 0;

  this.carregarDadosTabela();
  this.buscarDadosPagina(); 
 }

 open(projetos : Projetos, recursos : Recursos, atividades : Atividades): void {
  const dialogRef = this.dialog.open(AtividadesComponent, {
    width: '550px',
    data: {
      projetos: projetos == null ? <Projetos>{} : projetos,
      recursos: recursos == null ? <Recursos>{}: recursos,
      atividades: atividades ==null ? <Atividades>{}: atividades
  }
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result != null) {
      this.buscarDadosPagina();
    }
  });
}


 private buscarDados() {
   this.spinner.show();
   this.atividadesWS.findAll().subscribe(result => {
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
  this.router.navigate(['/atividades'], {queryParams: {id : oid}});
}
 
excluir(oid: number) {
  console.log(oid);
  const dialogRef = this.dialog.open(UpdateAtividadesComponent, {
    width: '250px',
  });
 
  dialogRef.afterClosed().subscribe(result => {
    if (result != null && result) {
      this.spinner.show();
      this.atividadesWS.delete(oid).subscribe( result2 => {
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
abrirDialogCadastrarAtividades(atividades: Atividades): void {
  const dialogRef = this.dialog.open(UpdateAtividadesComponent, {
    width: '600px',
    data: {
      atividades: atividades == null ? <Atividades>{} : atividades
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
  this.pageAtividades = 0;
  const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
  this.nmusuario = usuarioLogado.login;
  this.spinner.show();
  forkJoin(
  this.atividadesWS.findAll(this.page, this.linesPerPage, 'nmProjetos', 'ASC', this.searchField,  this.nmusuario) ,
  ).subscribe(data => {
    this.totalRecords = data[0]['totalElements'];
    this.listarAtividades = data[0]['content'];

this.spinner.hide();
  }, error => {
    this.spinner.hide();
    this.snotifyService.error(this.globalVars.getMensagemErroPadrao());
    console.log(error);
  });

}

buscarAtividades(event) {
  if (event == null) {
    this.page = 0;
  } else {
    this.page = this.calcularPagina(event);
  }
  this.spinner.show();
this.atividadesWS.findAll(this.page, this.linesPerPage, 'nmProjetos', 'ASC', this.searchField, this.nmusuario).subscribe(result => {
    this.totalRecords = result['totalElements'];
    this.listarAtividades = result['content'];

    this.spinner.hide();
  }, error => {
    this.spinner.hide();
    this.snotifyService.error(this.globalVars.getMensagemErroPadrao());
    console.log(error);
  });
}

abrirDialogDeletarAtividades(oid: number): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '420px',
    data: {icon: 'material-icons', text: 'Tem certeza que deseja excluir este registro ?'}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result != null && result) {
      this.spinner.show();
      this.atividadesWS.delete(oid).subscribe(result2 => {
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
