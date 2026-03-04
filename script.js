let form = document.getElementById("uploadForm")

if(form){

form.addEventListener("submit",function(e){

e.preventDefault()

let title = document.getElementById("title").value

let notes = JSON.parse(localStorage.getItem("notes")) || []

notes.push(title)

localStorage.setItem("notes",JSON.stringify(notes))

alert("Notes Uploaded Successfully")

form.reset()

})

}

let notesList = document.getElementById("notesList")

if(notesList){

let notes = JSON.parse(localStorage.getItem("notes")) || []

notes.forEach(function(note){

let li = document.createElement("li")

li.textContent = note

notesList.appendChild(li)

})

}