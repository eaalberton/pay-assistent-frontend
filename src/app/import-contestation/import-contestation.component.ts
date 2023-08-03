import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ContestationService } from '../service/contestation.service';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImportContestationDTO } from '../model/ImportContestationDTO';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-import-contestation',
  templateUrl: './import-contestation.component.html',
  styleUrls: ['./import-contestation.component.css']
})
export class ImportContestationComponent implements AfterViewChecked {

  importContestation = new ImportContestationDTO();

  isValueChanged:boolean = true;
  isLoading:boolean = false;

  response: string = '';

  constructor(
    private service:ContestationService,
    private _snackBar: MatSnackBar,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.validadeAuth();
  }

  validadeAuth() {
    this.authService.validadeAuth().subscribe()
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  import(arquivoSelecionado: File) {

    this.isLoading = true;

    const formData = new FormData();
    formData.append("file", arquivoSelecionado);

    this.importContestation.fileName = arquivoSelecionado.name;

    this.service.import(formData)
    .subscribe(result => {
      this.response = result; 
      this.openSnackBar("Arquivo importado com sucesso!", 'Ok');
      this.isValueChanged = false;

      this.isLoading = false;
    });

  }

  onValueChange() {
    this.isValueChanged = true;
  }

  new() {
    this.importContestation = new ImportContestationDTO();
    this.isValueChanged = true;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 10000 });
  }

  ngAfterViewInit() {
    
  }

  // @ts-ignore
  onFileSelected(event) {
    const arquivoSelecionado: File = <File>event.target.files[0];

    if (arquivoSelecionado) {
      this.import(arquivoSelecionado);
    }
  }

}
