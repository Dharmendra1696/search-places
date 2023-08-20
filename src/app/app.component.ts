import { Component } from '@angular/core';
import { ApiServices } from 'src/services/api-services';

interface places {
  city: string,
  country: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  places: Array<places> = [];
  tempPlaces: Array<places> = [];
  isLoading: Boolean = true;
  defaultLimit: number = 3

  constructor(private apiService: ApiServices) { }

  ngOnInit() {
    this.getPlacesData(this.defaultLimit)
  }

  getPlacesData(limit: number) {
    this.isLoading = true;
    this.places = []
    this.tempPlaces = []
    this.apiService.getPlaces(limit).subscribe((res: any) => {
      this.places = res.data;
      this.tempPlaces = res.data;
      this.isLoading = false;
    });
  }

  onPlaceEnter(event: any) {
    let val = event.target.value.toLowerCase()

    if (this.places && this.places.length) {
      this.tempPlaces = this.places.filter((item: any) => {
        if (item.city.toLowerCase().includes(val) || item.country.toLowerCase().includes(val)) {
          return item
        }
      })
    }
  }

  pageSizeChange(event: any) {
    this.getPlacesData(event.target.value)
  }
}
