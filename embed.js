	function DomainSource(name, regex) {
		this.name = name; 
		this.regex = new RegExp(regex, "i"); 
		this.getId = function (url) {
			return url.match(this.regex).groups.id;
		}
	}

	function VideoSource(domains, embedUrl, options) {
		this.domains = domains;
		this.embedUrl = embedUrl; 
		this.options = options; 
	}
	 
	function Embed(){
		var self = this; 
		this.options = {	defaultOptions 		: new Map(), 
							finalOptions 		: new Map(),
						};

		this.options.defaultOptions.set("frameborder", "0");
		this.options.defaultOptions.set("allowfullscreen", "");
		this.options.defaultOptions.set("width", "100%");
		this.options.defaultOptions.set("height", "100%");

		this.videoSources = [];

		this.addVideoSource = function (videoSource) {
			this.videoSources.push(videoSource); 
		}

		// YouTube
		let youtubeDomain = new DomainSource("www.youtube.com", /youtube\.com\/watch\?v=(?<id>.+?)(?:&|$)/);
		let youtuDomain = new DomainSource("youtu.be", /youtu\.be\/(?<id>.+)(\?|$)/);
		let youtubeOptions = new Map(); 
			youtubeOptions.set("width", "560");
			youtubeOptions.set("height", "315");
			youtubeOptions.set("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");
		let youtubeSource = new VideoSource([youtubeDomain, youtuDomain], function (id) {
									return `https://www.youtube.com/embed/${id}`; 
								}, youtubeOptions); 
		this.videoSources.push(youtubeSource);

		// dailymotion
		let dailymotionDomain = new DomainSource("www.dailymotion.com", /dailymotion\.com\/video\/(?<id>.+?)(\?playlist=(?<playlist>.+)|$)/);
		let daiDomain = new DomainSource("dai.ly", /dai\.ly\/(?<id>.+?)(\?playlist=(?<playlist>.+)|$)/);
		let dailymotionOptions = new Map(); 
			dailymotionOptions.set("width", "480");
			dailymotionOptions.set("height", "270");
			dailymotionOptions.set("allow", "autoplay");
		let dailymotionSource = new VideoSource([dailymotionDomain, daiDomain], function (id) {
									return `https://www.dailymotion.com/embed/video/${id}`; 
								}, dailymotionOptions); 
		this.videoSources.push(dailymotionSource);

		// vimeo
		let vimeoDomain = new DomainSource("vimeo.com", /vimeo\.com\/(?<id>.+)(\?|$)/);
		let vimeoOptions = new Map(); 
			vimeoOptions.set("width", "640");
			vimeoOptions.set("height", "360");
			vimeoOptions.set("allow", "autoplay; fullscreen");
		let vimeoSource = new VideoSource([vimeoDomain], function (id) {
									return `https://player.vimeo.com/video/${id}?color=5cd7d4&byline=0&portrait=0`; 
								}, vimeoOptions); 
		this.videoSources.push(vimeoSource);

		let detectDomain = function (url){
			let domainRegex = /(?:(?:https?|ftp|file):\/\/)?(?<domain>[a-zA-z](?:[a-zA-Z0-9]|(?:(?:[\.\-_])\w)){1,252}\.(?<tdl>[a-zA-Z]{2,6})\.?)(?:\:\d{2,5})?(?:\/[\~\$\-\_\.\+\!\*\(\)\,\;\/\?\:\@\=\&a-zA-z\d\n]*)?/;
			url = url.trim().toLowerCase();
			let domain = url.match(domainRegex).groups.domain; 
			return domain;  
		};

		/*
			the attributes1 have prioriy over attributes2. 
		*/
		let joinAttributes = function (attributes1, attributes2) {
			for(let [key, value] of attributes2){
				if(!attributes1.has(key))
					attributes1.set(key, value);
			}
			return attributes1; 
		};
		
		let addAttributes = function (attributes) {
			let string = "";
			for(let [key, value] of attributes){
				string += ` ${key}="${value}"`;
			}
			return string; 
		};

		this.video = function (url, options) {
			
			let iframe = "<iframe ";
			let domain = detectDomain(url);
			let id;
			let attributes;  
			let exit = false; 
			for (let i = 0; i < this.videoSources.length && !exit; i++) {
				for (let j = 0; j < this.videoSources[i].domains.length && !exit; j++) {
					if (this.videoSources[i].domains[j].name == domain) {
						id = this.videoSources[i].domains[j].getId(url); 
						
						attributes = this.videoSources[i].options;
						if (!attributes)
							attributes = new Map(); 

						attributes.set("src", this.videoSources[i].embedUrl(id));
						exit = true; 
					}
				}
			}

			if(!exit){
				console.error(`This domain (${domain}) is not supported yet.`); 
			}else{
				attributes = joinAttributes(attributes, this.options.defaultOptions);
				if (options) {
					if (options instanceof Map) {
						attributes = joinAttributes(options, attributes);
					} else {
						console.error(`The options have to be a Map but ${options.constructor.name} given.\n You can create a options Object like: \n    let options = new Map();\n    options.set("attribute", "value");`)
					}
					
				}

				iframe += addAttributes(attributes);
			}
			
			

			iframe += "></iframe>"; 
			return iframe;
		}

		this.autoEmbedVideos = function(tagName, urlAttribute){
			tagName = tagName ? tagName : "video-embed"; 
			urlAttribute = urlAttribute ? urlAttribute : "src";
			window.onload = function() {
				let elements = this.document.getElementsByTagName(tagName);
				while (elements != undefined && elements.length > 0) {
					let url = elements[0].getAttribute(urlAttribute);
					let attributes = elements[0].attributes;
					let options = new Map(); 
					for (let j = 0; j < attributes.length; j++) {
						if(attributes[j].name != urlAttribute){
							options.set(attributes[j].name, attributes[j].value);
						}
					}
					elements[0].insertAdjacentHTML("beforebegin", self.video(url, options));
					elements[0].parentNode.removeChild(elements[0]);
				}
			}
		}
	}