import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { SnotifyService } from 'ng-snotify';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UsuariosWS } from '../../../providers/ws/usuario.ws';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Usuario } from '../../../model/usuario';
import { Component, OnInit, ViewChild, ViewContainerRef, Injectable, ViewEncapsulation , Input } from '@angular/core';
import {UsuarioComponent} from '../cadastrar-usuario/usuario.component';
import {UpdateUsuarioComponent} from '../update-usuario/update-usuario.component';
import { NgbModal,  } from '@ng-bootstrap/ng-bootstrap';
import {PaginatorPage} from '../../../providers/utils/paginator-page';
import {forkJoin} from 'rxjs';
import { GlobalVars } from './../../../providers/utils/global-vars';
import { UsuarioLogado } from '../../../model/usuario-logado';

@Component({
  selector: 'app-listar-usuario',
  templateUrl: './listar-usuario.component.html',
  styleUrls: ['./listar-usuario.component.css'],
 
 
})
@Injectable()
export class ListarUsuarioComponent extends PaginatorPage  implements OnInit {
  displayedColumns: string[] = ['oidempresa', 'nmempresa', 'nrcnpj', 'nrtelefone', 'dsendereco'];
 dataSource: MatTableDataSource<Usuario>;
 
 @ViewChild(MatPaginator) paginator: MatPaginator;
 @ViewChild(MatSort) sort: MatSort;
 listarUsuario : Usuario[];
 pageUsuario: number;
 linesPerPageUsuario: number;
 totalRecordsUsuario: number;
 nmusuario : string;
 usuario: Usuario;
 constructor(public modal :  NgbModal, private usuariosWS: UsuariosWS, private spinner: NgxSpinnerService, private router: Router,
  public dialog: MatDialog, private snotifyService: SnotifyService, private globalVars: GlobalVars,) {
    super();
   this.buscarDadosPagina();
   
 }
 ngOnInit() {
  this.pageUsuario = 0;
  this.linesPerPageUsuario = 15;
  this.totalRecordsUsuario = 0;

  this.carregarDadosTabela();
  this.buscarDadosPagina(); 
 }

 open(usuario: Usuario): void {
  const dialogRef = this.dialog.open(UsuarioComponent, {
    width: '550px',
    data: {
      usuario: usuario == null ? <Usuario>{} : usuario
    }
  });
}


 private buscarDados() {
   this.spinner.show();
   this.usuariosWS.findAll().subscribe(result => {
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
  this.router.navigate(['/usuario'], {queryParams: {id : oid}});
}
 
excluir(oid: number) {
  console.log(oid);
  const dialogRef = this.dialog.open(UpdateUsuarioComponent, {
    width: '250px',
  });
 
  dialogRef.afterClosed().subscribe(result => {
    if (result != null && result) {
      this.spinner.show();
      this.usuariosWS.delete(oid).subscribe( result2 => {
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
abrirDialogCadastrarUsuario(usuario: Usuario): void {
  const dialogRef = this.dialog.open(UpdateUsuarioComponent, {
    width: '600px',
    data: {
      usuario: usuario == null ? <Usuario>{} : usuario
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result != null) {
      this.buscarDadosPagina();
    }

  });
}

abrirDialogDeletarUsuario(oid: number): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '420px',
    data: {icon: 'material-icons', text: 'Tem certeza que deseja excluir este registro ?'}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result != null && result) {
      this.spinner.show();
      this.usuariosWS.delete(oid).subscribe(result2 => {
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

buscarDadosPagina() {
  this.page = 0;
  this.pageUsuario = 0;
  const usuarioLogado: UsuarioLogado = this.globalVars.getUsuarioLogado();
  this.nmusuario = usuarioLogado.login; 
  this.spinner.show();
  forkJoin(
  this.usuariosWS.findAll(this.page, this.linesPerPage, 'nmusuario', 'ASC', this.searchField, this.nmusuario) ,

  ).subscribe(data => {
    this.totalRecords = data[0]['totalElements'];
    this.listarUsuario = data[0]['content'];

this.spinner.hide();
  }, error => {
    this.spinner.hide();
    this.snotifyService.error(this.globalVars.getMensagemErroPadrao());
    console.log(error);
  });

}

buscarUsuario(event) {
  if (event == null) {
    this.page = 0;
  } else {
    this.page = this.calcularPagina(event);
  }
  this.spinner.show();
this.usuariosWS.findAll(this.page, this.linesPerPage, 'nmusuario', 'ASC', this.searchField, this.nmusuario).subscribe(result => {
    this.totalRecords = result['totalElements'];
    this.listarUsuario = result['content'];

    this.spinner.hide();
  }, error => {
    this.spinner.hide();
    this.snotifyService.error(this.globalVars.getMensagemErroPadrao());
    console.log(error);
  });
}

}
