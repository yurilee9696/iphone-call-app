import { Component } from '@angular/core';
import { NavController, ModalController, Item, ActionSheetController, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { UserCreatePage } from '../../pages/user-create/user-create';
import { HomePage } from '../../pages/home/home';
import { first } from 'rxjs/operators';
@Component({
	selector: 'page-about',
	templateUrl: 'about.html',
})
export class AboutPage {
	phoneNumber: string;
	userData: any;
	CallData: any;
	callList: any[] = [];

	constructor(public navCtrl: NavController, public modalCtrl: ModalController, public actionsheetCtrl: ActionSheetController, public platform: Platform) {

	}

	ngOnInit() {
		this.phoneNumber = '';
		this.userData = JSON.parse(localStorage.getItem('content'));
		this.CallData = JSON.parse(localStorage.getItem('callList'));

	}

	userCreate() {
		let addModal = this.modalCtrl.create(UserCreatePage, { phone: this.phoneNumber });
		addModal.onDidDismiss(item => {
			if (item) {
				if (item.name == '' && item.familyname == '') {
					item.name = '이름 없음';
				}
				this.userData.push(
					{
						name: item.familyname + item.name,
						email: item.email,
						address: {
							stree: item.street,
							suite: item.suite,
							city: item.city,
							zipcode: item.zipcode
						},
						phone: item.phone,
						website: item.website,
						company: {
							company: item.company
						}

					}
				);
				//storage update
				localStorage.setItem('content', JSON.stringify(this.userData));
				location.reload();
			}
		})
		addModal.present();
	}

	buttonClick(number: string) {
		if (this.phoneNumber.length == 3) {
			this.phoneNumber += '-';
		}
		else if (this.phoneNumber.length == 7) {
			this.phoneNumber += '-';
		}
		else if (this.phoneNumber.length == 12) {
			this.phoneNumber = this.replaceAt(7, '', this.phoneNumber);
		}
		else if (this.phoneNumber.length >= 13) {
			this.phoneNumber = this.replaceAll("-", "", this.phoneNumber);
		}
		this.phoneNumber += number;
	}

	deleteNumber() {

		console.log('삭제');
		this.phoneNumber = this.phoneNumber.slice(0, -1);
	}
	replaceAll(org, dest, str) {
		return str.split(org).join(dest);
	}
	replaceAt(index, char, str) {
		return str.substr(0, index) + char + str.substr(index + char.length);
	}

	openMenu() {
		let actionSheet = this.actionsheetCtrl.create({
			title: '',
			cssClass: 'action-sheets-basic-page',
			buttons: [
				{
					text: '새로운 연락처 등록',
					icon: !this.platform.is('ios') ? 'share' : null,
					handler: () => {
						console.log('Share clicked');
						this.userCreate();
					}
				},
				{
					text: '기존의 연락처에 추가',
					icon: !this.platform.is('ios') ? 'heart-outline' : null,
					handler: () => {
						console.log('Favorite clicked');
					}
				},
				{
					text: '취소',
					role: 'cancel', // will always sort to be on the bottom
					icon: !this.platform.is('ios') ? 'close' : null,
					handler: () => {
						console.log('Cancel clicked');
					}
				}
			]
		});
		actionSheet.present();
	}

	call() {
		if (!this.phoneNumber) return; //번호를 입력해야만 전화를 걸 수 있음
		console.log('저장된 기록들', this.CallData);
		if (localStorage.getItem('callList')) {
			console.log('통화 기록이 없습니다');
		}
		else {
			console.log('통화기록 ㅐ');
		}

		const name = this.checkTelSave();
		const callResult = Math.random() >= 0.5;
		const d = new Date();
		const id=Date.now() + Math.random();
		let currencyTime;
		if(callResult){ //전화를 받았을 경우에만 통화시간을 넣어줌
			currencyTime=(Math.floor(Math.random() * 60) + 1)+'분';
		}
		else{
			currencyTime='부재중 전화';
		}
		const call = {
			id:  id,
			name: name,
			phone: this.phoneNumber,
			date: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(),
			receive: callResult,
			time : d.getHours()+':'+d.getMinutes(),
			currencyTime: currencyTime
		};

		this.CallData.push(call);
		localStorage.setItem('callList', JSON.stringify(this.CallData));
		console.log('전화 결과', call);
		this.phoneNumber='';
	}

	//전화부에 저장되어 있는지 판단하는 함수
	checkTelSave(){
		let inputPhone=this.phoneNumber.replace(/\-/g, "");
		let bookPhone;
		for (let i = 0; i < this.userData.length; i++) {
			bookPhone=this.userData[i].phone.replace(/\-/g, "");
			// console.log('전화번호 번호 : ',bookPhone);
			// console.log('입력한 전화번호 : ',inputPhone);
			if (inputPhone === bookPhone) {
				console.log('전화부에 등록된 전화번호');
				return this.userData[i].name;
			}
		}
		console.log('전화부에 등록이 안된 전화번호');
		return '';
	}
}
