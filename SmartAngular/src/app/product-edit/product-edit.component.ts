import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductDetailService } from '../shared/product-detail.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  productForm:FormGroup;
  submitted: boolean;
  imageUrl: string="/assets/images/upload.png";
  public response: { dbPath:''};

  constructor(private actRoute:ActivatedRoute,
              public service:ProductDetailService,
              private toastr:ToastrService,
              private formBuilder: FormBuilder,
              private router:Router
             ) { }

  ngOnInit(): void {
    const id = parseInt(this.actRoute.snapshot.paramMap.get('id'));
    this.productForm = this.formBuilder.group
    ({
      id: [0, Validators.required],
      name: ['', Validators.required],
      price: ['', Validators.required],
      photo: ['', [Validators.required]],
      lastUpdate: ['']
    }); 

    this.service.GetProduct(id).subscribe(data => {
      this.service.productDetail = data;
      this.imageUrl = 'http://localhost:12564' + this.service.productDetail.Photo;
      //this.imageUrl = 'http://localhost:12564/${this.service.productDetail.Photo}';
      this.productForm.controls['id'].setValue(this.service.productDetail.Id); 
      this.productForm.controls['name'].setValue(this.service.productDetail.Name); 
      this.productForm.controls['price'].setValue(this.service.productDetail.Price); 
      this.productForm.controls['photo'].setValue(this.service.productDetail.Photo); 
    });
  }

  get f() { return this.productForm.controls; }
  //
  handleFileInput(file :FileList){
    this.service.fileToUpload = file.item(0);  
    // privew
    var reader = new FileReader();
    reader.onload =(event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.service.fileToUpload);
  }
  // save update
  onSubmit(){
    this.submitted = true;
       if (this.productForm.invalid) 
       {
           return;
       }
       else
       { 
          this.service.putProduct(this.productForm.value).subscribe(
            res =>
            {
              this.service.refreshProducts(null);
              this.toastr.info("Submitted Successfull","Product Update");
              this.router.navigate(['/products']);
            },
            err => {
              console.log(err);
            });
      }
  }
}
