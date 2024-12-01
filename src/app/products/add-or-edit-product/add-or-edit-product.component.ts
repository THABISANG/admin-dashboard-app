import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { IProduct } from '../product-interface';
import { ProductsService } from '../products.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-or-edit-product',
  imports: [
    MatDialogTitle,
    MatFormField,
    MatButtonModule,
    MatInputModule,
    MatDialogContent,
    MatLabel,
    MatDialogActions,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './add-or-edit-product.component.html',
  styleUrls: ['./add-or-edit-product.component.scss'],
})
export class AddOrEditProductComponent {
  product: IProduct;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<AddOrEditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IProduct,
    private productService: ProductsService
  ) {
    this.product = { ...data };
    this.selectedFileName = this.product.image
      ? this.product.image.split('/').pop() || null
      : null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;

      // Simulate file upload and get the image URL
      const reader = new FileReader();
      reader.onload = () => {
        this.product.image = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFileName = null;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    console.log('onSave called');
    console.log('Product data:', this.product);

    if (this.product.id) {
      console.log('Updating product with ID:', this.product.id);
      this.productService
        .updateProduct(this.product.id, this.product)
        .subscribe(
          () => {
            console.log('Product updated successfully');
            this.dialogRef.close(this.product);
          },
          (error) => {
            console.error('Error updating product:', error);
          }
        );
    } else {
      console.log('Adding new product');
      const storedProducts = localStorage.getItem('products');
      let products: IProduct[] = storedProducts
        ? JSON.parse(storedProducts)
        : [];
      const newProductId =
        products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
      this.product.id = newProductId;
      this.productService.addNewProduct(this.product).subscribe(
        (newProduct) => {
          console.log('Product added successfully', newProduct);
          this.dialogRef.close(this.product);
        },
        (error) => {
          console.error('Error adding product:', error);
        }
      );
    }
  }
}
