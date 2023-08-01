import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProjetosWS } from '../../../providers/ws/projetos.ws';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Projetos } from '../../../model/projetos';
import { Component, OnInit, ViewChild, ViewContainerRef, Injectable, ViewEncapsulation , Input } from '@angular/core';
import {ProjetosComponent} from '../cadastrar-projetos/projetos.component';
import {UpdateProjetosComponent} from '../update-projetos/update-projetos.component';
import { NgbModal,  } from '@ng-bootstrap/ng-bootstrap';
import {PaginatorPage} from '../../../providers/utils/paginator-page';
import {forkJoin} from 'rxjs';
import { GlobalVars } from './../../../providers/utils/global-vars';
import { Empresa } from './../../../model/empresa';
import { CentroCusto  } from './../../../model/centro-custo';
import { UsuarioLogado } from '../../../model/usuario-logado';

@Component({
  selector: 'app-listar-projetos',
  templateUrl: './listar-projetos.component.html',
  styleUrls: ['./listar-projetos.component.css'],
 
 
})
@Injectable()
export class ListarProjetosComponent extends PaginatorPage  implements OnInit {
  displayedColumns: string[] = ['oidempresa', 'nmempresa', 'nrcnpj', 'nrtelefone', 'dsendereco'];
 dataSource: MatTableDataSource<Projetos>;
 
 @ViewChild(MatPaginator) paginator: MatPaginator;
 @ViewChild(MatSort) sort: MatSort;
 listarProjetos : Projetos[];
 pageProjetos: number;
 linesPerPageProjetos: number;
 totalRecordsProjetos: number;
 teste : string;
 nmusuario : string;
 constructor(public modal :  NgbModal, private projetosWS: ProjetosWS, private spinner: NgxSpinnerService, private router: Router,
  public dialog: MatDialog, private snotifyService: SnotifyService, private globalVars: GlobalVars,) {
    super();
   this.buscarDadosPagina(); 
 }

 ngOnInit() {
  this.pageProjetos = 0;
  this.linesPerPageProjetos = 15;
  this.totalRecordsProjetos = 0;

  this.carregarDadosTabela();
  this.buscarDadosPagina(); 
  //this.buscarDados();
 }

 open(empresa: Empresa, centrocusto: CentroCusto,projetos: Projetos): void {
  const dialogRef = this.dialog.open(ProjetosComponent, {
    width: '550px',
    data: {
      empresa: empresa == null ? <Empresa>{} : empresa,
      centrocusto: centrocusto == null ? <CentroCusto>{}: centrocusto,
      projetos: projetos ==null ? <Projetos>{}: projetos
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
   this.projetosWS.findAll().subscribe(result => {
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
  this.router.navigate(['/projetos'], {queryParams: {id : oid}});
}
 
excluir(oid: number) {
  console.log(oid);
  const dialogRef = this.dialog.open(UpdateProjetosComponent, {
    width: '250px',
  });
 
  dialogRef.afterClosed().subscribe(result => {
    if (result != null && result) {
      this.spinner.show();
      this.projetosWS.delete(oid).subscribe( result2 => {
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
abrirDialogCadastrarProjetos(projetos: Projetos): void {
  //debugger;
  const dialogRef = this.dialog.open(UpdateProjetosComponent, {
    width: '600px',
  
    data: {
      projetos: projetos == null ? <Projetos>{} : projetos
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
  this.pageProjetos = 0;
  const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
  this.nmusuario = usuarioLogado.login;
  this.spinner.show();
  forkJoin(
  this.projetosWS.findAll(this.page, this.linesPerPage, 'nmprojeto', 'ASC', this.searchField, this.nmusuario) ,
  ).subscribe(data => {
    this.totalRecords = data[0]['totalElements'];
    this.listarProjetos = data[0]['content'];

this.spinner.hide();
  }, error => {
    this.spinner.hide();
    //this.snotifyService.error(this.globalVars.getMensagemErroPadrao());
    console.log(error);
  });

}

buscarProjetos(event) {
  if (event == null) {
    this.page = 0;
  } else {
    this.page = this.calcularPagina(event);
  }
  this.spinner.show();
this.projetosWS.findAll(this.page, this.linesPerPage, 'nmprojeto', 'ASC', this.searchField, this.nmusuario).subscribe(result => {
    this.totalRecords = result['totalElements'];
    this.listarProjetos = result['content'];


    this.spinner.hide();
  }, error => {
    this.spinner.hide();
    this.snotifyService.error(this.globalVars.getMensagemErroPadrao());
    console.log(error);
  });
}

abrirDialogDeletarProjetos(oid: number): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '420px',
    data: {icon: 'material-icons', text: 'Tem certeza que deseja excluir este registro ?'}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result != null && result) {
      this.spinner.show();
      this.projetosWS.delete(oid).subscribe(result2 => {
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
