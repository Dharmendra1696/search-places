import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ApiServices } from 'src/services/api-services';

interface places {
  city: string,
  country: string,
  countryCode: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  places: Array<places> = [];
  tempPlaces: Array<places> = [];
  isLoading: Boolean = true;
  dataForm: FormGroup = new FormGroup({});
  currentpage: number = 1;
  pageSize: number = 3
  totalPages: number = 0;
  limit: number = 3;


  constructor(private apiService: ApiServices, private fb: FormBuilder) { }

  ngOnInit() {
    this.dataForm = this.fb.group({
      dataSize: new FormControl(3, [Validators.min(1), Validators.max(10)])
    });

    this.getPlacesData(this.limit)
  }

  getPlacesData(limit: number) {
    this.showLoader();
    this.places = []
    this.tempPlaces = []

    this.apiService.getPlaces(limit).subscribe((res: any) => {
      this.places = res.data;
      this.closeLoader();
      this.totalPages = this.getPages(this.places)
      this.tempPlaces = this.getDataPageWise(this.places);
    });
  }

  filterPlace(event: any) {
    let val = event.target.value.toLowerCase()
    let data: Array<places> = [];

    if (this.places && this.places.length) {
      this.showLoader();
      this.currentpage = 1;
      this.tempPlaces = [];

      data = this.places.filter((item: any) => {
        if (item.city.toLowerCase().includes(val) || item.country.toLowerCase().includes(val)) {
          return item
        }
      })

      this.totalPages = this.getPages(data)
      this.tempPlaces = this.getDataPageWise(data);
      this.closeLoader();
    }
  }

  getPages(data: Array<places>) {
    return Math.ceil(data.length / this.pageSize);
  }

  getDataPageWise(data: Array<places>) {
    let start = ((this.currentpage - 1) * this.pageSize);
    let end = start + this.pageSize;
    return data.slice(start, end);
  }

  changePage(page: number) {
    this.showLoader();
    this.currentpage = page
    this.tempPlaces = this.getDataPageWise(this.places)
    this.closeLoader();
  }

  changeDataSize() {
    if (this.dataForm.valid) {
      this.limit = this.dataForm.value.dataSize
      this.getPlacesData(this.limit)
    }
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

  showLoader() {
    this.isLoading = true;
  }

  closeLoader() {
    this.isLoading = false;
  }

  getCountryFlag(countryCode: string) {
    return `${environment.countryFlagUrl}/${countryCode}/flat/32.png`
  }
}
