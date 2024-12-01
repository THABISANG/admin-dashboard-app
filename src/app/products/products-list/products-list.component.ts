import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { IProduct } from '../product-interface';
import { ProductsService } from '../products.service';
import { AddOrEditProductComponent } from '../add-or-edit-product/add-or-edit-product.component';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-products-list',
  imports: [RouterModule, MatTableModule, MatPaginatorModule, MatIcon],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, AfterViewInit {
  tableColumns: string[] = ['id', 'title', 'price', 'category', 'description', 'image', 'actions'];
  dataSource = new MatTableDataSource<IProduct>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private readonly productService: ProductsService, public dialog: MatDialog) {}

  ngOnInit() {
    this.fetchProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  fetchProducts() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      this.dataSource.data = JSON.parse(storedProducts);
    } else {
      this.getProductsFromFakeStoreAPI();
    }
  }

  getProductsFromFakeStoreAPI() {
    this.productService.getAllProducts().subscribe((products: IProduct[]) => {
      this.dataSource.data = products;
      localStorage.setItem('products', JSON.stringify(products));
    });
  }

  openDialog(product?: IProduct): void {
    let dialogData: IProduct;
    if (product) {
      dialogData = { ...product };
    } else {
      const newProductId = this.dataSource.data.length > 0 ? Math.max(...this.dataSource.data.map(p => p.id)) + 1 : 1;
      dialogData = { id: newProductId, title: '', price: 0, symbol: '', category: '', description: '', image: '', action: '' };
    }

    const dialogRef = this.dialog.open(AddOrEditProductComponent, {
      width: '800px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          // Update existing product
          const index = this.dataSource.data.findIndex(p => p.id === result.id);
          if (index !== -1) {
            this.dataSource.data[index] = result;
          } else {
            // Add new product
            this.dataSource.data.push(result);
          }
        } else {
          // Add new product
          this.dataSource.data.push(result);
        }
        this.updateLocalStorage();
      }
    });
  }

  deleteProduct(id: number): void {
    console.log(`Delete button clicked for product ID: ${id}`);
    this.productService.deleteProductById(id).subscribe({
      next: (deletedProduct) => {
        console.log(`Product with ID: ${id} deleted successfully`, deletedProduct);
        const products = this.dataSource.data.filter(product => product.id !== id);
        this.dataSource.data = products;
        localStorage.setItem('products', JSON.stringify(products));
      },
      error: (error) => {
        console.error(`Error deleting product with ID: ${id}`, error);
      }
    });
  }

  updateLocalStorage() {
    localStorage.setItem('products', JSON.stringify(this.dataSource.data));
    this.fetchProducts();
  }
}
