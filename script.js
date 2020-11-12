const searchField = document.querySelector('.search-field'),
      resultsBlock = document.querySelector('.search-results'),
      startSearchCount = 5,
      searchLimit = 5,
      selectedTemplate = document.querySelector('#github-view'),
      selectedBlock = document.querySelector('.selected-repos'),
      debounceTimeValue = 500;

async function getData(e){
    resultsBlock.innerHTML = '';
    if(searchField.value.length >= startSearchCount){
        resultsBlock.innerHTML = 'Ищем...';
        fetch(`https://api.github.com/search/repositories?q=${searchField.value}`)
            .then(response => response.json())
            .then(json => {
                let limit = searchLimit < json.total_count ? searchLimit : json.total_count;
                resultsBlock.innerHTML = '';
                for(let i = 0; i < limit; i += 1) {
                    let clone = document.createElement('li');
                    clone.classList.add('search-result');
                    clone.innerHTML = json.items[i].name;
                    clone.setAttribute('dataSrc', JSON.stringify({
                        name: json.items[i].name,
                        owner: json.items[i].owner.login,
                        stars: json.items[i].stargazers_count
                    }));
                    resultsBlock.append(clone);
                }

                document.querySelectorAll('.search-result').forEach(function (el) {
                    el.addEventListener('click', function (e) {
                        console.log('click');
                        let clone = document.importNode(selectedTemplate.content, true);
                        const attributes = JSON.parse(el.getAttribute('dataSrc'));
                        clone.querySelector('.repo-name').innerHTML = `Name: ${attributes.name}`;
                        clone.querySelector('.repo-owner').innerHTML = `Owner: ${attributes.owner}`;
                        clone.querySelector('.repo-stars').innerHTML = `Stars: ${attributes.stars}`;
                        clone.querySelector('.close-btn').addEventListener('click', function (e) {
                            this.closest('.selected-repo').remove();
                        });
                        selectedBlock.append(clone);
                        searchField.value = '';
                        resultsBlock.innerHTML = '';
                    });
                });
            })
            .catch(error => {
                resultsBlock.innerHTML = 'Возникла ошибка';
            });
    }
}

const debounce = (fn, debounceTime) => {
    let inDebounce;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => fn.apply(context, args), debounceTime);
    }
};

const keyDownHandler = debounce(getData, debounceTimeValue);

searchField.addEventListener('focus', function(e){
    document.addEventListener('keydown', keyDownHandler);
});

searchField.addEventListener('blur', function(e){
    document.removeEventListener('keydown', keyDownHandler);
});
