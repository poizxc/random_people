let people;
const form = document.querySelector("form");
const filterby = document.querySelector("#filterby");
const peopleList = document.querySelector(".people-list");
const clear = () => { peopleList.innerHTML = "" };
String.prototype.prepareToCompare = function(){
 return this.toLowerCase().trim();
};
fetch('https://randomuser.me/api/?results=1000')
    .then(
        response => {

            response.json().then(data => {
                people = data.results;
                people.forEach(people => show(people));
                filterby.removeAttribute("disabled");
            });

        }

    )
    .catch(err => {
        console.log('Fetch Error :-S', err);
    });

filterby.addEventListener("input", _.debounce(handleFilter));
form.addEventListener("submit", e => e.preventDefault());

function handleFilter({ target: { value } }) {
    clear();
    people.forEach((people) => { 
        const { name } = people;
        if (name.last.prepareToCompare().includes(value.prepareToCompare()) || name.first.prepareToCompare().includes(value.prepareToCompare())) {
            show(people);
        };

    });
}

function show(people) {
    let peopleElem = document.createElement("div");
    peopleElem.classList.add("alert", "alert-secondary", "people");
    let content = [{
            type: 'div',
            attribs: {
                class: ['people-name'],
            },
            child: {
                type: 'h3',
                content: `${people.name.first} ${people.name.last}`,
                child: {
                    type: 'small',
                    content: people.name.title,
                }

            }

        },
        {
            type: 'div',
            attribs: {
                class: ['people-photo'],
            },
            child: {
                type: 'img',
                attribs: {
                    src: [people.picture.large],
                    alt: [`${people.name.first} ${people.name.last}`],
                },
            },

        },
        {
            type: 'div',
            attribs: {
                class: ['people-main-info'],
            },
            content: `Gender: ${people.gender} <br />
                        phone-number: ${people.cell} <br />
                        login: ${people.login.username} <br />
                        email: ${people.email} <br />`

        }
    ];
    let toApp = content.map(item => createElem(item));
    toApp.forEach(elem => peopleElem.append(elem));
    peopleList.append(peopleElem)
};



function createElem(obj) {
    let result = document.createElement(obj.type);
    if (obj.attribs) {
        for (const [key, value] of Object.entries(obj.attribs)) {
            result.setAttribute(key, Array.isArray(value) ? value.join(' ') : value[0]);
        }
    }

    (obj.content) && (result.innerHTML = obj.content);


    if (obj.child) {
        let child = createElem(obj.child);
        result.append(child);
    }

    return result;

};