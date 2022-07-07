import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.css";//.min
import { Notify } from 'notiflix/build/notiflix-notify-aio';//
const key = '28325573-e3f151920507aabfaddea723c';
import { GetPixabayApi } from './js/getPixbay';
Notify.init({
	//position: "center-top",
	timeout: 4000,
	cssAnimationStyle: "from-top",
	showOnlyTheLastOne: true,
});
const options = {
	rootMargin: '200px',
	threshold: 1.0,
}
let total_hits = 0;
//const { hits, totalHits } = getPixabayApi.fetchImages();
let count = 1;
const observer = new IntersectionObserver((entries) => {
	entries.forEach(entriy => {//async
		console.log(getPixabayApi.page * 40,'summ');
		if (entriy.isIntersecting) {
			if (getPixabayApi.page > 1 && total_hits <= (getPixabayApi.page * 40)) {
				//console.log(getPixabayApi.page += getPixabayApi.page,'summ');
					return Notify.warning("We're sorry, but you've reached the end of search results.")
				} else {
					if (getPixabayApi.page > 1) {
						//console.log(getPixabayApi);
						Notify.info(`loading more automatically. Page: ${getPixabayApi.page}`);
						onMorePic();
						console.log(getPixabayApi.page, getPixabayApi.per_page);
					}
				};
			
		}
		
	})
},options);
observer.observe(document.querySelector('.page-end'));

const searchInput = document.querySelector('[name="searchQuery"]');
//const searchButton = document.querySelector('.search-form');
// const gallery = document.querySelector('.gallery');load-more
const galleryRef = document.querySelector('.gallery');
const formRef = document.querySelector('.search-form');
const buttonMore = document.querySelector('.load-more');

formRef.addEventListener('submit', onFormSubmit);
buttonMore.addEventListener('click', onMorePic);

const getPixabayApi = new GetPixabayApi();
getPixabayApi.fetchImages();//.then(console.log);

function makeGalleryMarkup(searchImages) {
	return searchImages.map(({
		webformatURL,
		largeImageURL,
		tags,
		likes,
		views,
		comments,
		downloads,
	}) => 
		`<div class = "photo-card">
			<div class = photo-card__tumb>
				<a class="largeImageURL" href=${largeImageURL}>
					<img src=${webformatURL} alt="${tags}" loading="lazy"/>
				</a>
			</div>
			<div class="photo-card__info">
				<p class="photo-card__info-item"><b>Likes</b>${likes}</p>
				<p class="photo-card__info-item"><b>Views</b>${views}</p>
				<p class="photo-card__info-item"><b>Comments</b>${comments}</p>
				<p class="photo-card__info-item"><b>Downloads</b>${downloads}</p>
			</div> 
 		</div>`
	).join('');
}

function renderGallery(searchImages) {
	galleryRef.insertAdjacentHTML('beforeend', makeGalleryMarkup(searchImages));
}
async function total(e){ try {
		const { hits, totalHits } = await getPixabayApi.fetchImages();
		if (totalHits <= getPixabayApi.page * getPixabayApi.per_page) return Notify.warning("Sorry, there are no images matching your search query.totalHits ${totalHits} images. Please try again.");
		Notify.success(`Hooray! We found totalHits ${totalHits} images.`);
		
	} catch (error) {
		console.log(error.message);
	}
}

async function onFormSubmit(e) {
	e.preventDefault();
	clear();
	getPixabayApi.resetPage();
	const request = e.target.elements.searchQuery.value.trim();
	//console.log(request);
	if (!request) return Notify.info('tra la la');
	getPixabayApi.searchQuery1 = request;
	try {
		const { hits, totalHits } = await getPixabayApi.fetchImages();
		total_hits = totalHits;
		if (!totalHits) return Notify.warning("Sorry, there are no images matching your search query. Please try again.");
		Notify.success(`Hooray! We found totalHits ${totalHits} images.`);
		renderGallery(hits);
		lightbox.refresh();
	} catch (error) {
		console.log(error.message);
	}
	e.target.reset();
}

function clear() {
	galleryRef.innerHTML = '';
	
}

