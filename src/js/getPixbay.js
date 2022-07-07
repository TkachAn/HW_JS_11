import axios from 'axios';
const APIKEY = '28325573-e3f151920507aabfaddea723c';


axios.defaults.baseURL = 'https://pixabay.com/api/';


console.log(axios.defaults.baseURL.totalHits);

export class GetPixabayApi{
	constructor() { //searchQuery
		this.searchQuery = '';
		this.page = 1;
		this.per_page = 40;
	};
	
	async fetchImages() {
		const params = new URLSearchParams({
			key: APIKEY,
			q: this.searchQuery,
			image_type: 'photo',
			orientation: 'horizontal',
			safesearch: false,//true,
			per_page: this.per_page,
			page: this.page,
			//widthRatio: 1.9,
			//heightRatio: 1.9,
			scaleImageToRatio: true,
			doubleTapZoom: 4,
			overlay: false,
		});
		
		const { data } = await axios.get(`?${params}`);
		this.incrementPage();
		return data;
	}

	get searchQuery1() {
		return this.searchQuery;
	}
	set searchQuery1(newSearchQuery) {
		return this.searchQuery = newSearchQuery;
	}
	incrementPage() {
		this.page += 1;
	}
	resetPage() {
		this.page = 1;
	}
}

