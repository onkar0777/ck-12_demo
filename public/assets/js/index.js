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
    // console.log(parent, el);
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
        li = createNode('li', chapter.id, 'chapterListItem', true);
        span.innerHTML = ` &#128214;  ${chapter.title}`;
        span2.innerHTML = `(${chapter.childrenCount} concepts)`;
        span3.innerHTML = `${Math.round(chapter.completeCount / chapter.childrenCount)*100}% Complete`;
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


function onChapterClick(e) {
    let element = e.currentTarget;
    if(element && element.className == 'chapterListItem'){
          fetch(`${url}/section/${e.currentTarget.id}`)
          .then((resp) => resp.json())
          .then((data) => {
            let lessons = data.response[element.id];
            lessons.sort((a,b) => a.sequenceNO - b.sequenceNO);
            const parentLi = document.getElementById(element.id);
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
            append(parentLi, childUl);
            parentLi.setAttribute('class', 'showChapters chapterListItem');
        });
    } else if(element && element.className == 'showChapters chapterListItem'){
        const parentLi = document.getElementById(element.id);
        parentLi.setAttribute('class', 'hideChapters chapterListItem');
    } else if(element && element.className == 'hideChapters chapterListItem') {
        const parentLi = document.getElementById(element.id);
        parentLi.setAttribute('class', 'showChapters chapterListItem');
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