async function onMorePic() {
	try {
		const { hits, totalHits } = await getPixabayApi.fetchImages();
		renderGallery(hits);
		lightbox.refresh();

		// const { height: cardHeight } = document
		// 	.querySelector(".gallery")
		// 	.firstElementChild.getBoundingClientRect();

		// 	window.scrollBy({
		// 	top: cardHeight * 2,
		// 	behavior: "smooth",
		// 	});
	} catch (error) {
		console.log(error.message);
	}
}

const lightbox = new SimpleLightbox('.largeImageURL', {
	captionsData: 'alt',
});



//console.log('gallery', gallery);
//const q = 'car';
//let lightbox = {};

// function simLb(event){
// 	console.log(event.target);
// 	console.log(event.currentTarget);
// 	event.preventDefault();
// 	if (event.target.nodeName !== 'IMG') {
// 		return;
//   }
// 	lightbox.refresh();//simpleLightbox(event);//lightbox.refresh();
// };


// function simLb(event){
// 	event.preventDefault();
// 	//lightbox = new SimpleLightbox('.largeImageURL');
// 	return new Promise((resolve, reject) => {
// 		if (event.target.nodeName === 'IMG') {
// 			resolve(event.currentTarget).then(e => { lightbox })
// 		.catch(error => console.log(error))
// 		} else {
// 			reject('not image')	
// 		}
// 	});
// };
// function ddd() {
// 	return
// }
// lightbox = 1;//new SimpleLightbox('.largeImageURL');//
// //gallery.addEventListener("click", simLb);


// searchButton.addEventListener("submit", searchQ);
// gallery.addEventListener("click", simLb);

// function searchQ(e) { 
// 	e.preventDefault();
// 	console.log(e.currentTarget);
// 	const { elements: { searchQuery } } = e.currentTarget;
// 	console.log({ elements: { searchQuery } });
// 	const q = searchQuery.value.trim();
// 	console.log("searchQuery", searchQuery.value);
// 	fetchImage(q)
// 		.then(e => { control(e, outRender, gallery) })
// 		.catch(error => console.log(error))
// };

// function control(hits, outRenders, innerGallery) {
// 	if (hits.hits.length !== 0) {
// 		console.log("hits2", hits);
		
// 		Notify.success(`Hooray! We found ${hits.total} totalHits images.`);
// 		outRenders(hits, innerGallery);
// 	} else {
// 		Notify.failure("Sorry, there are no images matching your search query. Please try again.");//success//warning
// 	}
// }	

// function outRender(hits, inner) {

// 	const d = hits.hits;
// 	inner.innerHTML = '';
// 	const markup = d
// 		.map((d) => {//previewURL//largeImageURL//webformatURL//webformatURL
// 			return `<div class = "photo-card">
// 				<div class = photo-card__tumb>
// 					<a class="largeImageURL" href=${d.largeImageURL}>
// 						<img src=${d.webformatURL} alt="${d.tags}" loading="lazy" />
// 					</a>
// 				</div>
// 				<div class="photo-card__info">
// 					<p class="photo-card__info-item"><b>Likes</b>${d.likes}</p>
// 					<p class="photo-card__info-item"><b>Views</b>${d.views}</p>
// 					<p class="photo-card__info-item"><b>Comments</b>${d.comments}</p>
// 					<p class="photo-card__info-item"><b>Downloads</b>${d.downloads}</p>
// 				</div> 
// 			</div>`;
// 		}).join("");
	
// 	inner.innerHTML = markup;
// }

// function fetchImage(q, reset) {

// 	return fetch(`https://pixabay.com/api/?key=${key}&q=${q}&image_type=photo&safesearch=true&orientation=horizontal&per_page=40`).then(response => {//
// 		if (response.ok) {
// 			//console.log("response.json()", response.json());
// 			return response.json();
// 		}

// 		console.log("response.status", response.status);
// 		if (response.status === 500) {
// 			Notify.failure("Oops, there is no country with that name");
// 		}
// 		 reset.innerHTML = '';
// 		throw new Error(response.status);
// 	});
// }
