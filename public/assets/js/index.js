function createNode(element, id, cssClass, needEventListener) {
    el = document.createElement(element);
    if(id) {
        el.setAttribute("id", id);
    }
    if(cssClass) {
        el.setAttribute("class", cssClass);
    }
    if(needEventListener) {
        el.addEventListener('click', onChapterClick)
    }
    return el;
}

function append(parent, el) {
  return parent.appendChild(el);
}

const ul = document.getElementById('chapters');
const url = 'http://localhost:3000/api/book/maths';
fetch(url)
.then((resp) => resp.json())
.then(function(data) {
  let chapters = data.response;
  return chapters.map((chapter, index) => {
    let li, span = createNode('span'), span2=createNode('span','', 'secondaryText'), span3 = createNode('span','', 'statusTag');
    if(chapter.type === 'chapter') {
        let percentage = Math.round((chapter.completeCount / chapter.childrenCount)*100)
        li = createNode('li', chapter.id, `${getStatusClassForLi(percentage)} chapterListItem`, true);
        span.innerHTML = ` &#128214;  ${chapter.title}`;
        span2.innerHTML = `(${chapter.childrenCount} concepts)`;
        span3.innerHTML = `${percentage}% Complete`;
        span3.setAttribute('class', `statusTag ${getStatusClass(percentage)}`)
        append(li, span);
        append(li, span2);
        append(li, span3);
    } else if(chapter.type === 'lesson') {
        li = createNode('li', chapter.id, 'chapterListItem');
        span.innerHTML = ` &#128214;  ${chapter.title} (lesson)`;
        append(li, span);
    }
    append(ul, li);
  })
})
.catch(function(error) {
  console.log(error);
});   

var lastOpenedEl;

function onChapterClick(e) {
    let element = e.currentTarget;
    console.log(lastOpenedEl);    
    if(element && element.className == `${getStatusClassForLi(parseInt(element.childNodes[2].innerHTML.slice(0,3)))} chapterListItem`){
        element.setAttribute('class', 'apiCall chapterListItem');
          fetch(`${url}/section/${e.currentTarget.id}`)
          .then((resp) => resp.json())
          .then((data) => {
            let lessons = data.response[element.id];
            lessons.sort((a,b) => a.sequenceNO - b.sequenceNO);
            const childUl = createNode('ul');
            lessons.map(function(lesson) {
              let li = createNode('li', lesson.id, 'lessonListItem'),
                  span1 = createNode('span'),
                  span2 = createNode('span','', 'statusTag');
              span1.innerHTML = `${lesson.sequenceNO}. ${lesson.title}`;
              span2.innerHTML = getStatusText(lesson.status);
              append(li, span1);
              append(li, span2);
              append(childUl, li);
            });
            append(element, childUl);
            element.setAttribute('class', `showChapters ${getStatusClassForLi(parseInt(element.childNodes[2].innerHTML.slice(0,3)))} chapterListItem`);
            if(lastOpenedEl) {
                console.log(lastOpenedEl);
                lastOpenedEl.setAttribute('class', `hideChapters ${getStatusClassForLi(parseInt(lastOpenedEl.childNodes[2].innerHTML.slice(0,3)))} chapterListItem`);
            }
            console.log(element.className);
            lastOpenedEl = element;
        });
    } else if(element && element.className == `showChapters ${getStatusClassForLi(parseInt(element.childNodes[2].innerHTML.slice(0,3)))} chapterListItem`){
        element.setAttribute('class', `hideChapters ${getStatusClassForLi(parseInt(element.childNodes[2].innerHTML.slice(0,3)))} chapterListItem`);
    } else if(element && element.className == `hideChapters ${getStatusClassForLi(parseInt(element.childNodes[2].innerHTML.slice(0,3)))} chapterListItem`) {
        element.setAttribute('class', `showChapters ${getStatusClassForLi(parseInt(element.childNodes[2].innerHTML.slice(0,3)))} chapterListItem`);
        console.log(lastOpenedEl);        
        if(lastOpenedEl && lastOpenedEl != element) {
            lastOpenedEl.setAttribute('class', `hideChapters ${getStatusClassForLi(parseInt(lastOpenedEl.childNodes[2].innerHTML.slice(0,3)))} chapterListItem`);
        }
        lastOpenedEl = element;
    }
 };

 function getStatusText(status) {
     if(status === 'COMPLETE') {
         return 'Complete';
     } else if(status === 'IN_PROGRESS') {
        return 'In Progress';
    } else if(status === 'NOT_STARTED') {
        return 'Not Started';
    }
 }

 function getStatusClass(percentage) {
    if(percentage < 33) {
        return 'redStatus';
    } else if(percentage < 66) {
        return 'orangeStatus';
    } else if(percentage < 99) {
        return 'greenStatus';
    } else {
        return 'blueStatus';    
    }
 }

 function getStatusClassForLi(percentage) {
    if(percentage < 33) {
        return 'redStatusLi';
    } else if(percentage < 66) {
        return 'orangeStatusLi';
    } else if(percentage < 99) {
        return 'greenStatusLi';
    } else {
        return 'blueStatusLi';    
    }
 }


 function changeFilter(el) {
     console.log(el.value);
     document.getElementById('chapters').setAttribute('class', `${el.value} chapterList`);
 }