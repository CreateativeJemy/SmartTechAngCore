import { Component, OnInit } from '@angular/core';
import { ProductDetailService } from '../shared/product-detail.service';
import { ProductDetail } from '../shared/product-detail.model';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ExcelService } from '../shared/exportexcel.service';

@Component({
  selector: 'app-product-detail-list',
  templateUrl: './product-detail-list.component.html',
  styles: []
})
export class ProductDetailListComponent implements OnInit {

  constructor(public service: ProductDetailService,
              private excelService: ExcelService,
              private formBuilder: FormBuilder,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.service.refreshProducts(null);
  }
  searchProducts(txtSearch:string){
    if(txtSearch){
      this.service.refreshProducts(txtSearch);
    }
  }
  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.service.listData, 'sample');
 }

  onDelete(id:number){
    if(confirm("Are You Sure You Want Delete Product")){
      this.service.deleteProduct(id).subscribe(
        res => {
          this.toastr.warning("Deleted Successfull","Delete Product");
          this.service.refreshProducts(null);
        },
        err => {
          console.log(err);
        });
    }
  }
}
