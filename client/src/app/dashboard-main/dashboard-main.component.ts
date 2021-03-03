import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { OrderService } from '../_services/order.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AdminOrderServiceComponent } from '../admin-order-service/admin-order-service.component';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrls: ['./dashboard-main.component.css'],
})
export class DashboardMainComponent implements OnInit {
  count: any;
  ordersOpen: any;

  constructor(
    private title: Title,
    private orderService: OrderService,
    private spinner: NgxSpinnerService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.spinner.show();

    this.orderService.getAllDistinctOrders().subscribe(
      (data) => {
        
        this.count = data.count;
        this.ordersOpen = data.orders.filter(obj => obj.order_state ===  0 );
        console.log('Distinct open orders', this.ordersOpen);
        /** spinner ends after api fetch is complete */
        this.spinner.hide();
      },
      (err) => {
        console.log(err);
      }
    );
  }


  openDialog(order:any) {

    console.log(order)
    
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "logout-modal-component";
    dialogConfig.height = "70%";
    dialogConfig.width = "55%";
    dialogConfig.data={
      reference: order.order_reference,
      order_state: order.order_state,
      name: order.fname + " " + order.lname,

    }
   
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(AdminOrderServiceComponent, dialogConfig);
    modalDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  refresh() {
    this.ngOnInit();
  }
}
