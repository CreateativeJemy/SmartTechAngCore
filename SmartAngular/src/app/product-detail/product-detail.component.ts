import { Component, OnInit } from '@angular/core';
import { ProductDetailService } from '../shared/product-detail.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styles: [],
  providers:[ProductDetailService]
})

export class ProductDetailComponent implements OnInit {
  productForm:FormGroup;
  submitted: boolean;
  imageUrl: string="/assets/images/upload.png";

  constructor(private formBuilder:FormBuilder,
              public service:ProductDetailService,
              private router:Router,
              private toastr:ToastrService) { }

  ngOnInit() {
    this.productForm = this.formBuilder.group
    ({
      id: [0, Validators.required],
      name: ['', Validators.required],
      price: ['', Validators.required],
      photo: ['', [Validators.required]],
      lastUpdate: ['']
    });
  }

  handleFileInput(file :FileList){
    this.service.fileToUpload = file.item(0);  
    // privew
    var reader = new FileReader();
    reader.onload =(event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.service.fileToUpload);
  }
   // convenience getter for easy access to form fields
   get f() { return this.productForm.controls; }
   onSubmit() {
       this.submitted = true;
       if (this.productForm.invalid) 
       {
           return;
       }
       else
       { 
           this.service.postProduct(this.productForm.value).subscribe(
              res => 
              {
                this.service.refreshProducts(null);
                this.toastr.success("Submitted Successfull","Product Add");
                this.router.navigate(['/products']);
                this.resetForm();
              },
              err =>
              {
                console.log(err);
              });
        }
    }

   resetForm(){
     this.productForm.reset();
     this.imageUrl ="/assets/images/upload.png";
    }
}
