import {Component, Inject} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Usuario} from '../../../model/usuario';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {

  dados: ObjectDialog;
  constructor(@Inject(MAT_DIALOG_DATA) public data: ObjectDialog) {
    this.dados = data;
  }
 
}
export interface ObjectDialog {
  icon: string;
  text: string;
}


