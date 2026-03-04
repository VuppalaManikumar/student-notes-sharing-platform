let form = document.getElementById("uploadForm");

const CLOUD_NAME = "dzyzwjovo";
const UPLOAD_PRESET = "notes_upload";

if (form) {

form.addEventListener("submit", async function(e){

e.preventDefault();

let title = document.getElementById("title").value;
let file = document.getElementById("file").files[0];

if(!file){
alert("Please select a file");
return;
}

let formData = new FormData();
formData.append("file", file);
formData.append("upload_preset", UPLOAD_PRESET);

try {

let response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,{
method: "POST",
body: formData
});

let data = await response.json();

if(!data.secure_url){
alert("Upload failed");
return;
}

let notes = JSON.parse(localStorage.getItem("notes")) || [];

notes.push({
title: title,
url: data.secure_url
});

localStorage.setItem("notes", JSON.stringify(notes));

alert("Notes uploaded successfully!");

form.reset();

} catch(error){

console.error(error);
alert("Upload error");

}

});

}

let notesList = document.getElementById("notesList");

if(notesList){

let notes = JSON.parse(localStorage.getItem("notes")) || [];

notes.forEach(note => {

if(note.url){

let li = document.createElement("li");

li.innerHTML = `
<h3>${note.title}</h3>
<a href="${note.url}" target="_blank">Download</a>
`;

notesList.appendChild(li);

}

});

}