import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { UserService } from '../user.service';
import { IUser } from '../user-interface';
import { MatCardActions } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-user-list',
  imports: [ RouterModule, MatTableModule, MatPaginatorModule, MatCardActions, MatIcon],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements AfterViewInit {

  tableColumns: string[] = ['username', 'email', 'lastname', 'firstname'];
  userDataSource = new MatTableDataSource<IUser>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.getProducts();
  }

  ngAfterViewInit() {
    this.userDataSource.paginator = this.paginator;
  }

  getProducts() {
    this.userService.getAllUsers().subscribe((users: IUser[]) => {
      this.userDataSource.data = users;
  }
)
  }}
