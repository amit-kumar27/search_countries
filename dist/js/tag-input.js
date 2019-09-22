function inputTags(configs) {


    let input = document.getElementById(configs.id),
        tagsContainer = document.getElementById("tags"),
        autoSuggestEle = document.getElementById("suggestions"),
        countriesListEle = document.getElementById("list"),
        countries = localStorage.getItem("countries"),
        tagsAdded = [], countriesAdded = [], inputVal = '', timer;


        if(countries && countries !== 'null') {
            countries = JSON.parse(countries);
        }
        else {
            xhrRequest({url: "https://restcountries.eu/rest/v2/all"})
            .then(data => {
                let _data = {};
                data = data && JSON.parse(data);
                if(data && Array.isArray(data)) {
                    data.forEach( el => {
                        _data[el.alpha3Code] = el;
                    });
                }
                localStorage.setItem("countries", JSON.stringify(_data));
                loader(false);
                countries = _data;
            })
            .catch(error => {
                console.log(error);
                loader(false);
            });
        }
    
    let _privateMethods = {

        init : function (configs) {

            // this.inspectConfigProperties(configs);

            let self = this,
            input_hidden = document.createElement('input');
            input_hidden.setAttribute('type', 'hidden');
            input_hidden.setAttribute('id', 'tagInput');
            input_hidden.setAttribute('name', 'tagInput');
            input.parentNode.insertBefore(input_hidden, input);

            tagsContainer.addEventListener('click', function () {
                input.focus();
            });

            input.addEventListener("focusout", function (e) {
                if(!input.value) {
                    autoSuggestEle.innerHTML = '';
                }
            });

            input.addEventListener('keyup', function (ev) {
                if(/(188|13)/.test(ev.which))
                {
                    let event = new Event('focusout');
                    input.dispatchEvent(event);
                }
                else {
                    // Debounce user's search query
                    clearTimeout(timer);
                    timer = setTimeout(function(){
                        console.log(" value: ", ev.target.value);
                        autoSuggestEle.innerHTML = '';
                        let matchedCodes = [];
                        let value = ev.target.value;
                        let countriesCodes = countries &&  Object.keys(countries);
                        if(value && Array.isArray(countriesCodes)) {
                            countriesCodes.map( code => {
                                if(code.toLowerCase().includes(value.trim().toLowerCase())) {
                                    matchedCodes.push(code);
                                    let ele = document.createElement('li');
                                    ele.setAttribute('id', code);
                                    ele.innerHTML = countries[code].name + ', ' + code;
                                    autoSuggestEle.appendChild(ele);
                                }
                            });
                            
                        }
                    }, 300);
                }
                if(event.which===8 && inputVal === "")
                {
                    let tag_nodes = document.querySelectorAll('.tag');
                    if(tag_nodes.length > 0)
                    {
                        let node_to_del = tag_nodes[tag_nodes.length - 1];
                        self.removeCountry(node_to_del.textContent);
                        node_to_del.remove();
                        self.update();
                    }
                }
                inputVal = ev.target.value;
            });

            autoSuggestEle.addEventListener('click', (event) => {
                const code = event.target.id;
                if(tagsAdded.indexOf(code) === -1) {
                    tagsAdded.push(code);
                    self.addCountry()
                    self.create(code);
                }
                
            });
        },
        


        create : function(tag_txt){

            let tag_nodes = document.querySelectorAll('.tag');

            if(tag_nodes.length  < configs.maxTags)
            {
                let self = this,
                    span_tag = document.createElement('span'),
                    input_hidden_field = document.getElementById("tagInput");

                span_tag.setAttribute('class', 'tag');
                span_tag.setAttribute('id', tag_txt);
                span_tag.innerText = tag_txt.toUpperCase();

                let span_tag_close = document.createElement('span');
                span_tag_close.setAttribute('class', 'close');
                span_tag.appendChild(span_tag_close);

                tagsContainer.insertBefore(span_tag, input_hidden_field);

                span_tag.childNodes[1].addEventListener('click', function () {
                    self.remove(this);
                });

                this.update();

            }
        },

        update : function(){

            let tags = document.getElementsByClassName('tag'),
            tags_arr = [];

            for(let i =0; i < tags.length; i++)
            {
                tags_arr.push(tags[i].textContent.toLowerCase());
            }
            this.tags_array = tags_arr;

            countriesListEle.innerHTML = "Countries: " + JSON.stringify(countriesAdded);
            

            document.getElementById("tagInput").setAttribute('value', tags_arr.join());
        },

        remove : function(tag) {
            this.removeCountry(tag.parentNode.textContent);
            tag.parentNode.remove();
            this.update();
        },
        
        showDuplicate : function (tag_value) {
            let tags = document.getElementsByClassName('tag');

            for(let i =0; i < tags.length; i++)
            {
                if(tags[i].textContent === tag_value.toUpperCase())
                {
                    tags[i].style.background = '#636363d9';
                    window.setTimeout(function () {
                        tags[i].removeAttribute('style');
                    }, 1100);
                }
            }
        },

        addCountry: () => {
            let _countriesAdded = [];
            tagsAdded.forEach( code => {
                _countriesAdded.push(countries[code]);
            });
            countriesAdded = _countriesAdded;
        },

        removeCountry: (code) => {
            if(code && countries[code]) {
                const ind = tagsAdded.indexOf(code);
                if(ind !== -1) {
                    tagsAdded.splice(ind, 1);
                    countriesAdded.splice(ind, 1);
                }
            }
        }
    }

    _privateMethods.init(configs);
    // return false;
}