import { Component, NgZone } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { LoadingController,  ToastController,  NavController  } from 'ionic-angular';


declare var google;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: any;
  markers: any;
  GooglePlaces: any;
  geocoder: any
  loading: any;
  pos: any;
  devicePosition: Geoposition;


  constructor(public zone: NgZone, public geolocation: Geolocation, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public navCtrl: NavController, ) {
    this.geocoder = new google.maps.Geocoder;
    let elem = document.createElement("div")
    this.GooglePlaces = new google.maps.places.PlacesService(elem);
    this.markers = [];
    this.loading = this.loadingCtrl.create();
    
    
  }

  ionViewDidEnter(){
    this.loading.present();
    this.geolocation.getCurrentPosition().then((position) => {

      this.devicePosition = position;

      this.pos = {
        lat: this.devicePosition.coords.latitude,
        lng: this.devicePosition.coords.longitude
      };
      
      let latLng = new google.maps.LatLng(this.devicePosition.coords.latitude, this.devicePosition.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(document.getElementById('map'),mapOptions);
      
      var markerMyLocation = new google.maps.Marker({
        position: this.pos,
        color:'blue',
        map: this.map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          strokeColor : '#039be5',
          strokeWeight : 5,
          scale: 5
        }
      });
  
      this.markers.push(markerMyLocation);

      
      this.loading.dismiss();
    }, (error) => {
      this.loading.dismiss();
      //this.messageToast(error.message);
    });
     
  }

  myLocation(){

      this.clearMarkers();
      var markerMyLocation = new google.maps.Marker({
        position: this.pos,
        map: this.map,
        title:'Minha localização'
      });
  
      this.markers.push(markerMyLocation);

  }

  clearMarkers(){
    for (var i = 0; i < this.markers.length; i++) {
      console.log(this.markers[i])
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }

  messageToast(msg) {
    this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    }).present();
  }


}